"""Pydantic models for the translation API."""

from pydantic import BaseModel


class TranslateRequest(BaseModel):
    """Request model for translation endpoints."""

    message: str
    conversation_id: str | None = None


class GlossaryEntry(BaseModel):
    """Model for a glossary entry."""

    source: str
    target: str
    note: str


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


class DeleteGlossaryRequest(BaseModel):
    """Request model for deleting a glossary entry."""

    source: str


class GlossaryResponse(BaseModel):
    """Response model for glossary entries."""

    entries: list[GlossaryEntry] = []
