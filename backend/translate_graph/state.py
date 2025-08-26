import operator
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


def add_reducer(
    current_value: list[ToolCall], new_value: list[ToolCall]
) -> list[ToolCall]:
    """Add a new value to the list."""
    return operator.add(current_value, new_value)


class TranslateState(TranslateInputState):
    """Main agent state containing messages."""

    messages: Annotated[list[BaseMessage], add_messages]
    original_text: str = ""
    improvement_tool_calls: Annotated[list[ToolCall], add_reducer] = []
    test: str = ""
