"""Glossary management package for handling SQLite-based glossary storage with language support."""

from .database import GlossaryDatabase
from .manager import GlossaryManager
from .models import GlossaryEntry

__all__ = ["GlossaryEntry", "GlossaryDatabase", "GlossaryManager"]
