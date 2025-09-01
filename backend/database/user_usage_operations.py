"""User IP tracking database operations."""

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
                SELECT * FROM user_usage WHERE user_id = ?
            """
            params = (user_id,)
            rows = self.db.execute_query(query, params)
            if rows:
                row = rows[0]
                return UserUsage(user_id=row["user_id"], token_count=row["token_count"])
            return None
        except Exception as e:
            print(f"Error getting user: {e}")
            return None

    def add_user(self, user_id: str) -> bool:
        """Add a new user."""
        try:
            query = """
                INSERT OR IGNORE INTO user_usage (user_id)
                VALUES (?)
            """
            params = (user_id,)
            self.db.execute_update(query, params)
            return True
        except Exception as e:
            print(f"Error adding user: {e}")
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
                INSERT OR REPLACE INTO user_usage (user_id, token_count)
                VALUES (?, ?)
            """
            params = (user_id, token_count)
            affected_rows = self.db.execute_update(query, params)
            return affected_rows > 0
        except Exception as e:
            print(f"Error updating/inserting token count: {e}")
            return False
