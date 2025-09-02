"""Glossary database operations."""

from datetime import datetime
from typing import Dict, List

from utils.logger import logger

from .connection import DatabaseConnection, get_database_connection
from .models import GlossaryEntry


class GlossaryOperations:
    """Handles all glossary database operations."""

    def __init__(self, db_connection: DatabaseConnection = None):
        """Initialize with a database connection.

        Args:
            db_connection: Database connection instance. If None, uses the global connection.
        """
        self.db = db_connection or get_database_connection()

    def add_entry(self, entry: GlossaryEntry) -> bool:
        """Add or update a glossary entry.

        Args:
            entry: The glossary entry to add or update.

        Returns:
            True if added successfully, False otherwise.
        """
        try:
            query = """
                INSERT OR REPLACE INTO glossary_entries 
                (source_language, target_language, source_text, target_text, note, user_id, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
            """
            params = (
                entry.source_language,
                entry.target_language,
                entry.source_text.lower(),
                entry.target_text,
                entry.note,
                entry.user_id,
            )

            self.db.execute_update(query, params)
            return True
        except Exception as e:
            logger.error(f"Error adding entry to glossary: {e}")
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
            query = """
                DELETE FROM glossary_entries 
                WHERE source_language = ? AND target_language = ? AND source_text = ?
            """
            params = (source_language, target_language, source_text.lower())

            affected_rows = self.db.execute_update(query, params)
            return affected_rows > 0
        except Exception as e:
            logger.error(f"Error removing entry from glossary: {e}")
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
            query = """
                SELECT * FROM glossary_entries 
                WHERE source_language = ? AND target_language = ? AND source_text = ?
            """
            params = (source_language, target_language, source_text.lower())

            rows = self.db.execute_query(query, params)
            if rows:
                row = rows[0]
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
        except Exception as e:
            logger.error(f"Error getting entry from glossary: {e}")
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
            query = """
                SELECT * FROM glossary_entries 
                WHERE source_language = ? AND target_language = ?
                ORDER BY source_text
            """
            params = (source_language, target_language)

            rows = self.db.execute_query(query, params)
            entries = []
            for row in rows:
                entry = GlossaryEntry(
                    id=row["id"],
                    source_language=row["source_language"],
                    target_language=row["target_language"],
                    source_text=row["source_text"],
                    target_text=row["target_text"],
                    user_id=row["user_id"],
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
        except Exception as e:
            logger.error(f"Error getting all entries from glossary: {e}")
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

    def get_entries_dict_for_user(
        self, user_id: str, source_language: str = "en", target_language: str = "es"
    ) -> Dict[str, Dict[str, str]]:
        """Get all entries as a dictionary format for a specific user and language pair.

        Args:
            user_id: The user ID.
            source_language: Source language code (default: "en").
            target_language: Target language code (default: "es").
        """
        all_entries = self.get_all_entries(source_language, target_language)
        entries = [entry for entry in all_entries if entry.user_id == user_id]
        result = {}
        for entry in entries:
            result[entry.source_text] = {
                "target": entry.target_text,
                "note": entry.note,
            }
        return result
