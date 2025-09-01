"""Language rules-related endpoints for the translation API."""

from fastapi import APIRouter, Depends, HTTPException, Query, Request
from supertokens_python.recipe.session import SessionContainer
from supertokens_python.recipe.session.framework.fastapi import verify_session

from database.rules_operations import RulesOperations
from models import (
    ApplyRulesRequest,
    DeleteRulesRequest,
    EditRulesRequest,
    RulesEntry,
    RulesResponse,
)
from utils.user_tracking_service import UserTrackingService

router = APIRouter(prefix="/rules", tags=["rules"])


@router.get("/rules-entries")
async def get_rules_entries(
    request: Request,
    source_language: str = Query("", description="Source language code"),
    target_language: str = Query("", description="Target language code"),
    session: SessionContainer = Depends(verify_session()),
) -> RulesResponse:
    """Get all current language rule entries for the authenticated user."""
    # Create user tracking service when needed
    user_tracking = UserTrackingService()

    user_tracking.set_user_id(session.get_user_id())

    rules_operations = RulesOperations()
    user_id = session.get_user_id()
    entries = rules_operations.get_entries_for_user(
        user_id, source_language, target_language
    )

    rules_entries = [
        RulesEntry(
            text=entry.text,
            source_language=entry.source_language,
            target_language=entry.target_language,
            user_id=entry.user_id,
        )
        for entry in entries
    ]

    sorted_entries = sorted(rules_entries, key=lambda x: x.text)
    return RulesResponse(entries=sorted_entries)


@router.post("/add-rule")
def add_rule(
    request: ApplyRulesRequest, session: SessionContainer = Depends(verify_session())
):
    """Add a new language rule."""
    user_id = session.get_user_id()
    rules_entry = request.rules_entry

    rules_operations = RulesOperations()

    # Create a LangRuleEntry object
    from database.models import LangRuleEntry

    entry = LangRuleEntry(
        text=rules_entry.text,
        source_language=rules_entry.source_language,
        target_language=rules_entry.target_language,
        user_id=user_id,
    )

    if rules_operations.add_entry(entry):
        return {"message": "success"}

    raise HTTPException(status_code=500, detail="Failed to add rule")


@router.put("/edit-rule")
def edit_rule(
    request: EditRulesRequest, session: SessionContainer = Depends(verify_session())
):
    """Edit an existing language rule."""
    user_id = session.get_user_id()
    rules_operations = RulesOperations()

    # First remove the old rule
    if not rules_operations.remove_entry(
        request.old_text, user_id, request.source_language, request.target_language
    ):
        raise HTTPException(status_code=404, detail="Rule not found")

    # Then add the new rule
    from database.models import LangRuleEntry

    entry = LangRuleEntry(
        text=request.new_text,
        source_language=request.source_language,
        target_language=request.target_language,
        user_id=user_id,
    )

    if rules_operations.add_entry(entry):
        return {"message": "success"}

    raise HTTPException(status_code=500, detail="Failed to update rule")


@router.delete("/delete-rule")
def delete_rule(
    request: DeleteRulesRequest,
    session: SessionContainer = Depends(verify_session()),
):
    """Delete a language rule."""
    user_id = session.get_user_id()
    rules_operations = RulesOperations()

    if rules_operations.remove_entry(
        request.text, user_id, request.source_language, request.target_language
    ):
        return {"message": "success"}

    raise HTTPException(status_code=404, detail="Rule not found")


@router.get("/rules-list")
async def get_rules_list(
    request: Request,
    source_language: str = Query("", description="Source language code"),
    target_language: str = Query("", description="Target language code"),
    session: SessionContainer = Depends(verify_session()),
) -> list[str]:
    """Get all language rules as a simple list of strings for the authenticated user."""
    user_tracking = UserTrackingService()
    user_tracking.set_request_ip_from_request(request)
    user_tracking.set_user_id(session.get_user_id())

    rules_operations = RulesOperations()
    user_id = session.get_user_id()
    return rules_operations.get_entries_list_for_user(
        user_id, source_language, target_language
    )
