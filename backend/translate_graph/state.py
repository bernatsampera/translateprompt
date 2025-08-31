"""State definitions and reducers for the translation graph."""

from typing import Annotated

from langchain_core.messages import BaseMessage
from langgraph.graph import MessagesState, add_messages
from pydantic import BaseModel


###################
# Structured Outputs
###################
class UpdateGlossaryClass(BaseModel):
    """Structured output from the update glossary subgraph."""

    source: str
    target: str
    note: str


class UpdateRulesClass(BaseModel):
    """Call this tool to conduct update on a specific adjustment from the user."""

    text: str


class GlossaryUpdate(UpdateGlossaryClass):
    """Call this tool to conduct update on a specific adjustment from the user."""


class RulesUpdate(UpdateRulesClass):
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
    user_id: str | None


class TranslateState(TranslateInputState):
    """Main agent state containing messages."""

    messages: Annotated[list[BaseMessage], add_messages]
    original_text: str = ""
    test: str = ""
