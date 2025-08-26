"""Pydantic models for the translation API."""

from pydantic import BaseModel


class TranslateRequest(BaseModel):
    """Request model for translation endpoints."""

    message: str
    conversation_id: str | None = None
    source_language: str
    target_language: str


class GlossaryEntry(BaseModel):
    """Model for a glossary entry."""

    source: str
    target: str
    note: str
    source_language: str | None = None
    target_language: str | None = None


class ApplyGlossaryRequest(BaseModel):
    """Request model for applying a glossary improvement."""

    glossary_entry: GlossaryEntry
    conversation_id: str | None = None


class EditGlossaryRequest(BaseModel):
    """Request model for editing a glossary entry."""

    old_source: str
    new_source: str
    target: str
    note: str
    source_language: str | None = None
    target_language: str | None = None


class DeleteGlossaryRequest(BaseModel):
    """Request model for deleting a glossary entry."""

    source: str
    source_language: str | None = None
    target_language: str | None = None


class GlossaryResponse(BaseModel):
    """Response model for glossary entries."""

    entries: list[GlossaryEntry] = []
    source_language: str = "en"
    target_language: str = "es"
