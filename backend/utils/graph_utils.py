"""Utility functions for graph operations."""

from typing import Any, Dict

from fastapi import HTTPException

from translate_graph.index import graph


def create_graph_config(conversation_id: str) -> Dict[str, Dict[str, str]]:
    """Create graph configuration for conversation ID."""
    return {"configurable": {"thread_id": conversation_id}}


def get_graph_state(conversation_id: str) -> Dict[str, Any]:
    """Get graph state for conversation ID. Raises 404 if not found."""
    config = create_graph_config(conversation_id)

    try:
        state = graph.get_state(config)
        if not state or not state.values:
            raise HTTPException(
                status_code=404,
                detail=f"Conversation state not found for ID: {conversation_id}",
            )
        return state.values
    except Exception as e:
        if "not found" in str(e).lower() or "does not exist" in str(e).lower():
            raise HTTPException(
                status_code=404,
                detail=f"Conversation state not found for ID: {conversation_id}",
            )
        raise e
