"""Configuration management for the translation API."""

import os

from dotenv import load_dotenv

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
    def GOOGLE_LLM_MODEL(self) -> str:
        """Get LLM model."""
        return os.getenv("GOOGLE_LLM_MODEL", "")

    @property
    def OPENAI_LLM_MODEL(self) -> str:
        """Get LLM model."""
        return os.getenv("OPENAI_LLM_MODEL", "")

    @property
    def SUPER_TOKENS_CONNECTION_URI(self) -> str:
        """Get SuperTokens connection URI."""
        return os.getenv(
            "SUPER_TOKENS_CONNECTION_URI",
            "",
        )

    @property
    def GOOGLE_CLIENT_ID(self) -> str:
        """Get SuperTokens Google client ID."""
        return os.getenv("GOOGLE_CLIENT_ID")

    @property
    def GOOGLE_CLIENT_SECRET(self) -> str:
        """Get SuperTokens Google client secret."""
        return os.getenv("GOOGLE_CLIENT_SECRET")

    @property
    def AXIOM_API_TOKEN(self) -> str:
        """Get Axiom API key."""
        return os.getenv("AXIOM_API_TOKEN")

    @property
    def BACKEND_URL(self) -> str:
        """Get SuperTokens API domain."""
        return os.getenv("BACKEND_URL", "http://localhost:8008")

    @property
    def FRONTEND_URL(self) -> str:
        """Get SuperTokens website domain."""
        return os.getenv("FRONTEND_URL", "http://localhost:5178")

    @property
    def LEMONSQUEEZY_SIGNING_SECRET(self) -> str:
        """Get Lemon Squeezy webhook signing secret."""
        return os.getenv("LEMONSQUEEZY_SIGNING_SECRET", "")

    def is_production(self) -> bool:
        """Check if the application is running in production mode."""
        return self.PROD


# Global config instance
config = Config()
