"""User IP tracking database operations."""

from .connection import DatabaseConnection, get_database_connection


class WaitlistOperations:
    """Handles all waitlist database operations."""

    def __init__(self, db_connection: DatabaseConnection = None):
        """Initialize with a database connection.

        Args:
            db_connection: Database connection instance. If None, uses the global connection.
        """
        self.db = db_connection or get_database_connection()

    def add_to_waitlist(self, email: str):
        """Add an email to the waitlist."""
        self.db.execute_update("INSERT INTO waitlist (email) VALUES (?)", (email,))
