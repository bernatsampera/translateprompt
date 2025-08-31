"""Language rules-specific database operations."""

from datetime import datetime
from typing import List

from .connection import DatabaseConnection
from .models import LangRuleEntry


class RulesOperations:
    """Handles all language rules-specific database operations."""

    def __init__(self, db_connection: DatabaseConnection = None):
        """Initialize with a database connection.

        Args:
            db_connection: Database connection instance. If None, creates a new one.
        """
        self.db = db_connection or DatabaseConnection()

    def add_entry(self, entry: LangRuleEntry) -> bool:
        """Add or update a language rule entry.

        Args:
            entry: The language rule entry to add or update.

        Returns:
            True if added successfully, False otherwise.
        """
        try:
            query = """
                INSERT OR REPLACE INTO lang_rule_entries 
                (text, user_id, source_language, target_language, updated_at)
                VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
            """
            params = (
                entry.text,
                entry.user_id,
                entry.source_language,
                entry.target_language,
            )

            self.db.execute_update(query, params)
            return True
        except Exception as e:
            print(f"Error adding entry to language rules: {e}")
            return False

    def remove_entry(
        self, text: str, user_id: str, source_language: str, target_language: str
    ) -> bool:
        """Remove a language rule entry.

        Args:
            text: The rule text to remove.
            user_id: The user ID who owns the rule.
            source_language: Source language code.
            target_language: Target language code.

        Returns:
            True if removed successfully, False if entry not found or error occurred.
        """
        try:
            query = """
                DELETE FROM lang_rule_entries 
                WHERE text = ? AND user_id = ? AND source_language = ? AND target_language = ?
            """
            params = (text, user_id, source_language, target_language)

            affected_rows = self.db.execute_update(query, params)
            return affected_rows > 0
        except Exception as e:
            print(f"Error removing entry from language rules: {e}")
            return False

    def get_entry(
        self, text: str, user_id: str, source_language: str, target_language: str
    ) -> LangRuleEntry | None:
        """Get a specific language rule entry for a user.

        Args:
            text: The rule text to look up.
            user_id: The user ID who owns the rule.
            source_language: Source language code.
            target_language: Target language code.

        Returns:
            LangRuleEntry if found, None otherwise.
        """
        try:
            query = """
                SELECT * FROM lang_rule_entries 
                WHERE text = ? AND user_id = ? AND source_language = ? AND target_language = ?
            """
            params = (text, user_id, source_language, target_language)

            rows = self.db.execute_query(query, params)
            if rows:
                row = rows[0]
                return LangRuleEntry(
                    id=row["id"],
                    user_id=row["user_id"],
                    source_language=row["source_language"],
                    target_language=row["target_language"],
                    text=row["text"],
                    created_at=datetime.fromisoformat(row["created_at"])
                    if row["created_at"]
                    else None,
                    updated_at=datetime.fromisoformat(row["updated_at"])
                    if row["updated_at"]
                    else None,
                )
            return None
        except Exception as e:
            print(f"Error getting entry from language rules: {e}")
            return None

    def get_entries_for_user(
        self, user_id: str, source_language: str = "en", target_language: str = "es"
    ) -> List[LangRuleEntry]:
        """Get all language rule entries for a specific user and language pair.

        Args:
            user_id: The user ID.
            source_language: Source language code (default: "en").
            target_language: Target language code (default: "es").

        Returns:
            List of LangRuleEntry objects for the user.
        """
        try:
            query = """
                SELECT * FROM lang_rule_entries 
                WHERE user_id = ? AND source_language = ? AND target_language = ?
                ORDER BY text
            """
            params = (user_id, source_language, target_language)

            rows = self.db.execute_query(query, params)
            entries = []
            for row in rows:
                entry = LangRuleEntry(
                    id=row["id"],
                    user_id=row["user_id"],
                    source_language=row["source_language"],
                    target_language=row["target_language"],
                    text=row["text"],
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
            print(f"Error getting entries for user from language rules: {e}")
            return []

    def get_entries_list_for_user(
        self, user_id: str, source_language: str = "en", target_language: str = "es"
    ) -> List[str]:
        """Get all rule texts as a simple list for a specific user and language pair.

        Args:
            user_id: The user ID.
            source_language: Source language code (default: "en").
            target_language: Target language code (default: "es").

        Returns:
            List of rule text strings for the user.
        """
        entries = self.get_entries_for_user(user_id, source_language, target_language)
        return [entry.text for entry in entries]
