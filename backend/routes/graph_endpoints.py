"""Graph-related endpoints for the translation API."""

import uuid

from fastapi import APIRouter, Depends, HTTPException, Request
from langgraph.types import Command
from supertokens_python.recipe.session import SessionContainer
from supertokens_python.recipe.session.framework.fastapi import verify_session

from models import ImprovementEntry, ImprovementsResponse, TranslateRequest
from routes.glossary_endpoints import check_glossary_updates
from translate_graph.index import graph
from translate_graph.state import TranslateState
from utils.graph_utils import create_graph_config, get_graph_state
from utils.improvement_cache import improvement_cache
from utils.user_tracking_service import UserTrackingService

user_tracking = UserTrackingService()

router = APIRouter(prefix="/graphs", tags=["graph"])


def extractInterruption(state: TranslateState):
    """Extract interruption value from LangGraph state."""
    return state["__interrupt__"][0].value


def run_graph(input_data, thread_id: str):
    """Run the translation graph with the given input data and thread ID."""
    config = create_graph_config(thread_id)
    result: TranslateState = graph.invoke(input_data, config)
    return result


@router.post("/translate")
def translate(
    translate_request: TranslateRequest,
    request: Request,
    session: SessionContainer | None = Depends(verify_session(session_required=False)),
):
    """Chat endpoint to start the graph with a user message."""
    # Set IP context for rate limiting - extract real user IP
    user_tracking.set_request_ip_from_request(request)
    user_tracking.set_user_id(session.get_user_id() if session else None)

    thread_id = translate_request.conversation_id
    if not thread_id:
        thread_id = str(uuid.uuid4())

    input_data = {
        "messages": translate_request.message,
        "source_language": translate_request.source_language,
        "target_language": translate_request.target_language,
        "user_id": session.get_user_id() if session else None,
    }

    result = run_graph(input_data, thread_id)

    return {"response": extractInterruption(result), "conversation_id": thread_id}


@router.post("/refine-translation")
def refine_translation(
    translate_request: TranslateRequest,
    request: Request,
    session: SessionContainer | None = Depends(verify_session(session_required=False)),
):
    """Chat endpoint to refine the translation."""
    # Set IP context for rate limiting - extract real user IP
    user_tracking.set_request_ip_from_request(request)
    user_tracking.set_user_id(session.get_user_id() if session else None)

    thread_id = translate_request.conversation_id
    if not thread_id:
        raise HTTPException(
            status_code=400, detail="Conversation ID is required to refine translation"
        )

    user_refinement_message = translate_request.message
    result = run_graph(Command(resume=user_refinement_message), thread_id)

    check_glossary_updates(
        thread_id
    )  # Triggers the search for glossary improvements on the background

    return {"response": extractInterruption(result), "conversation_id": thread_id}


@router.get("/improvements/{conversation_id}")
def get_glossary_improvements(conversation_id: str) -> ImprovementsResponse:
    """Get improvement suggestions for a conversation (both glossary and rules)."""
    graph_values = get_graph_state(conversation_id)

    # Get improvement tool calls from cache
    improvement_tool_calls = improvement_cache.get_calls(conversation_id)

    source_language = graph_values.get("source_language")
    target_language = graph_values.get("target_language")

    improvements = []

    for call in improvement_tool_calls:
        tool_name = call.get("name", "")

        if tool_name == "GlossaryUpdate":
            improvements.append(
                ImprovementEntry(
                    type="glossary",
                    source=call["args"]["source"],
                    target=call["args"]["target"],
                    note=call["args"]["note"],
                    source_language=source_language,
                    target_language=target_language,
                )
            )
        elif tool_name == "RulesUpdate":
            improvements.append(
                ImprovementEntry(
                    type="rules",
                    text=call["args"]["text"],
                    source_language=source_language,
                    target_language=target_language,
                )
            )

    return ImprovementsResponse(improvements=improvements)
