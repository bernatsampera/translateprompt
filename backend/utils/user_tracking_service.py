"""User tracking service for managing user usage and IP-based tracking.

TOKEN LIMITS:
- MAX_TOKENS_PER_IP = 4000: Limit for anonymous users (tracked by IP)
- MAX_TOKENS_PER_USER = 10000: Limit for authenticated users (tracked by user ID)
- MAX_TOKENS_PER_MINUTE = 50000: Rate limiting for LLM API calls (defined in llm_service.py)

TRACKING LOGIC:
1. If user_id exists and is not "unknown": Track usage by user_id only (no IP tracking)
2. If no user_id or user_id is "unknown": Track usage by IP address with stricter limits

This service handles all IP extraction, request context management, and usage tracking.
"""

from contextvars import ContextVar

from fastapi import HTTPException, Request

from database.connection import get_database_connection
from database.user_ip_operations import UserIPOperations
from database.user_usage_operations import UserUsageOperations
from utils.logger import logger

# Context variables to store current request context
current_request_ip: ContextVar[str] = ContextVar(
    "current_request_ip", default="unknown"
)
current_user_id: ContextVar[str] = ContextVar("current_user_id", default="unknown")


class UserTrackingService:
    """Service to handle user tracking logic based on user ID or IP address."""

    # Token limits
    MAX_TOKENS_PER_IP = 4000
    MAX_TOKENS_PER_USER = 10000  # Higher limit for authenticated users

    def __init__(self):
        """Initialize the user tracking service."""
        # Don't initialize database connections here - do it lazily when needed
        self._db_connection = None
        self._user_ip_ops = None
        self._user_usage_ops = None

    @property
    def db_connection(self):
        """Lazy initialization of database connection."""
        if self._db_connection is None:
            self._db_connection = get_database_connection()
        return self._db_connection

    @property
    def user_ip_ops(self):
        """Lazy initialization of user IP operations."""
        if self._user_ip_ops is None:
            self._user_ip_ops = UserIPOperations(db_connection=self.db_connection)
        return self._user_ip_ops

    @property
    def user_usage_ops(self):
        """Lazy initialization of user usage operations."""
        if self._user_usage_ops is None:
            self._user_usage_ops = UserUsageOperations(db_connection=self.db_connection)
        return self._user_usage_ops

    # IP and Request Context Methods
    def get_real_ip(self, request: Request) -> str:
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

    def set_request_ip(self, ip: str) -> None:
        """Set the current request's IP address in context."""
        current_request_ip.set(ip)

    def set_user_id(self, user_id: str) -> None:
        """Set the current user ID in context."""
        current_user_id.set(user_id)

    def get_user_id(self) -> str:
        """Get the current user ID from context."""
        return current_user_id.get()

    def set_request_ip_from_request(self, request: Request) -> str:
        """Extract and set the real user IP from the request.

        Args:
            request: FastAPI Request object

        Returns:
            str: The extracted IP address
        """
        real_ip = self.get_real_ip(request)
        self.set_request_ip(real_ip)
        return real_ip

    def get_request_ip(self) -> str:
        """Get the current request's IP address from context."""
        return current_request_ip.get()

    def check_and_update_usage(self, tokens_used: int) -> None:
        """Check usage limits and update token counts.

        Logic:
        1. If user_id exists: track usage by user_id only
        2. If no user_id: track usage by IP address

        Args:
            tokens_used: Number of tokens used in this request

        Raises:
            HTTPException: If usage limit is exceeded
        """
        user_id = self.get_user_id()
        ip_address = self.get_request_ip()

        logger.debug(f"Checking usage - User ID: {user_id}, IP: {ip_address}")

        if user_id and user_id != "unknown":
            self._handle_user_tracking(user_id, tokens_used)
        else:
            self._handle_ip_tracking(ip_address, tokens_used)

    def _handle_user_tracking(self, user_id: str, tokens_used: int) -> None:
        """Handle tracking for authenticated users."""
        logger.debug(f"Tracking usage for user: {user_id}")

        # Get or create user usage record
        user_usage = self.user_usage_ops.get_user(user_id)
        if not user_usage:
            logger.info(f"Creating new user usage record for: {user_id}")
            self.user_usage_ops.add_user(user_id)
            user_usage = self.user_usage_ops.get_user(user_id)

        # Check if user has exceeded limits
        if user_usage.token_count > self.MAX_TOKENS_PER_USER:
            raise HTTPException(
                status_code=429,
                detail=f"Usage limit of {self.MAX_TOKENS_PER_USER} tokens reached. "
                f"We are still in beta, join the waitlist to get access when it's released.",
            )

        # Update token count
        new_token_count = user_usage.token_count + tokens_used
        self.user_usage_ops.update_token_count(user_id, new_token_count)

        logger.info(
            f"User {user_id} usage updated: {user_usage.token_count} -> {new_token_count} tokens"
        )

    def _handle_ip_tracking(self, ip_address: str, tokens_used: int) -> None:
        """Handle tracking for anonymous users (by IP)."""
        logger.debug(f"Tracking usage for IP: {ip_address}")

        # Get or create IP record
        user_ip = self.user_ip_ops.get_user_ip(ip_address)
        if not user_ip:
            logger.info(f"Creating new IP record for: {ip_address}")
            user_ip = self.user_ip_ops.add_user_ip(ip_address)

        # Check if IP has exceeded limits
        if user_ip.token_count > self.MAX_TOKENS_PER_IP:
            raise HTTPException(
                status_code=429,
                detail=f"Usage limit of {self.MAX_TOKENS_PER_IP} tokens reached. "
                f"We are still in beta, join the waitlist to get access when it's released.",
            )

        # Update token count
        new_token_count = user_ip.token_count + tokens_used
        self.user_ip_ops.update_token_count(ip_address, new_token_count)

        logger.info(
            f"IP {ip_address} usage updated: {user_ip.token_count} -> {new_token_count} tokens"
        )

    def get_current_usage(self) -> int:
        """Get current token usage for current user or IP.

        Returns:
            Current token count
        """
        user_id = self.get_user_id()
        ip_address = self.get_request_ip()

        if user_id and user_id != "unknown":
            user_usage = self.user_usage_ops.get_user(user_id)
            return user_usage.token_count if user_usage else 0
        else:
            user_ip = self.user_ip_ops.get_user_ip(ip_address)
            return user_ip.token_count if user_ip else 0


# Usage Example:
"""
# In your FastAPI endpoint:
from fastapi import Request
from utils.user_tracking_service import UserTrackingService

user_tracking = UserTrackingService()

@app.post("/translate")
async def translate_text(request: Request):
    # Set up request context
    user_tracking.set_request_ip_from_request(request)
    user_tracking.set_user_id("user123")  # or None for anonymous users
    
    # Use LLM service (it will automatically handle tracking)
    llm_service = LLM_Service()
    response = llm_service.invoke("Translate this text")
    
    return {"translation": response.content}

# The LLM service will automatically:
# 1. Check if user_id exists -> track by user_id (limit: 10,000 tokens)
# 2. If no user_id -> track by IP (limit: 4,000 tokens)
# 3. Raise HTTPException if limits exceeded
"""
