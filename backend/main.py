"""Translation API with background glossary improvement analysis."""

import random
import threading
import time
import uuid
from datetime import datetime
from typing import Dict, Optional

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

# In-memory storage for glossary improvement analysis
# In production, this should be replaced with a persistent store like Redis
improvement_status: Dict[str, Dict] = {}
improvement_lock = threading.Lock()

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


class GlossaryImprovement(BaseModel):
    """Model for a single glossary improvement suggestion."""

    source: str
    current_target: str
    suggested_target: str
    reason: str
    confidence: float


class ImprovementResponse(BaseModel):
    """Response model for glossary improvement analysis."""

    conversation_id: str
    status: str  # "processing", "completed", "error"
    improvements: list[GlossaryImprovement] = []


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
    return {"response": extractInterruption(result), "conversation_id": thread_id}


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

    return result


@app.post("/refine-translation")
def refine_translation(request: TranslateRequest):
    """Chat endpoint to refine the translation."""
    thread_id = request.conversation_id
    if not thread_id:
        raise HTTPException(
            status_code=400, detail="Conversation ID is required to refine translation"
        )

    user_refinement_message = request.message
    result = run_graph(Command(resume=user_refinement_message), thread_id)

    # Trigger background glossary analysis for refined translation too
    # background_tasks.add_task(
    #     analyze_glossary_improvements_background,
    #     request.message,  # refinement request
    #     result["response"],  # refined translation
    #     result["conversation_id"],  # conversation_id
    # )

    return result


def create_mock_improvements(conversation_id: str) -> list[GlossaryImprovement]:
    """Create mock improvements for testing."""
    # Generate some mock improvements based on conversation_id for consistency
    random.seed(hash(conversation_id) % 1000)

    possible_improvements = [
        GlossaryImprovement(
            source="user",
            current_target="usuario",
            suggested_target="cliente",
            reason="In business contexts, 'cliente' is more appropriate",
            confidence=0.8,
        ),
        GlossaryImprovement(
            source="system",
            current_target="sistema",
            suggested_target="plataforma",
            reason="More modern technical term",
            confidence=0.75,
        ),
        GlossaryImprovement(
            source="error",
            current_target="error",
            suggested_target="fallo",
            reason="More natural in Spanish",
            confidence=0.9,
        ),
    ]

    return possible_improvements


@app.get("/glossary-improvements/{conversation_id}")
def get_glossary_improvements(conversation_id: str) -> ImprovementResponse:
    """Get glossary improvement suggestions for a conversation."""

    # Check if we have this conversation tracked
    with improvement_lock:
        if conversation_id in improvement_status:
            status_data = improvement_status[conversation_id]
            return ImprovementResponse(
                conversation_id=conversation_id,
                status=status_data["status"],
                improvements=status_data.get("improvements", []),
            )

    # If not tracked, return mock improvements
    mock_improvements = create_mock_improvements(conversation_id)

    return ImprovementResponse(
        conversation_id=conversation_id,
        status="completed",
        improvements=mock_improvements,
    )


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8008, reload=True)
