"""Graph-related endpoints for the translation API."""

import uuid

from fastapi import APIRouter, BackgroundTasks, HTTPException
from langgraph.types import Command

from basic_translate.index import graph as basic_translate_graph
from models import TranslateRequest
from routes.glossary_endpoints import check_glossary_updates
from translate_graph.index import graph
from translate_graph.state import TranslateState
from utils.graph_utils import create_graph_config

router = APIRouter(prefix="/graphs", tags=["graph"])


def extractInterruption(state: TranslateState):
    """Extract interruption value from LangGraph state."""
    return state["__interrupt__"][0].value


def run_graph(input_data, thread_id: str):
    """Run the translation graph with the given input data and thread ID."""
    config = create_graph_config(thread_id)
    result: TranslateState = graph.invoke(input_data, config)
    return result


@router.post("/translate-basic")
def translate_basic(request: TranslateRequest):
    """Chat endpoint to start the graph with a user message."""
    # Create initial state with user message
    initial_state = {"messages": [{"role": "user", "content": request.message}]}

    # Run the graph
    result = basic_translate_graph.invoke(initial_state)

    # Extract the assistant's response
    assistant_message = result["messages"][-1].content

    return {"response": assistant_message}


@router.post("/translate")
def translate(request: TranslateRequest):
    """Chat endpoint to start the graph with a user message."""
    thread_id = request.conversation_id
    if not thread_id:
        thread_id = str(uuid.uuid4())

    input_data = {
        "messages": request.message,
        "source_language": request.source_language or "en",
        "target_language": request.target_language or "es",
    }

    result = run_graph(input_data, thread_id)

    return {"response": extractInterruption(result), "conversation_id": thread_id}


@router.post("/refine-translation")
def refine_translation(request: TranslateRequest, background_tasks: BackgroundTasks):
    """Chat endpoint to refine the translation."""
    thread_id = request.conversation_id
    if not thread_id:
        raise HTTPException(
            status_code=400, detail="Conversation ID is required to refine translation"
        )

    user_refinement_message = request.message
    result = run_graph(Command(resume=user_refinement_message), thread_id)

    check_glossary_updates(
        thread_id
    )  # Triggers the search for glossary improvements on the background

    return {"response": extractInterruption(result), "conversation_id": thread_id}
