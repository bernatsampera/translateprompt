"""State definitions and reducers for the translation graph."""

from typing import Annotated

from langchain_core.messages import BaseMessage, ToolCall
from langgraph.graph import MessagesState, add_messages
from pydantic import BaseModel


###################
# Structured Outputs
###################
class UpdateGlossary(BaseModel):
    """Structured output from the update glossary subgraph."""

    source: str
    target: str
    note: str


class ConductUpdate(UpdateGlossary):
    """Call this tool to conduct update on a specific adjustment from the user."""


class NoUpdate(BaseModel):
    """Call this tool when no update is needed."""

    reason: str


###################
# State Definitions
###################
class TranslateInputState(MessagesState):
    """Input state containing only messages."""

    source_language: str
    target_language: str


def improvement_tool_calls_reducer(
    current_value: list[ToolCall], new_value: list[ToolCall] | dict
) -> list[ToolCall]:
    """Reducer for improvement_tool_calls that supports adding, removing, and replacing.

    - If new_value is a list, it replaces the current_value completely
    - If new_value is a dict with 'action' key:
        - {'action': 'add', 'calls': [...]} - adds new calls to existing ones
        - {'action': 'remove', 'filter': {...}} - removes calls matching filter criteria
        - {'action': 'replace', 'calls': [...]} - replaces all calls with new ones
    """
    if isinstance(new_value, dict):
        action = new_value.get("action")

        if action == "add":
            return current_value + new_value.get("calls", [])
        elif action == "remove":
            filter_criteria = new_value.get("filter", {})
            return [
                call
                for call in current_value
                if not all(
                    call.get("args", {}).get(key) == value
                    for key, value in filter_criteria.items()
                )
            ]
        elif action == "replace":
            return new_value.get("calls", [])

    # Default behavior: replace with new_value if it's a list
    return new_value if new_value is not None else current_value


class TranslateState(TranslateInputState):
    """Main agent state containing messages."""

    messages: Annotated[list[BaseMessage], add_messages]
    original_text: str = ""
    improvement_tool_calls: Annotated[
        list[ToolCall], improvement_tool_calls_reducer
    ] = []
    test: str = ""
