"""LLM service for the backend."""

import time
from collections import deque
from datetime import datetime

from langchain.chat_models import init_chat_model
from langchain_core.messages import BaseMessage

from utils.logger import logger
from utils.user_tracking_service import UserTrackingService

# Theoretically are like 250000 on the free google api rate but let's keep it to 50k to be safe
MAX_TOKENS_PER_MINUTE = 50000


class LLM_Service:
    """LLM service for the backend."""

    def __init__(self):
        """Initialize the LLM service with primary and fallback models."""
        self.llm_primary = init_chat_model("google_genai:gemini-2.5-flash-lite")
        self.llm_fallback = init_chat_model("openai:gpt-4o-mini")
        self.history = deque()
        self.penalty_until = 0
        self._user_tracking = None

    @property
    def user_tracking(self):
        """Lazy initialization of user tracking service."""
        if self._user_tracking is None:
            self._user_tracking = UserTrackingService()
        return self._user_tracking

    def print_history(self):
        """Print the token usage history for debugging purposes."""
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

        # Calculate tokens used in last minute for rate limiting
        tokens_last_min = sum(t for _, t in self.history)

        # Select appropriate LLM based on rate limits and penalty mode
        llm = self._select_llm(now, tokens_last_min)

        # Invoke the LLM
        try:
            response = llm.invoke(prompt)
            tokens_used = response.usage_metadata["total_tokens"]
        except Exception as e:
            logger.error(f"Error with {llm.get_name()}: {e}")
            # If primary failed, activate penalty and retry with fallback
            if llm is self.llm_primary:
                self.penalty_until = now + 300  # 5 min penalty
                tokens_used = 0  # Fake high token count for penalty
                self.history.append((now, tokens_used))
                logger.warning(
                    "Primary failed. Forcing fallback + penalty mode for 5 minutes."
                )
                return self.llm_fallback.invoke(prompt)
            else:
                raise

        # Update history for primary model rate limiting
        if llm is self.llm_primary:
            self.history.append((now, tokens_used))

        # Update user tracking (handles both user ID and IP logic)
        self.user_tracking.check_and_update_usage(tokens_used)

        # logger.info(
        #     f"Model={llm.get_name()} | TokensThisCall={tokens_used} | TokensLastMin={tokens_last_min + tokens_used}"
        # )

        return response

    def _select_llm(self, now: float, tokens_last_min: int):
        """Select the appropriate LLM based on current conditions."""
        # Check penalty mode
        if now < self.penalty_until:
            return self.llm_fallback
        elif tokens_last_min > MAX_TOKENS_PER_MINUTE:
            logger.warning(
                f"Token usage in last minute = {tokens_last_min} (> {MAX_TOKENS_PER_MINUTE}). "
                f"Switching to fallback model: {self.llm_fallback.get_name()}"
            )
            return self.llm_fallback
        else:
            return self.llm_primary

    def __call__(self, *args, **kwargs):
        """Allow LLM_Service() to be called directly like an LLM."""
        return self.invoke(*args, **kwargs)

    def __getattr__(self, name):
        """Forward unknown attributes/methods to the primary LLM instance so that LLM_Service exposes the same interface."""
        return getattr(self.llm_primary, name)
