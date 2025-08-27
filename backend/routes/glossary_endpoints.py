"""Glossary-related endpoints for the translation API."""

from fastapi import APIRouter, HTTPException, Query

from models import (
    ApplyGlossaryRequest,
    DeleteGlossaryRequest,
    EditGlossaryRequest,
    GlossaryEntry,
    GlossaryResponse,
)
from translate_graph.glossary_manager import GlossaryManager
from translate_graph.index import graph
from translate_graph.prompts import lead_update_glossary_prompt
from translate_graph.state import ConductUpdate, NoUpdate
from utils.graph_utils import create_graph_config, get_graph_state
from utils.llm_service import LLM_Service

# --- Setup --------------------------------------------------------------------


llm = LLM_Service()

router = APIRouter(prefix="/glossary", tags=["glossary"])


# --- Routes -------------------------------------------------------------------


def check_glossary_updates(conversation_id: str):
    config = create_graph_config(conversation_id)
    state = get_graph_state(conversation_id)

    if not state.get("messages") or len(state["messages"]) < 3:
        return []

    # unpack the last 3 messages (translation, feedback, translation_with_feedback)
    translation_without_feedback, feedback, _ = state["messages"][-3:]

    prompt = lead_update_glossary_prompt.format(
        translation_with_errors=translation_without_feedback.content,
        user_feedback=feedback.content,
        original_text=state["original_text"],
        source_language=state["source_language"],
        target_language=state["target_language"],
    )

    response = llm.bind_tools([ConductUpdate, NoUpdate]).invoke(prompt)

    if response.tool_calls:
        graph.update_state(config, {"improvement_tool_calls": response.tool_calls})


@router.get("/glossary-improvements/{conversation_id}")
def get_glossary_improvements(conversation_id: str) -> list[GlossaryEntry]:
    """Get glossary improvement suggestions for a conversation."""
    config = create_graph_config(conversation_id)

    graph_values = get_graph_state(conversation_id)

    # Reload updated state
    improvement_tool_calls = graph_values.get("improvement_tool_calls", [])

    source_language = graph_values.get("source_language")
    target_language = graph_values.get("target_language")

    return [
        GlossaryEntry(
            source=call["args"]["source"],
            target=call["args"]["target"],
            note=call["args"]["note"],
            source_language=source_language,
            target_language=target_language,
        )
        for call in improvement_tool_calls
    ]


@router.post("/apply-glossary-update")
def apply_glossary_update(request: ApplyGlossaryRequest):
    """Apply a selected glossary update and persist it to the glossary database."""
    glossary_entry, conversation_id = (
        request.glossary_entry,
        request.conversation_id,
    )

    if conversation_id:
        config = create_graph_config(conversation_id)

        graph_values = get_graph_state(conversation_id)
        glossary_entry.source_language = graph_values.get("source_language")
        glossary_entry.target_language = graph_values.get("target_language")

        # Remove the applied glossary entry
        graph.update_state(
            config,
            {
                "improvement_tool_calls": {
                    "action": "remove",
                    "filter": {
                        "source": glossary_entry.source,
                        "target": glossary_entry.target,
                    },
                }
            },
        )

    glossary_manager = GlossaryManager()
    if glossary_manager.add_source(
        glossary_entry.source,
        glossary_entry.target,
        glossary_entry.source_language,
        glossary_entry.target_language,
        glossary_entry.note,
    ):
        return {"message": "success"}

    raise HTTPException(status_code=500, detail="Failed to add entry to glossary")


@router.put("/edit-glossary-entry")
def edit_glossary_entry(request: EditGlossaryRequest):
    """Edit an existing glossary entry."""
    glossary_manager = GlossaryManager()

    # First remove the old entry
    if not glossary_manager.remove_source(
        request.old_source, request.source_language, request.target_language
    ):
        raise HTTPException(status_code=404, detail="Source not found in glossary")

    # Then add the new entry
    if glossary_manager.add_source(
        request.new_source,
        request.target,
        request.source_language,
        request.target_language,
        request.note,
    ):
        return {"message": "success"}

    raise HTTPException(status_code=500, detail="Failed to update glossary entry")


@router.delete("/delete-glossary-entry")
def delete_glossary_entry(request: DeleteGlossaryRequest):
    """Delete a glossary entry."""
    glossary_manager = GlossaryManager()

    if glossary_manager.remove_source(
        request.source, request.source_language, request.target_language
    ):
        return {"message": "success"}

    raise HTTPException(status_code=404, detail="Source not found in glossary")


@router.get("/glossary-entries")
def get_glossary_entries(
    source_language: str = Query(..., description="Source language code"),
    target_language: str = Query(..., description="Target language code"),
) -> GlossaryResponse:
    """Get all current glossary entries for a specific language pair."""
    glossary_manager = GlossaryManager()
    glossary_data = glossary_manager.get_all_sources(source_language, target_language)

    entries = [
        GlossaryEntry(
            source=src,
            target=data["target"],
            note=data.get("note", ""),
            source_language=source_language,
            target_language=target_language,
        )
        for src, data in glossary_data.items()
    ]

    sorted_entries = sorted(entries, key=lambda x: x.source)
    return GlossaryResponse(
        entries=sorted_entries,
        source_language=source_language,
        target_language=target_language,
    )
