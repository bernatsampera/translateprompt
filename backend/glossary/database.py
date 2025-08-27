"""Database operations and connection management for glossary storage."""

import sqlite3
from contextlib import contextmanager
from datetime import datetime
from pathlib import Path
from typing import Dict, List

from .models import GLOSSARY_INDEX_SCHEMA, GLOSSARY_TABLE_SCHEMA, GlossaryEntry


class GlossaryDatabase:
    """Handles all database operations for glossary management."""

    def __init__(self, db_path: str = None):
        """Initialize the database connection.

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
            cursor.execute(GLOSSARY_TABLE_SCHEMA)
            cursor.execute(GLOSSARY_INDEX_SCHEMA)
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

    def add_entry(self, entry: GlossaryEntry) -> bool:
        """Add or update a glossary entry.

        Args:
            entry: The glossary entry to add or update.

        Returns:
            True if added successfully, False otherwise.
        """
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
                    (
                        entry.source_language,
                        entry.target_language,
                        entry.source_text.lower(),
                        entry.target_text,
                        entry.note,
                    ),
                )

                conn.commit()
                return True
        except sqlite3.Error as e:
            print(f"Error adding entry to glossary: {e}")
            return False

    def remove_entry(
        self, source_text: str, source_language: str = "en", target_language: str = "es"
    ) -> bool:
        """Remove a glossary entry.

        Args:
            source_text: The source text to remove.
            source_language: Source language code (default: "en").
            target_language: Target language code (default: "es").

        Returns:
            True if removed successfully, False if entry not found or error occurred.
        """
        try:
            with self._get_connection() as conn:
                cursor = conn.cursor()

                cursor.execute(
                    """
                    DELETE FROM glossary_entries 
                    WHERE source_language = ? AND target_language = ? AND source_text = ?
                """,
                    (source_language, target_language, source_text.lower()),
                )

                conn.commit()
                return cursor.rowcount > 0
        except sqlite3.Error as e:
            print(f"Error removing entry from glossary: {e}")
            return False

    def get_entry(
        self, source_text: str, source_language: str = "en", target_language: str = "es"
    ) -> GlossaryEntry | None:
        """Get a specific glossary entry.

        Args:
            source_text: The source text to look up.
            source_language: Source language code (default: "en").
            target_language: Target language code (default: "es").

        Returns:
            GlossaryEntry if found, None otherwise.
        """
        try:
            with self._get_connection() as conn:
                cursor = conn.cursor()

                cursor.execute(
                    """
                    SELECT * FROM glossary_entries 
                    WHERE source_language = ? AND target_language = ? AND source_text = ?
                """,
                    (source_language, target_language, source_text.lower()),
                )

                row = cursor.fetchone()
                if row:
                    return GlossaryEntry(
                        id=row["id"],
                        source_language=row["source_language"],
                        target_language=row["target_language"],
                        source_text=row["source_text"],
                        target_text=row["target_text"],
                        note=row["note"],
                        created_at=datetime.fromisoformat(row["created_at"])
                        if row["created_at"]
                        else None,
                        updated_at=datetime.fromisoformat(row["updated_at"])
                        if row["updated_at"]
                        else None,
                    )
                return None
        except sqlite3.Error as e:
            print(f"Error getting entry from glossary: {e}")
            return None

    def get_all_entries(
        self, source_language: str = "en", target_language: str = "es"
    ) -> List[GlossaryEntry]:
        """Get all glossary entries for a specific language pair.

        Args:
            source_language: Source language code (default: "en").
            target_language: Target language code (default: "es").

        Returns:
            List of GlossaryEntry objects.
        """
        try:
            with self._get_connection() as conn:
                cursor = conn.cursor()

                cursor.execute(
                    """
                    SELECT * FROM glossary_entries 
                    WHERE source_language = ? AND target_language = ?
                    ORDER BY source_text
                """,
                    (source_language, target_language),
                )

                entries = []
                for row in cursor.fetchall():
                    entry = GlossaryEntry(
                        id=row["id"],
                        source_language=row["source_language"],
                        target_language=row["target_language"],
                        source_text=row["source_text"],
                        target_text=row["target_text"],
                        note=row["note"],
                        created_at=datetime.fromisoformat(row["created_at"])
                        if row["created_at"]
                        else None,
                        updated_at=datetime.fromisoformat(row["updated_at"])
                        if row["updated_at"]
                        else None,
                    )
                    entries.append(entry)
                return entries
        except sqlite3.Error as e:
            print(f"Error getting all entries from glossary: {e}")
            return []

    def get_entries_dict(
        self, source_language: str = "en", target_language: str = "es"
    ) -> Dict[str, Dict[str, str]]:
        """Get all entries as a dictionary format for backward compatibility.

        Args:
            source_language: Source language code (default: "en").
            target_language: Target language code (default: "es").

        Returns:
            Dictionary mapping source text to target and note data.
        """
        entries = self.get_all_entries(source_language, target_language)
        result = {}
        for entry in entries:
            result[entry.source_text] = {
                "target": entry.target_text,
                "note": entry.note,
            }
        return result
