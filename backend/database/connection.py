"""Database connection and initialization management."""

import sqlite3
from contextlib import contextmanager
from pathlib import Path
from typing import List

from .schemas import (
    GLOSSARY_INDEX_SCHEMA,
    GLOSSARY_TABLE_SCHEMA,
    USER_IP_TABLE_SCHEMA,
    WAITLIST_TABLE_SCHEMA,
)


def create_database_connection(db_path: str = None) -> "DatabaseConnection":
    """Create a DatabaseConnection with proper path handling.

    Args:
        db_path: Path to the SQLite database. If None, uses default path.

    Returns:
        DatabaseConnection instance configured with the appropriate path.
    """
    from config import config

    if db_path is None:
        db_path = config.DATABASE_PATH

    return DatabaseConnection(db_path=db_path) if db_path else DatabaseConnection()


class DatabaseConnection:
    """Manages database connections and initialization."""

    def __init__(self, db_path: str = None):
        """Initialize the database connection.

        Args:
            db_path: Path to the SQLite database. If None, uses default path.
        """
        if db_path is None:
            # Default to glossary.db in the database directory
            self.db_path = Path(__file__).parent / "glossary.db"
        else:
            self.db_path = Path(db_path)

        self._init_database()

    def _init_database(self):
        """Initialize the SQLite database with all required tables."""
        with self._get_connection() as conn:
            cursor = conn.cursor()

            # Create all tables
            cursor.execute(GLOSSARY_TABLE_SCHEMA)
            cursor.execute(GLOSSARY_INDEX_SCHEMA)
            cursor.execute(USER_IP_TABLE_SCHEMA)
            cursor.execute(WAITLIST_TABLE_SCHEMA)

            # Add more table creation statements here as needed
            # cursor.execute(ANALYTICS_TABLE_SCHEMA)

            conn.commit()

    @contextmanager
    def _get_connection(self):
        """Context manager for database connections."""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row  # Enable dict-like access to rows
        try:
            yield conn
        finally:
            conn.close()

    def execute_query(self, query: str, params: tuple = ()) -> List[sqlite3.Row]:
        """Execute a SELECT query and return results.

        Args:
            query: SQL query to execute
            params: Query parameters

        Returns:
            List of rows as sqlite3.Row objects
        """
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(query, params)
            return cursor.fetchall()

    def execute_update(self, query: str, params: tuple = ()) -> int:
        """Execute an INSERT, UPDATE, or DELETE query.

        Args:
            query: SQL query to execute
            params: Query parameters

        Returns:
            Number of affected rows
        """
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(query, params)
            conn.commit()
            return cursor.rowcount

    def execute_many(self, query: str, params_list: List[tuple]) -> int:
        """Execute a query with multiple parameter sets.

        Args:
            query: SQL query to execute
            params_list: List of parameter tuples

        Returns:
            Number of affected rows
        """
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.executemany(query, params_list)
            conn.commit()
            return cursor.rowcount
