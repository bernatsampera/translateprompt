"""Translation API with background glossary improvement analysis."""

import threading
import uuid
from datetime import datetime
from typing import Dict

from langchain_core.messages import ToolCall
import uvicorn
from fastapi import BackgroundTasks, FastAPI
from fastapi.exceptions import HTTPException
from fastapi.middleware.cors import CORSMiddleware
from langgraph.types import Command
from pydantic import BaseModel

from basic_translate.index import graph as basic_translate_graph
from translate_graph.index import graph
from translate_graph.state import TranslateState

app = FastAPI(
    title="Template Project REACT + Fastapi",
    description="Template Project REACT + Fastapi",
    version="1.0.0",
)

# Add CORS middleware before defining routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/v1/hello")
def read_root():
    """Health check endpoint."""
    return {"message": "This comes from the backend"}


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


@app.post("/translate-basic")
def translate_basic(request: TranslateRequest):
    """Chat endpoint to start the graph with a user message."""
    # Create initial state with user message
    initial_state = {"messages": [{"role": "user", "content": request.message}]}

    # Run the graph
    result = basic_translate_graph.invoke(initial_state)

    # Extract the assistant's response
    assistant_message = result["messages"][-1].content

    return {"response": assistant_message}


def extractInterruption(state: TranslateState):
    """Extract interruption value from LangGraph state."""
    return state["__interrupt__"][0].value


def run_graph(input_data, thread_id: str):
    """Run the translation graph with the given input data and thread ID."""
    config = {"configurable": {"thread_id": thread_id}}
    result: TranslateState = graph.invoke(input_data, config)
    return result


@app.post("/translate")
def translate(request: TranslateRequest):
    """Chat endpoint to start the graph with a user message."""
    # Get or create conversation ID (thread_id in LangGraph)
    thread_id = request.conversation_id
    if not thread_id:
        thread_id = str(uuid.uuid4())

    # Create Input Data
    input_data = {"messages": request.message}

    result = run_graph(input_data, thread_id)

    return {"response": extractInterruption(result), "conversation_id": thread_id}


@app.post("/refine-translation")
def refine_translation(request: TranslateRequest, background_tasks: BackgroundTasks):
    """Chat endpoint to refine the translation."""
    thread_id = request.conversation_id
    if not thread_id:
        raise HTTPException(
            status_code=400, detail="Conversation ID is required to refine translation"
        )

    user_refinement_message = request.message
    result = run_graph(Command(resume=user_refinement_message), thread_id)

    return {"response": extractInterruption(result), "conversation_id": thread_id}


@app.get("/glossary-improvements/{conversation_id}")
def get_glossary_improvements(conversation_id: str) -> list[ToolCall]:
    """Get glossary improvement suggestions for a conversation."""
    # Check if we have this conversation tracked
    config = {"configurable": {"thread_id": conversation_id}}
    subgraph_result = graph.invoke(Command(goto="check_glossary_updates"), config)

    print("glossary-improvements", subgraph_result)
    improvements = subgraph_result["improvement_tool_calls"]
    # If not tracked, return processing status (analysis not started yet)
    return improvements


@app.post("/apply-glossary-update")
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


@app.get("/glossary-entries")
def get_glossary_entries() -> GlossaryResponse:
    """Get all current glossary entries."""
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


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8008, reload=True)
