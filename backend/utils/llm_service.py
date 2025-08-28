"""LLM service for the backend."""

import time
from collections import deque
from contextvars import ContextVar
from datetime import datetime

from dotenv import load_dotenv
from fastapi import HTTPException, Request
from langchain.chat_models import init_chat_model
from langchain_core.messages import BaseMessage

from database.connection import create_database_connection
from database.user_ip_operations import UserIPOperations
from utils.logger import logger

load_dotenv()

# Teoretically are like 250000 on the free google api rate but let's keep it to 50k to be safe
MAX_TOKENS_PER_MINUTE = 50000

# 10k tokens in total
MAX_TOKENS_PER_IP = 4000

# Create UserIPOperations with config database path
_db_connection = create_database_connection()
UserIPOperations = UserIPOperations(db_connection=_db_connection)

# Context variable to store current request's IP address
current_request_ip: ContextVar[str] = ContextVar(
    "current_request_ip", default="unknown"
)


def get_real_ip(request: Request) -> str:
    """Extract the real user IP address from the request.

    This function checks multiple headers to find the real user IP,
    handling cases where the application is behind reverse proxies,
    load balancers, or CDNs like Cloudflare.

    Args:
        request: FastAPI Request object

    Returns:
        str: The real user IP address
    """
    # Headers to check in order of preference
    # X-Forwarded-For is the most common, but others are used by different proxies
    headers_to_check = [
        "x-forwarded-for",  # Standard proxy header
        "x-real-ip",  # Nginx and other proxies
        "cf-connecting-ip",  # Cloudflare
        "x-client-ip",  # Some proxies
        "x-forwarded",  # Some proxies
        "forwarded-for",  # RFC 7239
        "forwarded",  # RFC 7239
    ]

    # Check each header for IP address
    for header in headers_to_check:
        ip = request.headers.get(header)
        if ip:
            # X-Forwarded-For can contain multiple IPs (client, proxy1, proxy2, ...)
            # The first one is usually the original client IP
            if header == "x-forwarded-for":
                ip = ip.split(",")[0].strip()

            # Basic validation to ensure it's a valid IP-like string
            if (
                ip
                and ip != "unknown"
                and not ip.startswith("127.")
                and not ip.startswith("::1")
            ):
                return ip

    # Fallback to request.client.host if no headers found
    # This will be the Docker container IP in containerized environments
    fallback_ip = request.client.host if request.client else "unknown"

    # Log for debugging purposes
    logger.info(f"No real IP found in headers, using fallback: {fallback_ip}")
    logger.debug(f"Available headers: {dict(request.headers)}")

    return fallback_ip


def set_request_ip(ip: str) -> None:
    """Set the current request's IP address in context."""
    current_request_ip.set(ip)


def set_request_ip_from_request(request: Request) -> str:
    """Extract and set the real user IP from the request.

    Args:
        request: FastAPI Request object

    Returns:
        str: The extracted IP address
    """
    real_ip = get_real_ip(request)
    set_request_ip(real_ip)
    return real_ip


def get_request_ip() -> str:
    """Get the current request's IP address from context."""
    return current_request_ip.get()


class LLM_Service:
    """LLM service for the backend."""

    def __init__(self):
        self.llm_primary = init_chat_model("google_genai:gemini-2.5-flash-lite")
        self.llm_fallback = init_chat_model("openai:gpt-4o-mini")
        self.history = deque()
        self.penalty_until = 0

    def print_history(self):
        now = time.time()
        if not self.history:
            logger.info("History is empty.")
            return
        logger.info("\n=== Token History ===")
        for ts, tokens in list(self.history):
            dt = datetime.fromtimestamp(ts).strftime("%H:%M:%S")
            minutes_ago = round((now - ts) / 60, 2)
            logger.info(f"{dt} | {tokens} tokens | {minutes_ago} min ago")
        logger.info("=====================\n")

    def invoke(self, prompt: str) -> BaseMessage:
        """Invoke the LLM with the given prompt."""
        now = time.time()
        request_ip = current_request_ip.get()
        user = UserIPOperations.get_user_ip(request_ip)

        if not user:
            user = UserIPOperations.add_user_ip(request_ip)

        if user and user.token_count > MAX_TOKENS_PER_IP:
            raise HTTPException(
                status_code=429,
                detail=f"Usage Limit of {MAX_TOKENS_PER_IP} tokens reached. We are still in our beta, join the waitlist to get access when it's released.",
            )

        # Clean history (older than 60s)
        while self.history and now - self.history[0][0] > 60:
            self.history.popleft()

        ## Uncomment for debugging purposes
        # self.print_history()

        tokens_last_min = sum(t for _, t in self.history)

        # Check penalty mode
        if now < self.penalty_until:
            llm = self.llm_fallback
            logger.warning("Penalty active: forcing fallback model.")
        elif tokens_last_min > MAX_TOKENS_PER_MINUTE:
            llm = self.llm_fallback
            logger.warning(
                f"Token usage in last minute = {tokens_last_min} (> {MAX_TOKENS_PER_MINUTE}). "
                f"Switching to fallback model: {self.llm_fallback.get_name()}"
            )
        else:
            llm = self.llm_primary
            logger.info(
                f"Token usage in last minute = {tokens_last_min}. "
                f"Using primary model: {self.llm_primary.get_name()}"
            )

        # Try calling model
        try:
            response = llm.invoke(prompt)
            used = response.usage_metadata["total_tokens"]
        except Exception as e:
            logger.error(f"Error with {llm.get_name()}: {e}")
            # If it was the primary, activate penalty + retry with fallback
            if llm is self.llm_primary:
                self.penalty_until = now + 300  # 5 min penalty
                used = 2500  # fake >2000 tokens
                self.history.append((now, used))
                logger.warning(
                    "Primary failed. Forcing fallback + penalty mode for 5 minutes."
                )
                return self.llm_fallback.invoke(prompt)
            else:
                raise
        if llm is self.llm_primary:
            self.history.append((now, used))

        logger.info(
            f"Model={llm.get_name()} | TokensThisCall={used} | TokensLastMin={tokens_last_min + used}"
        )

        UserIPOperations.update_token_count(request_ip, user.token_count + used)

        return response

    def __call__(self, *args, **kwargs):
        """Allow LLM_Service() to be called directly like an LLM."""
        return self.invoke(*args, **kwargs)

    def __getattr__(self, name):
        """Forward unknown attributes/methods to the primary LLM instance so that LLM_Service exposes the same interface."""
        return getattr(self.llm_primary, name)
