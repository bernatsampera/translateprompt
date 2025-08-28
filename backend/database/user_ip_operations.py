"""User IP tracking database operations."""

from datetime import datetime
from typing import List

from .connection import DatabaseConnection
from .models import UserIP


class UserIPOperations:
    """Handles all user IP tracking database operations."""

    def __init__(self, db_connection: DatabaseConnection = None):
        """Initialize with a database connection.

        Args:
            db_connection: Database connection instance. If None, creates a new one.
        """
        self.db = db_connection or DatabaseConnection()

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
            print(f"Error adding user IP: {e}")
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
            print(f"Error getting user IP: {e}")
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
            print(f"Error updating token count: {e}")
            return False

    def increment_token_count(self, ip_address: str, increment: int = 1) -> bool:
        """Increment the token count for a user IP.

        Args:
            ip_address: The IP address to update.
            increment: Amount to increment by (default: 1).

        Returns:
            True if updated successfully, False otherwise.
        """
        try:
            query = """
                UPDATE user_ips 
                SET token_count = token_count + ?
                WHERE ip_address = ?
            """
            params = (increment, ip_address)

            affected_rows = self.db.execute_update(query, params)
            return affected_rows > 0
        except Exception as e:
            print(f"Error incrementing token count: {e}")
            return False

    def get_all_user_ips(self) -> List[UserIP]:
        """Get all user IP records.

        Returns:
            List of UserIP objects.
        """
        try:
            query = """
                SELECT * FROM user_ips 
                ORDER BY created_at DESC
            """

            rows = self.db.execute_query(query)
            user_ips = []
            for row in rows:
                user_ip = UserIP(
                    ip_address=row["ip_address"],
                    created_at=datetime.fromisoformat(row["created_at"])
                    if row["created_at"]
                    else None,
                    token_count=row["token_count"],
                )
                user_ips.append(user_ip)
            return user_ips
        except Exception as e:
            print(f"Error getting all user IPs: {e}")
            return []

    def remove_user_ip(self, ip_address: str) -> bool:
        """Remove a user IP record.

        Args:
            ip_address: The IP address to remove.

        Returns:
            True if removed successfully, False otherwise.
        """
        try:
            query = """
                DELETE FROM user_ips 
                WHERE ip_address = ?
            """
            params = (ip_address,)

            affected_rows = self.db.execute_update(query, params)
            return affected_rows > 0
        except Exception as e:
            print(f"Error removing user IP: {e}")
            return False
