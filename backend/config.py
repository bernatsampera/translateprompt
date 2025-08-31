"""Configuration management for the translation API."""

import os

from dotenv import load_dotenv
from fastapi import HTTPException

load_dotenv()


class Config:
    """Centralized configuration management."""

    @property
    def PROD(self) -> bool:
        """Get production mode status."""
        return os.getenv("PROD", "false").lower() == "true"

    @property
    def DATABASE_PATH(self) -> str | None:
        """Get database path."""
        return os.getenv("DATABASE_PATH")

    @property
    def API_HOST(self) -> str:
        """Get API host."""
        return os.getenv("API_HOST", "127.0.0.1")

    @property
    def API_PORT(self) -> int:
        """Get API port."""
        return int(os.getenv("API_PORT", "8008"))

    @property
    def API_RELOAD(self) -> bool:
        """Get API reload setting."""
        return os.getenv("API_RELOAD", "true").lower() == "true"

    @property
    def CORS_ORIGINS(self) -> list:
        """Get CORS origins."""
        return os.getenv("CORS_ORIGINS", "*").split(",")

    @property
    def LLM_MODEL(self) -> str:
        """Get LLM model."""
        return os.getenv("LLM_MODEL", "gpt-4o-mini")

    @property
    def SUPER_TOKENS_CONNECTION_URI(self) -> str:
        """Get SuperTokens connection URI."""
        return os.getenv(
            "SUPER_TOKENS_CONNECTION_URI",
            "https://supertokens-vssocosgc4ckcw4goks4wg4c.samperalabs.com",
        )

    @property
    def BACKEND_URL(self) -> str:
        """Get SuperTokens API domain."""
        return os.getenv("BACKEND_URL", "http://localhost:8008")

    @property
    def FRONTEND_URL(self) -> str:
        """Get SuperTokens website domain."""
        return os.getenv("FRONTEND_URL", "http://localhost:5178")

    def is_production(self) -> bool:
        """Check if the application is running in production mode."""
        return self.PROD

    def validate_production_operation(self, operation: str) -> None:
        """Validate if an operation is allowed in production mode.

        Args:
            operation: Description of the operation being performed.

        Raises:
            HTTPException: If the operation is not allowed in production mode.
        """
        if self.is_production():
            raise HTTPException(
                status_code=403,
                detail="This feature will be available soon! Join our waitlist now to get exclusive early access when it launches!",
            )


# Global config instance
config = Config()
