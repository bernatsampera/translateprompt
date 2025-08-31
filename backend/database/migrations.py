"""Simple migration system for SQLite database."""

import sqlite3
from pathlib import Path
from typing import List


class Migration:
    """Represents a single database migration."""

    def __init__(self, version: str, description: str, sql: str):
        self.version = version
        self.description = description
        self.sql = sql


class MigrationManager:
    """Manages database migrations."""

    def __init__(self, db_path: str):
        self.db_path = Path(db_path)
        self.migrations = self._get_migrations()

    def _get_migrations(self) -> List[Migration]:
        """Define all migrations here."""
        return [
            Migration(
                version="001",
                description="Add user_id column to glossary_entries",
                sql="ALTER TABLE glossary_entries ADD COLUMN user_id TEXT DEFAULT NULL;",
            ),
            # Add more migrations here as needed
            # Migration(
            #     version="002",
            #     description="Example future migration",
            #     sql="ALTER TABLE glossary_entries ADD COLUMN example_column TEXT;",
            # ),
        ]

    def _ensure_migration_table(self, conn: sqlite3.Connection):
        """Create the migration tracking table if it doesn't exist."""
        conn.execute("""
            CREATE TABLE IF NOT EXISTS schema_migrations (
                version TEXT PRIMARY KEY,
                description TEXT NOT NULL,
                applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        conn.commit()

    def _get_applied_migrations(self, conn: sqlite3.Connection) -> set:
        """Get list of already applied migrations."""
        cursor = conn.execute("SELECT version FROM schema_migrations")
        return {row[0] for row in cursor.fetchall()}

    def run_migrations(self) -> List[str]:
        """Run all pending migrations."""
        applied = []

        with sqlite3.connect(self.db_path) as conn:
            self._ensure_migration_table(conn)
            applied_migrations = self._get_applied_migrations(conn)

            for migration in self.migrations:
                if migration.version not in applied_migrations:
                    try:
                        # Execute the migration SQL
                        conn.execute(migration.sql)
                        conn.commit()

                        # Record the migration as applied
                        conn.execute(
                            "INSERT INTO schema_migrations (version, description) VALUES (?, ?)",
                            (migration.version, migration.description),
                        )
                        conn.commit()
                        applied.append(f"{migration.version}: {migration.description}")

                    except sqlite3.OperationalError as e:
                        # Handle cases where column already exists or other conflicts
                        if "duplicate column name" in str(e).lower():
                            # Column already exists, just record the migration as applied
                            conn.execute(
                                "INSERT INTO schema_migrations (version, description) VALUES (?, ?)",
                                (migration.version, migration.description),
                            )
                            conn.commit()
                            applied.append(
                                f"{migration.version}: {migration.description} (already applied)"
                            )
                        else:
                            raise e

        return applied

    def get_migration_status(self) -> dict:
        """Get status of all migrations."""
        with sqlite3.connect(self.db_path) as conn:
            self._ensure_migration_table(conn)
            applied_migrations = self._get_applied_migrations(conn)

            status = {}
            for migration in self.migrations:
                status[migration.version] = {
                    "description": migration.description,
                    "applied": migration.version in applied_migrations,
                }

            return status
