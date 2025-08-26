"""Glossary-related endpoints for the translation API."""

import os

from fastapi import APIRouter, HTTPException
from langchain.chat_models import init_chat_model

from models import ApplyGlossaryRequest, GlossaryEntry, GlossaryResponse
from translate_graph.glossary_manager import GlossaryManager
from translate_graph.index import graph
from translate_graph.prompts import lead_update_glossary_prompt
from translate_graph.state import ConductUpdate, NoUpdate

router = APIRouter(prefix="/glossary", tags=["glossary"])
from dotenv import load_dotenv

load_dotenv()

google_api_key = os.getenv("GOOGLE_API_KEY")
if not google_api_key:
    raise ValueError("GOOGLE_API_KEY environment variable is required")

llm = init_chat_model(
    model="google_genai:gemini-2.5-flash-lite", google_api_key=google_api_key
)


@router.get("/glossary-improvements/{conversation_id}")
def get_glossary_improvements(conversation_id: str) -> list[GlossaryEntry]:
    """Get glossary improvement suggestions for a conversation."""
    config = {"configurable": {"thread_id": conversation_id}}
    state = graph.get_state(config).values

    if state["messages"] and len(state["messages"]) < 3:
        return []

    # _ is translation_with_feedback, it is not used, just to understand what the three messages are
    translation_without_feedback, feedback, _ = state["messages"][-3:]
    prompt = lead_update_glossary_prompt.format(
        translation_with_errors=translation_without_feedback.content,
        user_feedback=feedback.content,
        original_text=state["original_text"],
    )

    response = llm.bind_tools([ConductUpdate, NoUpdate]).invoke(prompt)

    tool_calls = response.tool_calls
    print("tool_calls", tool_calls)
    if response.tool_calls:
        print("updating state with tool calls")
        graph.update_state(config, {"improvement_tool_calls": tool_calls})

    state = graph.get_state(config).values

    improvement_tool_calls = state.get("improvement_tool_calls", [])

    glossary_entries = [
        GlossaryEntry(
            source=improvement_tool_call["args"]["source"],
            target=improvement_tool_call["args"]["target"],
            note=improvement_tool_call["args"]["note"],
        )
        for improvement_tool_call in improvement_tool_calls
    ]

    # If not tracked, return processing status (analysis not started yet)
    return glossary_entries


@router.post("/apply-glossary-update")
def apply_glossary_update(request: ApplyGlossaryRequest):
    """Apply a selected glossary update."""
    glossary_entry, conversation_id = request.glossary_entry, request.conversation_id

    if conversation_id:
        config = {"configurable": {"thread_id": conversation_id}}
        graph_values = graph.get_state(config).values

        print("graph_values", graph_values)
        improvement_tool_calls = graph_values.get("improvement_tool_calls", [])

        print("length before", len(improvement_tool_calls))

        # Remove from improvement_tool_calls the glossary entry that is being applied
        improvement_tool_calls = [
            improvement_tool_call
            for improvement_tool_call in improvement_tool_calls
            if improvement_tool_call["args"]["source"] != glossary_entry.source
            or improvement_tool_call["args"]["target"] != glossary_entry.target
        ]

        print("length after", len(improvement_tool_calls))

        # Update the state with the modified improvement_tool_calls
        graph.update_state(
            config,
            {"improvement_tool_calls": improvement_tool_calls},
        )

    glossary_manager = GlossaryManager()
    success = glossary_manager.add_source(
        glossary_entry.source, glossary_entry.target, glossary_entry.note
    )

    if success:
        return {"message": "success"}
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
