"""User IP tracking database operations."""

from utils.logger import logger

from .connection import DatabaseConnection, get_database_connection
from .models import UserUsage


class UserUsageOperations:
    """Handles all user IP tracking database operations."""

    def __init__(self, db_connection: DatabaseConnection = None):
        """Initialize with a database connection.

        Args:
            db_connection: Database connection instance. If None, uses the global connection.
        """
        self.db = db_connection or get_database_connection()

    def get_user(self, user_id: str) -> UserUsage:
        """Get a user by user ID."""
        try:
            query = """
                SELECT * FROM user WHERE user_id = ?
            """
            params = (user_id,)
            rows = self.db.execute_query(query, params)
            if rows:
                row = rows[0]
                return UserUsage.from_dict(dict(row))
            return None
        except Exception as e:
            logger.error(f"Error getting user: {e}")
            return None

    def add_user(self, user_id: str) -> bool:
        """Add a new user."""
        try:
            query = """
                INSERT OR IGNORE INTO user (user_id)
                VALUES (?)
            """
            params = (user_id,)
            self.db.execute_update(query, params)
            return True
        except Exception as e:
            logger.error(f"Error adding user: {e}")
            return False

    def update_token_count(self, user_id: str, token_count: int) -> bool:
        """Update the token count for a user. If user doesn't exist, create a new record.

        Args:
            user_id: The user ID to update or create.
            token_count: The new token count.

        Returns:
            True if operation was successful, False otherwise.
        """
        try:
            query = """
                INSERT OR REPLACE INTO user (user_id, token_count)
                VALUES (?, ?)
            """
            params = (user_id, token_count)
            affected_rows = self.db.execute_update(query, params)
            return affected_rows > 0
        except Exception as e:
            logger.error(f"Error updating/inserting token count: {e}")
            return False

    def get_user_by_customer_id(self, customer_id: int) -> UserUsage:
        """Get a user by their Lemon Squeezy customer ID."""
        try:
            query = """
                SELECT * FROM user WHERE lemonsqueezy_customer_id = ?
            """
            params = (customer_id,)
            rows = self.db.execute_query(query, params)
            if rows:
                row = rows[0]
                return UserUsage.from_dict(dict(row))
            return None
        except Exception as e:
            logger.error(f"Error getting user by customer ID: {e}")
            return None

    def update_subscription_info(
        self,
        user_id: str,
        customer_id: int | None = None,
        subscription_status: str | None = None,
        quota_limit: int | None = None,
        quota_used: int | None = None,
        billing_portal_url: str | None = None,
    ) -> bool:
        """Update subscription information for a user.

        Args:
            user_id: The user ID to update.
            customer_id: Lemon Squeezy customer ID.
            subscription_status: Current subscription status.
            quota_limit: Monthly quota limit.
            quota_used: Current quota usage.
            billing_portal_url: Customer portal URL.

        Returns:
            True if operation was successful, False otherwise.
        """
        try:
            # Build dynamic query based on provided parameters
            update_fields = []
            params = []

            if customer_id is not None:
                update_fields.append("lemonsqueezy_customer_id = ?")
                params.append(customer_id)
            if subscription_status is not None:
                update_fields.append("subscription_status = ?")
                params.append(subscription_status)
            if quota_limit is not None:
                update_fields.append("quota_limit = ?")
                params.append(quota_limit)
            if quota_used is not None:
                update_fields.append("quota_used = ?")
                params.append(quota_used)
            if billing_portal_url is not None:
                update_fields.append("billing_portal_url = ?")
                params.append(billing_portal_url)

            if not update_fields:
                return False

            query = f"""
                UPDATE user 
                SET {", ".join(update_fields)}
                WHERE user_id = ?
            """
            params.append(user_id)

            affected_rows = self.db.execute_update(query, params)
            return affected_rows > 0
        except Exception as e:
            logger.error(f"Error updating subscription info: {e}")
            return False

    def update_subscription_info_by_customer_id(
        self,
        customer_id: int,
        subscription_status: str | None = None,
        quota_limit: int | None = None,
        quota_used: int | None = None,
        billing_portal_url: str | None = None,
    ) -> bool:
        """Update subscription information for a user by customer ID.

        Args:
            customer_id: Lemon Squeezy customer ID.
            subscription_status: Current subscription status.
            quota_limit: Monthly quota limit.
            quota_used: Current quota usage.
            billing_portal_url: Customer portal URL.

        Returns:
            True if operation was successful, False otherwise.
        """
        try:
            # Build dynamic query based on provided parameters
            update_fields = []
            params = []

            if subscription_status is not None:
                update_fields.append("subscription_status = ?")
                params.append(subscription_status)
            if quota_limit is not None:
                update_fields.append("quota_limit = ?")
                params.append(quota_limit)
            if quota_used is not None:
                update_fields.append("quota_used = ?")
                params.append(quota_used)
            if billing_portal_url is not None:
                update_fields.append("billing_portal_url = ?")
                params.append(billing_portal_url)

            if not update_fields:
                return False

            query = f"""
                UPDATE user 
                SET {", ".join(update_fields)}
                WHERE lemonsqueezy_customer_id = ?
            """
            params.append(customer_id)

            affected_rows = self.db.execute_update(query, params)
            return affected_rows > 0
        except Exception as e:
            logger.error(f"Error updating subscription info by customer ID: {e}")
            return False
