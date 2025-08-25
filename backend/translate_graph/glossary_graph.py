from typing import Literal

from dotenv import load_dotenv
from langchain.chat_models import init_chat_model
from langchain_core.messages import (
    AIMessage,
)
from langgraph.graph import END, START, StateGraph
from langgraph.types import Command

from translate_graph.prompts import (
    lead_update_glossary_prompt,
)
from translate_graph.state import (
    ConductUpdate,
    NoUpdate,
    TranslateState,
    UpdateGlossaryState,
)

load_dotenv()

llm = init_chat_model(model="google_genai:gemini-2.5-flash-lite")


def update_glossary_supervisor(
    state: TranslateState,
) -> Command[Literal["__end__"]]:
    last_three_messages = state["messages"][-3:]

    # Get third last message starting from the last message
    translation_with_errors = last_three_messages[-3]
    user_feedback = last_three_messages[-2]

    prompt = lead_update_glossary_prompt.format(
        translation_with_errors=translation_with_errors.content,
        user_feedback=user_feedback.content,
        original_text=state["original_text"],
    )

    update_glossary_tools = [ConductUpdate, NoUpdate]

    llm_with_tool = llm.bind_tools(update_glossary_tools)
    response = llm_with_tool.invoke(prompt)

    print("response update glossary supervisor", response)

    # Store the proposed term for confirmation
    if response.tool_calls and len(response.tool_calls) > 0:
        return Command(
            goto=END,
            update={
                "tools_calls": response.tool_calls,
            },
        )
    else:
        print("No valid term to add")

        return Command(
            goto=END,
            update={
                "messages": [AIMessage(content="No glossary update detected.")],
            },
        )


# def confirm_glossary(
#     state: TranslateState,
# ) -> Command[Literal["__end__"]]:
#     """Ask user for confirmation before adding term to glossary."""
#     messages = state.get("messages", [])
#     most_recent_message = messages[-1]

#     conduct_update_calls = [
#         tool_call
#         for tool_call in most_recent_message.tool_calls
#         if tool_call["name"] == "ConductUpdate"
#     ]

#     updates_logs = []

#     for conduct_update_call in conduct_update_calls:
#         source = conduct_update_call["args"]["source"]
#         target = conduct_update_call["args"]["target"]
#         note = conduct_update_call["args"]["note"]
#         confirmation_message = f"Do you want to add this term to the glossary?\n\nSource (English): {source}\nTarget (Spanish): {target}\nNote: {note}\n\nType 'yes' to add, 'no' to skip, or provide your own correction."

#         user_response = interrupt({"confirmation_request": confirmation_message})

#         if user_response.lower().strip() in ["yes", "y", "sí", "si"]:
#             glossary_manager.add_source(source, target, note)
#             updates_logs.append(f"✅ Added term '{source}' → '{target}' to glossary.")
#         else:
#             updates_logs.append(f"❌ Failed to add term '{source}' to glossary.")

#     return Command(
#         goto=END,
#         update={
#             "messages": [AIMessage(content="\n".join(updates_logs))],
#         },
#     )


update_glossary_builder = StateGraph(UpdateGlossaryState)

update_glossary_builder.add_node(
    "update_glossary_supervisor", update_glossary_supervisor
)
# update_glossary_builder.add_node("confirm_glossary", confirm_glossary)

update_glossary_builder.add_edge(START, "update_glossary_supervisor")

update_glossary_graph = update_glossary_builder.compile()
