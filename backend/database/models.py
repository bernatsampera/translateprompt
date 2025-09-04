"""Data models for all database entities."""

from dataclasses import dataclass
from datetime import datetime


@dataclass
class GlossaryEntry:
    """Data class representing a glossary entry."""

    id: int | None = None
    user_id: str | None = None
    source_language: str = "en"
    target_language: str = "es"
    source_text: str = ""
    target_text: str = ""
    note: str = ""
    created_at: datetime | None = None
    updated_at: datetime | None = None

    def to_dict(self) -> dict:
        """Convert the entry to a dictionary."""
        return {
            "id": self.id,
            "user_id": self.user_id,
            "source_language": self.source_language,
            "target_language": self.target_language,
            "source_text": self.source_text,
            "target_text": self.target_text,
            "note": self.note,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }

    @classmethod
    def from_dict(cls, data: dict) -> "GlossaryEntry":
        """Create an entry from a dictionary."""
        return cls(
            id=data.get("id"),
            user_id=data.get("user_id"),
            source_language=data.get("source_language", "en"),
            target_language=data.get("target_language", "es"),
            source_text=data.get("source_text", ""),
            target_text=data.get("target_text", ""),
            note=data.get("note", ""),
            created_at=datetime.fromisoformat(data["created_at"])
            if data.get("created_at")
            else None,
            updated_at=datetime.fromisoformat(data["updated_at"])
            if data.get("updated_at")
            else None,
        )


@dataclass
class LangRuleEntry:
    """Data class representing a language rule entry."""

    source_language: str
    target_language: str
    id: int | None = None
    user_id: str | None = None
    text: str = ""
    created_at: datetime | None = None
    updated_at: datetime | None = None

    def to_dict(self) -> dict:
        """Convert the entry to a dictionary."""
        return {
            "id": self.id,
            "user_id": self.user_id,
            "source_language": self.source_language,
            "target_language": self.target_language,
            "text": self.text,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }

    @classmethod
    def from_dict(cls, data: dict) -> "LangRuleEntry":
        """Create an entry from a dictionary."""
        return cls(
            source_language=data.get("source_language", "en"),
            target_language=data.get("target_language", "es"),
            id=data.get("id"),
            user_id=data.get("user_id"),
            text=data.get("text", ""),
            created_at=datetime.fromisoformat(data["created_at"])
            if data.get("created_at")
            else None,
            updated_at=datetime.fromisoformat(data["updated_at"])
            if data.get("updated_at")
            else None,
        )


@dataclass
class UserIP:
    """Data class representing a user IP record."""

    ip_address: str
    created_at: datetime | None = None
    token_count: int = 0

    def to_dict(self) -> dict:
        """Convert the entry to a dictionary."""
        return {
            "ip_address": self.ip_address,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "token_count": self.token_count,
        }

    @classmethod
    def from_dict(cls, data: dict) -> "UserIP":
        """Create an entry from a dictionary."""
        return cls(
            ip_address=data["ip_address"],
            created_at=datetime.fromisoformat(data["created_at"])
            if data.get("created_at")
            else None,
            token_count=data.get("token_count", 0),
        )


@dataclass
class UserUsage:
    """Data class representing a user usage record."""

    user_id: str
    token_count: int = 0
    lemonsqueezy_customer_id: int | None = None
    subscription_status: str | None = None
    quota_limit: int = 0
    quota_used: int = 0
    billing_portal_url: str | None = None

    def to_dict(self) -> dict:
        """Convert the entry to a dictionary."""
        return {
            "user_id": self.user_id,
            "token_count": self.token_count,
            "lemonsqueezy_customer_id": self.lemonsqueezy_customer_id,
            "subscription_status": self.subscription_status,
            "quota_limit": self.quota_limit,
            "quota_used": self.quota_used,
            "billing_portal_url": self.billing_portal_url,
        }

    @classmethod
    def from_dict(cls, data: dict) -> "UserUsage":
        """Create an entry from a dictionary."""
        return cls(
            user_id=data["user_id"],
            token_count=data.get("token_count", 0),
            lemonsqueezy_customer_id=data.get("lemonsqueezy_customer_id"),
            subscription_status=data.get("subscription_status"),
            quota_limit=data.get("quota_limit", 0),
            quota_used=data.get("quota_used", 0),
            billing_portal_url=data.get("billing_portal_url"),
        )
