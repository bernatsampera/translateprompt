"""User IP tracking database operations."""

from datetime import datetime

from utils.logger import logger

from .connection import DatabaseConnection, get_database_connection
from .models import UserIP


class UserIPOperations:
    """Handles all user IP tracking database operations."""

    def __init__(self, db_connection: DatabaseConnection = None):
        """Initialize with a database connection.

        Args:
            db_connection: Database connection instance. If None, uses the global connection.
        """
        self.db = db_connection or get_database_connection()

    def add_user_ip(self, ip_address: str) -> UserIP:
        """Add a new user IP address.

        Args:
            ip_address: The IP address to add.

        Returns:
            True if added successfully, False otherwise.
        """
        try:
            query = """
                INSERT OR IGNORE INTO user_ips (ip_address)
                VALUES (?)
            """
            params = (ip_address,)

            self.db.execute_update(query, params)
            return UserIP(ip_address=ip_address, token_count=0)
        except Exception as e:
            logger.error(f"Error adding user IP: {e}")
            return None

    def get_user_ip(self, ip_address: str) -> UserIP | None:
        """Get a specific user IP record.

        Args:
            ip_address: The IP address to look up.

        Returns:
            UserIP if found, None otherwise.
        """
        try:
            query = """
                SELECT * FROM user_ips 
                WHERE ip_address = ?
            """
            params = (ip_address,)

            rows = self.db.execute_query(query, params)
            if rows:
                row = rows[0]
                return UserIP(
                    ip_address=row["ip_address"],
                    created_at=datetime.fromisoformat(row["created_at"])
                    if row["created_at"]
                    else None,
                    token_count=row["token_count"],
                )
            return None
        except Exception as e:
            logger.error(f"Error getting user IP: {e}")
            return None

    def update_token_count(self, ip_address: str, token_count: int) -> bool:
        """Update the token count for a user IP.

        Args:
            ip_address: The IP address to update.
            token_count: The new token count.

        Returns:
            True if updated successfully, False otherwise.
        """
        try:
            query = """
                UPDATE user_ips 
                SET token_count = ?
                WHERE ip_address = ?
            """
            params = (token_count, ip_address)
            affected_rows = self.db.execute_update(query, params)
            return affected_rows > 0
        except Exception as e:
            logger.error(f"Error updating token count: {e}")
            return False
