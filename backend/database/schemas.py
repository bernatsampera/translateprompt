"""Database schema definitions for all tables."""

# Glossary table schema
GLOSSARY_TABLE_SCHEMA = """
CREATE TABLE IF NOT EXISTS glossary_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT DEFAULT NULL,
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

GLOSSARY_INDEX_SCHEMA = """
CREATE INDEX IF NOT EXISTS idx_glossary_lookup 
ON glossary_entries(source_language, target_language, source_text)
"""

# User IP tracking table schema
USER_IP_TABLE_SCHEMA = """
CREATE TABLE IF NOT EXISTS user_ips (
    ip_address TEXT PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    token_count INTEGER DEFAULT 0
)
"""

WAITLIST_TABLE_SCHEMA = """
CREATE TABLE IF NOT EXISTS waitlist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
"""
