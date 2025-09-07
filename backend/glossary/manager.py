"""Main glossary manager providing high-level interface for glossary operations."""

from typing import Dict

from database.connection import get_database_connection
from database.glossary_operations import GlossaryOperations
from database.models import GlossaryEntry


class GlossaryManager:
    """Main glossary manager providing high-level interface for glossary operations."""

    def __init__(self):
        """Initialize the glossary manager using the global database connection."""
        # Lazy init of operations
        self._db = None

    @property
    def db(self):
        """Lazy initialization of database operations using global connection."""
        if self._db is None:
            db_connection = get_database_connection()
            self._db = GlossaryOperations(db_connection=db_connection)
        return self._db

    def add_source(
        self,
        entry: GlossaryEntry,
    ) -> bool:
        """Add or update a source in the glossary.

        Args:
            entry: The glossary entry to add.

        Returns:
            True if added successfully, False otherwise.
        """
        entry = GlossaryEntry(
            source_language=entry.source_language,
            target_language=entry.target_language,
            source_text=entry.source_text,
            target_text=entry.target_text,
            note=entry.note,
            user_id=entry.user_id,
        )
        return self.db.add_entry(entry)

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
        return self.db.remove_entry(source, source_language, target_language)

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
        entry = self.db.get_entry(source, source_language, target_language)
        if entry:
            return {"target": entry.target_text, "note": entry.note}
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
        return self.db.get_entries_dict(source_language, target_language)

    def get_all_sources_for_user(
        self, user_id: str, source_language: str = "en", target_language: str = "es"
    ) -> Dict[str, Dict[str, str]]:
        """Get all sources from the glossary for a specific user and language pair.

        Args:
            user_id: The user ID.
            source_language: Source language code (default: "en").
            target_language: Target language code (default: "es").

        Returns:
            Dictionary mapping source text to target and note data.
        """
        return self.db.get_entries_dict_for_user(
            user_id, source_language, target_language
        )

    def get_all_entries(self, source_language: str = "en", target_language: str = "es"):
        """Get all glossary entries as GlossaryEntry objects.

        Args:
            source_language: Source language code (default: "en").
            target_language: Target language code (default: "es").

        Returns:
            List of GlossaryEntry objects.
        """
        return self.db.get_all_entries(source_language, target_language)
