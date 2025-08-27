"""Glossary management module for handling SQLite-based glossary storage with language support."""

import sqlite3
from contextlib import contextmanager
from pathlib import Path
from typing import Dict

from config import config


class GlossaryManager:
    """Manages glossary operations with SQLite database storage and language support."""

    def __init__(self, db_path: str = None):
        """Initialize the glossary manager.

        Args:
            db_path: Path to the glossary SQLite database. If None, uses default path.
        """
        if db_path is None:
            # Default to glossary.db in the same directory as this file
            self.db_path = Path(__file__).parent / "glossary.db"
        else:
            self.db_path = Path(db_path)

        self._init_database()

    def _init_database(self):
        """Initialize the SQLite database with required tables."""
        with self._get_connection() as conn:
            cursor = conn.cursor()

            # Create glossary entries table
            cursor.execute(
                """
                CREATE TABLE IF NOT EXISTS glossary_entries (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    source_language TEXT NOT NULL,
                    target_language TEXT NOT NULL,
                    source_text TEXT NOT NULL,
                    target_text TEXT NOT NULL,
                    note TEXT DEFAULT '',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    UNIQUE(source_language, target_language, source_text)
                )
            """
            )

            # Create index for faster lookups
            cursor.execute(
                """
                CREATE INDEX IF NOT EXISTS idx_glossary_lookup 
                ON glossary_entries(source_language, target_language, source_text)
            """
            )

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

    def add_source(
        self,
        source: str,
        target: str,
        source_language: str = "en",
        target_language: str = "es",
        note: str = "",
    ) -> bool:
        """Add or update a source in the glossary.

        Args:
            source: The source text to translate.
            target: The translation target.
            source_language: Source language code (default: "en" for English).
            target_language: Target language code (default: "es" for Spanish).
            note: Optional note about when to use this translation.

        Returns:
            True if added successfully, False otherwise.
        """
        # Check production mode before making changes
        config.validate_production_operation("add glossary entry")

        try:
            with self._get_connection() as conn:
                cursor = conn.cursor()

                # Use INSERT OR REPLACE to handle duplicates
                cursor.execute(
                    """
                    INSERT OR REPLACE INTO glossary_entries 
                    (source_language, target_language, source_text, target_text, note, updated_at)
                    VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
                """,
                    (source_language, target_language, source.lower(), target, note),
                )

                conn.commit()
                return True
        except sqlite3.Error as e:
            print(f"Error adding source to glossary: {e}")
            return False

    def remove_source(
        self, source: str, source_language: str = "en", target_language: str = "es"
    ) -> bool:
        """Remove a source from the glossary.

        Args:
            source: The source to remove.
            source_language: Source language code (default: "en").
            target_language: Target language code (default: "es").

        Returns:
            True if removed successfully, False if source not found or error occurred.
        """
        # Check production mode before making changes
        config.validate_production_operation("remove glossary entry")

        try:
            with self._get_connection() as conn:
                cursor = conn.cursor()

                cursor.execute(
                    """
                    DELETE FROM glossary_entries 
                    WHERE source_language = ? AND target_language = ? AND source_text = ?
                """,
                    (source_language, target_language, source.lower()),
                )

                conn.commit()
                return cursor.rowcount > 0
        except sqlite3.Error as e:
            print(f"Error removing source from glossary: {e}")
            return False

    def get_source(
        self, source: str, source_language: str = "en", target_language: str = "es"
    ) -> Dict[str, str] | None:
        """Get a specific source from the glossary.

        Args:
            source: The source to look up.
            source_language: Source language code (default: "en").
            target_language: Target language code (default: "es").

        Returns:
            Dictionary with 'target' and 'note' keys, or None if not found.
        """
        try:
            with self._get_connection() as conn:
                cursor = conn.cursor()

                cursor.execute(
                    """
                    SELECT target_text, note FROM glossary_entries 
                    WHERE source_language = ? AND target_language = ? AND source_text = ?
                """,
                    (source_language, target_language, source.lower()),
                )

                row = cursor.fetchone()
                if row:
                    return {"target": row["target_text"], "note": row["note"]}
                return None
        except sqlite3.Error as e:
            print(f"Error getting source from glossary: {e}")
            return None

    def get_all_sources(
        self, source_language: str = "en", target_language: str = "es"
    ) -> Dict[str, Dict[str, str]]:
        """Get all sources from the glossary for a specific language pair.

        Args:
            source_language: Source language code (default: "en").
            target_language: Target language code (default: "es").

        Returns:
            Dictionary mapping source text to target and note data.
        """
        try:
            with self._get_connection() as conn:
                cursor = conn.cursor()

                cursor.execute(
                    """
                    SELECT source_text, target_text, note FROM glossary_entries 
                    WHERE source_language = ? AND target_language = ?
                    ORDER BY source_text
                """,
                    (source_language, target_language),
                )

                result = {}
                for row in cursor.fetchall():
                    result[row["source_text"]] = {
                        "target": row["target_text"],
                        "note": row["note"],
                    }
                return result
        except sqlite3.Error as e:
            print(f"Error getting all sources from glossary: {e}")
            return {}
