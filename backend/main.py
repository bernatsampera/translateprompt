from concurrent.futures import thread
import uuid

from fastapi.exceptions import HTTPException
from langgraph.types import Command
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_core.messages import HumanMessage

from basic_translate.index import graph as basic_translate_graph
from translate_graph.index import graph

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
    return {"message": "This comes from the backend"}


class TranslateRequest(BaseModel):
    message: str
    conversation_id: str | None = None


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


def run_graph(input_data, thread_id: str):
    config = {"configurable": {"thread_id": thread_id}}
    result = graph.invoke(input_data, config)
    return {"response": result, "conversation_id": thread_id}


@app.post("/translate")
def translate(request: TranslateRequest):
    """Chat endpoint to start the graph with a user message."""
    # Get or create conversation ID (thread_id in LangGraph)
    thread_id = request.conversation_id
    if not thread_id:
        thread_id = str(uuid.uuid4())

    # Create Input Data
    input_data = {"messages": request.message}

    return run_graph(input_data, thread_id)


@app.post("/refine-translation")
def refine_translation(request: TranslateRequest):
    """Chat endpoint to refine the translation."""
    thread_id = request.conversation_id
    if not thread_id:
        raise HTTPException(
            status_code=400, detail="Conversation ID is required to refine translation"
        )

    user_refinement_message = request.message
    return run_graph(Command(resume=user_refinement_message), thread_id)


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8008, reload=True)
