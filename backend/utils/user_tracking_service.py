"""User tracking service for managing user usage and IP-based tracking."""

from fastapi import HTTPException

from database.connection import create_database_connection
from database.user_ip_operations import UserIPOperations
from database.user_usage_operations import UserUsageOperations
from utils.logger import logger


class UserTrackingService:
    """Service to handle user tracking logic based on user ID or IP address."""

    # Token limits
    MAX_TOKENS_PER_IP = 4000

    def __init__(self):
        """Initialize the user tracking service with database connections."""
        self._db_connection = create_database_connection()
        self.user_ip_ops = UserIPOperations(db_connection=self._db_connection)
        self.user_usage_ops = UserUsageOperations(db_connection=self._db_connection)

    def check_and_update_usage(
        self, user_id: str | None, ip_address: str, tokens_used: int
    ) -> None:
        """Check usage limits and update token counts.

        Logic:
        1. If user_id exists: track usage by user_id only
        2. If no user_id: track usage by IP address

        Args:
            user_id: User ID if available, None otherwise
            ip_address: Client IP address
            tokens_used: Number of tokens used in this request

        Raises:
            HTTPException: If usage limit is exceeded
        """
        if user_id:
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

    def get_current_usage(self, user_id: str | None, ip_address: str) -> int:
        """Get current token usage for user or IP.

        Args:
            user_id: User ID if available
            ip_address: Client IP address

        Returns:
            Current token count
        """
        if user_id:
            user_usage = self.user_usage_ops.get_user(user_id)
            return user_usage.token_count if user_usage else 0
        else:
            user_ip = self.user_ip_ops.get_user_ip(ip_address)
            return user_ip.token_count if user_ip else 0
