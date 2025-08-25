"""Glossary-related endpoints for the translation API."""

from fastapi import APIRouter, HTTPException
from langchain_core.messages import ToolCall
from langgraph.types import Command

from models import ApplyGlossaryRequest, GlossaryResponse
from translate_graph.index import graph

router = APIRouter(prefix="/glossary", tags=["glossary"])


@router.get("/glossary-improvements/{conversation_id}")
def get_glossary_improvements(conversation_id: str) -> list[ToolCall]:
    """Get glossary improvement suggestions for a conversation."""
    # Check if we have this conversation tracked
    config = {"configurable": {"thread_id": conversation_id}}
    subgraph_result = graph.invoke(Command(goto="check_glossary_updates"), config)

    improvements = subgraph_result["improvement_tool_calls"]
    # If not tracked, return processing status (analysis not started yet)
    return improvements


@router.post("/apply-glossary-update")
def apply_glossary_update(request: ApplyGlossaryRequest):
    """Apply a selected glossary update."""
    from translate_graph.glossary_manager import GlossaryManager

    glossary_manager = GlossaryManager()
    success = glossary_manager.add_source(request.source, request.target, request.note)

    if success:
        return {
            "message": f"Added '{request.source}' → '{request.target}' to glossary",
        }
    else:
        raise HTTPException(status_code=500, detail="Failed to add entry to glossary")


@router.get("/glossary-entries")
def get_glossary_entries() -> GlossaryResponse:
    """Get all current glossary entries."""
    from models import GlossaryEntry
    from translate_graph.glossary_manager import GlossaryManager

    glossary_manager = GlossaryManager()
    glossary_data = glossary_manager.load_glossary()

    entries = []
    for source, data in glossary_data.items():
        entry = GlossaryEntry(
            source=source, target=data["target"], note=data.get("note", "")
        )
        entries.append(entry)

    return GlossaryResponse(entries=entries)
