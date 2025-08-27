"""LLM service for the backend."""

import time
from collections import deque
from datetime import datetime

from dotenv import load_dotenv
from langchain.chat_models import init_chat_model
from langchain_core.messages import BaseMessage

from utils.logger import logger

load_dotenv()

# Teoretically are like 250000 on the free google api rate but let's keep it to 50k to be safe
MAX_TOKENS_PER_MINUTE = 50000


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
        return response

    def __call__(self, *args, **kwargs):
        """Allow LLM_Service() to be called directly like an LLM."""
        return self.invoke(*args, **kwargs)

    def __getattr__(self, name):
        """Forward unknown attributes/methods to the primary LLM instance so that LLM_Service exposes the same interface."""
        return getattr(self.llm_primary, name)
