import os
from typing import Literal

from langchain_core.messages import (
    AIMessage,
    HumanMessage,
    get_buffer_string,
)
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import START, StateGraph
from langgraph.types import Command, interrupt

from glossary import GlossaryManager
from translate_graph.match_words import match_words_from_glossary
from translate_graph.prompts import (
    first_translation_instructions,
    translation_instructions,
    update_translation_instructions,
)
from translate_graph.state import (
    TranslateInputState,
    TranslateState,
)
from translate_graph.utils import format_glossary
from utils.llm_service import LLM_Service

# Initialize glossary manager
glossary_manager = GlossaryManager()

# Get API key from environment
google_api_key = os.getenv("GOOGLE_API_KEY")
if not google_api_key:
    raise ValueError("GOOGLE_API_KEY environment variable is required")

llm = LLM_Service()


def initial_translation(state: TranslateState) -> Command[Literal["supervisor"]]:
    text_to_translate = state["messages"][-1].content
    source_language = state["source_language"]
    target_language = state["target_language"]

    # Load current glossary for the specified language pair
    glossary_data = glossary_manager.get_all_sources(source_language, target_language)
    found_glossary_words = match_words_from_glossary(glossary_data, text_to_translate)

    prompt = first_translation_instructions.format(
        text_to_translate=text_to_translate,
        source_language=source_language,
        target_language=target_language,
        translation_instructions=translation_instructions.format(
            source_language=source_language,
            target_language=target_language,
            glossary=format_glossary(found_glossary_words),
        ),
    )
    response = llm.invoke(prompt)

    return Command(
        goto="supervisor",
        update={
            "messages": [AIMessage(content=response.content)],
            "original_text": text_to_translate,
            "test": "initial trans",
        },
    )


def supervisor(
    state: TranslateState,
) -> Command[Literal["refine_translation"]]:
    last_message = state["messages"][-1].content
    value = interrupt(last_message)
    return Command(
        goto="refine_translation",
        update={
            "messages": [HumanMessage(content=value)],
        },
    )


def refine_translation(
    state: TranslateState,
) -> Command[Literal["supervisor"]]:
    last_two_messages = state["messages"][-2:]
    source_language = state["source_language"]
    target_language = state["target_language"]

    prompt = update_translation_instructions.format(
        messages=get_buffer_string(last_two_messages),
        source_language=source_language,
        target_language=target_language,
        translation_instructions=translation_instructions.format(
            source_language=source_language,
            target_language=target_language,
            glossary={},
        ),
    )
    response = llm.invoke(prompt)

    return Command(
        goto="supervisor",
        update={
            "messages": [AIMessage(content=response.content)],
        },
    )


graph = StateGraph(TranslateState, input_schema=TranslateInputState)

graph.add_node("supervisor", supervisor)
graph.add_node("initial_translation", initial_translation)
graph.add_node("refine_translation", refine_translation)
# graph.add_node("check_glossary_updates", check_glossary_updates)

graph.add_edge(START, "initial_translation")
# graph.add_edge("refine_translation", "check_glossary_updates")

checkpointer = MemorySaver()
graph = graph.compile(checkpointer=checkpointer)  ## use without langgraph stdio
# graph = graph.compile()  ##  use with langgraph studio
