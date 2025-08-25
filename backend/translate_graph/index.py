from typing import Literal

from langchain.chat_models import init_chat_model
from langchain_core.messages import (
    AIMessage,
    HumanMessage,
    get_buffer_string,
)
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import END, START, StateGraph
from langgraph.types import Command, interrupt

from translate_graph.glossary_manager import GlossaryManager
from translate_graph.match_words import match_words_from_glossary
from translate_graph.prompts import (
    first_translation_instructions,
    lead_update_glossary_prompt,
    translation_instructions,
    update_translation_instructions,
)
from translate_graph.state import (
    ConductUpdate,
    NoUpdate,
    TranslateInputState,
    TranslateState,
)
from translate_graph.utils import format_glossary

# Initialize glossary manager
glossary_manager = GlossaryManager()


llm = init_chat_model(model="google_genai:gemini-2.5-flash-lite")


def initial_translation(state: TranslateState) -> Command[Literal["supervisor"]]:
    text_to_translate = state["messages"][-1].content

    # Load current glossary
    glossary_en_es = glossary_manager.load_glossary()
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


def check_glossary_updates(state: TranslateState) -> Command[Literal["__end__"]]:
    if state["messages"] and len(state["messages"]) < 3:
        return Command(goto=END)

    # _ is translation_with_feedback, it is not used, just to understand what the three messages are
    translation_without_feedback, feedback, _ = state["messages"][-3:]
    prompt = lead_update_glossary_prompt.format(
        translation_with_errors=translation_without_feedback.content,
        user_feedback=feedback.content,
        original_text=state["original_text"],
    )

    response = llm.bind_tools([ConductUpdate, NoUpdate]).invoke(prompt)

    if response.tool_calls:
        return Command(goto=END, update={"improvement_tool_calls": response.tool_calls})

    return Command(
        goto=END,
        update={"messages": [AIMessage(content="No glossary update detected.")]},
    )


graph = StateGraph(TranslateState, input_schema=TranslateInputState)

graph.add_node("supervisor", supervisor)
graph.add_node("initial_translation", initial_translation)
graph.add_node("refine_translation", refine_translation)
graph.add_node("check_glossary_updates", check_glossary_updates)

graph.add_edge(START, "initial_translation")

checkpointer = MemorySaver()
graph = graph.compile(checkpointer=checkpointer)  ## TODO: use without langgraph stdio
# graph = graph.compile()  ## TODO: use with langgraph studio
