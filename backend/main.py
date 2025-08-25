"""Translation API with background glossary improvement analysis."""

import threading
import uuid
from datetime import datetime
from typing import Dict

import uvicorn
from fastapi import BackgroundTasks, FastAPI
from fastapi.exceptions import HTTPException
from fastapi.middleware.cors import CORSMiddleware
from langgraph.types import Command
from pydantic import BaseModel

from translate_graph.glossary_graph import update_glossary_graph
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
    print("run_graph result", result)
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
def refine_translation(request: TranslateRequest):
    """Chat endpoint to refine the translation."""
    thread_id = request.conversation_id
    if not thread_id:
        raise HTTPException(
            status_code=400, detail="Conversation ID is required to refine translation"
        )

    user_refinement_message = request.message
    result = run_graph(Command(resume=user_refinement_message), thread_id)

    print(result)

    ## trigger the glossary graph but returns the result of the refine translation graph
    input_glossary_graph = {
        "messages": result["messages"],
        "original_text": result["original_text"],
    }
    glossary_result = update_glossary_graph.invoke(input_glossary_graph)
    print(glossary_result)

    return {"response": extractInterruption(result), "conversation_id": thread_id}


@app.get("/glossary-improvements/{conversation_id}")
def get_glossary_improvements(conversation_id: str) -> ImprovementResponse:
    """Get glossary improvement suggestions for a conversation."""

    # Check if we have this conversation tracked
    # with improvement_lock:
    #     if conversation_id in improvement_status:
    #         status_data = improvement_status[conversation_id]
    #         return ImprovementResponse(
    #             conversation_id=conversation_id,
    #             status=status_data["status"],
    #             improvements=status_data.get("improvements", []),
    #         )

    mockImprovements = [
        GlossaryImprovement(
            source="user",
            current_target="usuario",
            suggested_target="cliente",
            reason="In business contexts, 'cliente' is more appropriate",
            confidence=0.8,
        ),
    ]
    return ImprovementResponse(
        conversation_id=conversation_id,
        status="processing",
        improvements=mockImprovements,
    )

    # If not tracked, return processing status
    # return ImprovementResponse(
    #     conversation_id=conversation_id,
    #     status="processing",
    #     improvements=[],
    # )


@app.post("/apply-glossary-update")
def apply_glossary_update(request: ApplyGlossaryRequest):
    """Apply a selected glossary update."""
    from translate_graph.glossary_manager import GlossaryManager

    glossary_manager = GlossaryManager()
    success = glossary_manager.add_source(request.source, request.target, request.note)

    if success:
        return {
            "status": "success",
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
