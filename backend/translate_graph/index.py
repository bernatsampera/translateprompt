import os
from typing import Literal

from dotenv import load_dotenv
from langchain.chat_models import init_chat_model
from langchain_core.messages import (
    AIMessage,
    HumanMessage,
    get_buffer_string,
)
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import START, StateGraph
from langgraph.types import Command, interrupt

from translate_graph.glossary_manager import GlossaryManager
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

# Load environment variables
load_dotenv()

# Initialize glossary manager
glossary_manager = GlossaryManager()

# Get API key from environment
google_api_key = os.getenv("GOOGLE_API_KEY")
if not google_api_key:
    raise ValueError("GOOGLE_API_KEY environment variable is required")

llm = init_chat_model(
    model="google_genai:gemini-2.5-flash-lite", google_api_key=google_api_key
)


def initial_translation(state: TranslateState) -> Command[Literal["supervisor"]]:
    text_to_translate = state["messages"][-1].content

    # Load current glossary for English to Spanish
    glossary_en_es = glossary_manager.get_all_sources("en", "es")
    found_glossary_words = match_words_from_glossary(glossary_en_es, text_to_translate)

    prompt = first_translation_instructions.format(
        text_to_translate=text_to_translate,
        translation_instructions=translation_instructions.format(
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
    prompt = update_translation_instructions.format(
        messages=get_buffer_string(last_two_messages),
        translation_instructions=translation_instructions.format(glossary={}),
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
