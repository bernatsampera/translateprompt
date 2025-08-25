"""Pydantic models for the translation API."""

from pydantic import BaseModel


class TranslateRequest(BaseModel):
    """Request model for translation endpoints."""

    message: str
    conversation_id: str | None = None


class ApplyGlossaryRequest(BaseModel):
    """Request model for applying a glossary improvement."""

    source: str
    target: str
    note: str = ""


class GlossaryEntry(BaseModel):
    """Model for a glossary entry."""

    source: str
    target: str
    note: str


class GlossaryResponse(BaseModel):
    """Response model for glossary entries."""

    entries: list[GlossaryEntry] = []
