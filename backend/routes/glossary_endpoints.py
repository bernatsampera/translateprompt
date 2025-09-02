"""Glossary-related endpoints for the translation API."""

from fastapi import APIRouter, Depends, HTTPException, Query, Request
from supertokens_python.recipe.session import SessionContainer
from supertokens_python.recipe.session.framework.fastapi import verify_session

from database.rules_operations import RulesOperations
from glossary import GlossaryManager
from models import (
    AddGlossaryRequest,
    ApplyImprovementRequest,
    DeleteGlossaryRequest,
    EditGlossaryRequest,
    GlossaryEntry,
    GlossaryResponse,
)
from translate_graph.prompts import lead_update_glossary_prompt
from translate_graph.state import GlossaryUpdate, NoUpdate, RulesUpdate
from utils.graph_utils import get_graph_state
from utils.improvement_cache import improvement_cache
from utils.llm_service import LLM_Service
from utils.user_tracking_service import UserTrackingService

router = APIRouter(prefix="/glossary", tags=["glossary"])


@router.get("/glossary-entries")
async def get_glossary_entries(
    request: Request,
    source_language: str = Query(..., description="Source language code"),
    target_language: str = Query(..., description="Target language code"),
    session: SessionContainer | None = Depends(verify_session(session_required=False)),
) -> GlossaryResponse:
    """Get all current glossary entries for a specific language pair."""
    # Create services when needed
    user_tracking = UserTrackingService()
    glossary_manager = GlossaryManager()

    user_tracking.set_request_ip_from_request(request)
    user_tracking.set_user_id(session.get_user_id() if session else None)

    user_id = None
    glossary_data = None
    if session:
        user_id = session.get_user_id()
        glossary_data = glossary_manager.get_all_sources_for_user(
            user_id, source_language, target_language
        )
    else:
        glossary_data = glossary_manager.get_all_sources(
            source_language, target_language
        )

    entries = [
        GlossaryEntry(
            source=src,
            target=data["target"],
            note=data.get("note", ""),
            source_language=source_language,
            target_language=target_language,
            user_id=user_id if user_id else 0,
        )
        for src, data in glossary_data.items()
    ]

    sorted_entries = sorted(entries, key=lambda x: x.source)
    return GlossaryResponse(
        entries=sorted_entries,
        source_language=source_language,
        target_language=target_language,
    )


def check_glossary_updates(conversation_id: str):
    """Check for glossary improvement suggestions and store them in cache."""
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

    response = (
        LLM_Service().bind_tools([RulesUpdate, GlossaryUpdate, NoUpdate]).invoke(prompt)
    )

    if response.tool_calls:
        improvement_cache.add_calls(conversation_id, response.tool_calls)


@router.post("/add-glossary-entry")
def add_glossary_entry(
    request: AddGlossaryRequest, session: SessionContainer = Depends(verify_session())
):
    """Add a new glossary entry."""
    user_id = session.get_user_id()
    glossary_manager = GlossaryManager()

    if glossary_manager.add_source(
        request.source,
        request.target,
        request.source_language,
        request.target_language,
        request.note,
        user_id=user_id,
    ):
        return {"message": "success"}

    raise HTTPException(status_code=500, detail="Failed to add entry to glossary")


@router.put("/edit-glossary-entry")
def edit_glossary_entry(
    request: EditGlossaryRequest, session: SessionContainer = Depends(verify_session())
):
    """Edit an existing glossary entry."""
    user_id = session.get_user_id()
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
        user_id=user_id,
    ):
        return {"message": "success"}

    raise HTTPException(status_code=500, detail="Failed to update glossary entry")


@router.delete("/delete-glossary-entry")
def delete_glossary_entry(
    request: DeleteGlossaryRequest,
    session: SessionContainer = Depends(verify_session()),
):
    """Delete a glossary entry."""
    glossary_manager = GlossaryManager()

    if glossary_manager.remove_source(
        request.source, request.source_language, request.target_language
    ):
        return {"message": "success"}

    raise HTTPException(status_code=404, detail="Source not found in glossary")


@router.post("/apply-improvement")
def apply_improvement(
    request: ApplyImprovementRequest,
    session: SessionContainer = Depends(verify_session()),
):
    """Apply a selected improvement (glossary or rules) and persist it to the database."""
    user_id = session.get_user_id()
    improvement = request.improvement
    conversation_id = request.conversation_id

    if conversation_id:
        graph_values = get_graph_state(conversation_id)
        improvement.source_language = graph_values.get("source_language")
        improvement.target_language = graph_values.get("target_language")

    if improvement.type == "glossary":
        # Handle glossary improvement
        glossary_manager = GlossaryManager()

        # Remove the applied glossary entry from cache
        if conversation_id:
            improvement_cache.remove_calls(
                conversation_id,
                {
                    "source": improvement.source,
                    "target": improvement.target,
                },
            )

        if glossary_manager.add_source(
            improvement.source,
            improvement.target,
            improvement.source_language,
            improvement.target_language,
            improvement.note,
            user_id=user_id,
        ):
            return {"message": "success"}

        raise HTTPException(status_code=500, detail="Failed to add entry to glossary")

    elif improvement.type == "rules":
        # Handle rules improvement
        rules_operations = RulesOperations()

        # Remove the applied rules entry from cache
        if conversation_id:
            improvement_cache.remove_calls(
                conversation_id,
                {
                    "text": improvement.text,
                },
            )

        from database.models import LangRuleEntry

        entry = LangRuleEntry(
            text=improvement.text,
            source_language=improvement.source_language,
            target_language=improvement.target_language,
            user_id=user_id,
        )

        if rules_operations.add_entry(entry):
            return {"message": "success"}

        raise HTTPException(status_code=500, detail="Failed to add rule")

    else:
        raise HTTPException(status_code=400, detail="Invalid improvement type")
