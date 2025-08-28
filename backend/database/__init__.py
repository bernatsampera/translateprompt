"""Database package for managing all database operations."""

from .connection import DatabaseConnection, create_database_connection
from .glossary_operations import GlossaryOperations
from .models import GlossaryEntry, UserIP
from .schemas import GLOSSARY_INDEX_SCHEMA, GLOSSARY_TABLE_SCHEMA, USER_IP_TABLE_SCHEMA
from .user_ip_operations import UserIPOperations

__all__ = [
    "DatabaseConnection",
    "create_database_connection",
    "GlossaryEntry",
    "UserIP",
    "GLOSSARY_TABLE_SCHEMA",
    "GLOSSARY_INDEX_SCHEMA",
    "USER_IP_TABLE_SCHEMA",
    "GlossaryOperations",
    "UserIPOperations",
]
