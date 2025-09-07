import lgstudiostep0 from "@/assets/howitworks/lgstep0.webp";
import lgstudiostep1 from "@/assets/howitworks/lgstep1.webp";
import lgstudiostep2 from "@/assets/howitworks/lgstep2.webp";
import lgstudiostep3 from "@/assets/howitworks/lgstep3.webp";
import lgstudiostep4 from "@/assets/howitworks/lgstep4.webp";
import lgstudiostep5 from "@/assets/howitworks/lgstep5.webp";
import uistep0 from "@/assets/howitworks/uistep0.webp";
import uistep1 from "@/assets/howitworks/uistep1.webp";
import uistep2 from "@/assets/howitworks/uistep2.webp";
import uistep3 from "@/assets/howitworks/uistep3.webp";
import uistep4 from "@/assets/howitworks/uistep4.webp";
import uistep5 from "@/assets/howitworks/uistep5.webp";
import {Bot, MoveRight, User} from "lucide-react";
import {type StepTextContent} from "./StepTextContent";

// Reusable responsive icon class
const responsiveIconClass = "w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5";

const uiTranslateInputPosition = {
  top: "35%",
  left: "30%",
  width: "0%",
  height: "0%"
};
const uiAiMessagesPosition = {
  top: "35%",
  left: "65%",
  width: "0%",
  height: "0%"
};
const uiUserFeedbackPosition = {
  top: "85%",
  left: "62%",
  width: "0%",
  height: "0%"
};
const uiSourceLangPosition = {
  top: "18%",
  left: "25%",
  width: "0%",
  height: "0%"
};
const uiTargetLangPosition = {
  top: "18%",
  left: "60%",
  width: "0%",
  height: "0%"
};

export type StepData = {
  step: number;
  title: string;
  uiImage: string;
  graphImage: string;
  highlights: Highlights;
};

export type Step = StepData & StepTextContent;
export type Highlights = {
  ui: Highlight[];
  graph: Highlight[];
};

// (Put the updated Highlight type definition here or import it)
export type Highlight = {
  key: string;
  text: React.ReactNode;
  icon?: React.ReactNode;
  position: {
    top: string;
    left: string;
    width: string;
    height: string;
  };
  className?: string;
  textPosition?: "inside" | "top" | "bottom";
};

// Text content data separated from other step elements
export const stepTextContent: StepTextContent[] = [
  {
    uiDescription:
      'The Translate Prompt interface allows users to input text for translation and provides a collaborative environment where users can guide the AI to improve translations through feedback.\n**UI Components:**\n- **Text Input**: Where users enter text to translate (e.g., "veni vidi vici")\n- **Language Selection**: Choose source and target languages\n- **Translation Display**: Shows AI-generated translations\n- **Feedback Input**: Where users provide guidance for improvements\n- **Refinement Process**: Interactive cycle of feedback and improvement',
    langgraphDescription:
      "LangGraph is a framework for creating stateful, multi-agent applications. Our translation system uses LangGraph to orchestrate the translation process through a structured graph of nodes.\n**LangGraph Architecture:**\nThe graph consists of three main nodes:\n- **`initial_translation`**: Creates the first translation using personal glossary and rules\n- **`supervisor`**: Manages conversation flow and uses interrupts to wait for user feedback\n- **`refine_translation`**: Processes user feedback and improves the translation\nThe graph uses LangGraph's `Command` and `interrupt` patterns to create a collaborative, interactive translation experience.",
    codeExamples: [
      {
        title: "Graph Structure Setup",
        code: `# Graph structure
graph.add_node("supervisor", supervisor)
graph.add_node("initial_translation", initial_translation)
graph.add_node("refine_translation", refine_translation)

graph.add_edge(START, "initial_translation")`,
        language: "python",
        description:
          "Basic graph setup with three main nodes and initial routing"
      }
    ]
  },
  {
    uiDescription:
      'The user enters the text "veni vidi vici" in the input field and selects Latin as the source language and English as the target language. The interface captures this information and prepares to send it to the translation system.\n**User Actions:**\n- Types "veni vidi vici" in the text input field\n- Selects Latin from the source language dropdown\n- Selects English from the target language dropdown\n- The system shows "AI translating..." status',
    langgraphDescription:
      "The graph starts with the `START` node automatically routing to `initial_translation`. The input data structure includes the user's text and language preferences.\n**LangGraph Implementation:**\nThe system captures the user input and prepares it for processing by the graph nodes.",
    codeExamples: [
      {
        title: "Input Data Structure",
        code: `input_data = {
    "messages": "veni vidi vici",
    "source_language": "latin",
    "target_language": "english",
    "user_id": session.get_user_id() if session else None,
}`,
        language: "python",
        description:
          "Data structure passed to the graph with user input and preferences"
      },
      {
        title: "Graph Edge Definition",
        code: `graph.add_edge(START, "initial_translation")`,
        language: "python",
        description:
          "Simple routing from START node to initial_translation node"
      }
    ]
  },
  {
    uiDescription:
      'The AI processes the Latin text "veni vidi vici" and generates the first translation: "I came, I saw, I conquered." This translation appears in the chat interface, showing the AI\'s initial interpretation of the famous Latin phrase.\n**UI Display:**\n- The original text "veni vidi vici" remains visible in the input field\n- The AI\'s translation "I came, I saw, I conquered" appears in the chat\n- The system is now ready to receive user feedback for refinement',
    langgraphDescription:
      "The `initial_translation` node performs the core translation logic, looking up the user's personal glossary and translation rules to create a personalized translation.\n**LangGraph Implementation:**\nThe node processes the text, applies user preferences, and generates the first translation.",
    codeExamples: [
      {
        title: "Initial Translation Node",
        code: `def initial_translation(state: TranslateState) -> Command[Literal["supervisor"]]:
    text_to_translate = "veni vidi vici"  # From state
    source_language = "latin"
    target_language = "english"
    user_id = state["user_id"]
    
    # Load user's glossary and rules
    glossary_data = glossary_manager.get_all_sources_for_user(
        user_id, source_language, target_language
    )
    rules_data = rules_manager.get_entries_for_user(
        user_id, source_language, target_language
    )
    
    # Match words from glossary
    found_glossary_words = match_words_from_glossary(glossary_data, text_to_translate)
    
    # Generate translation with LLM
    response = llm.invoke(prompt)  # Returns "I came, I saw, I conquered"
    
    return Command(
        goto="supervisor",
        update={"messages": [AIMessage(content=response.content)]}
    )`,
        language: "python",
        description:
          "Core translation logic that processes user input and generates the first translation"
      }
    ]
  },
  {
    uiDescription:
      'The user sees the AI\'s translation "I came, I saw, I conquered" and decides they want to change "conquered" to "won". The feedback input field becomes active and highlighted, ready for the user to provide guidance to the AI.\n**User Interaction:**\n- User reviews the translation "I came, I saw, I conquered"\n- Decides to provide feedback to improve the translation\n- The feedback input field becomes active and ready for input\n- User prepares to type their refinement request',
    langgraphDescription:
      "The `supervisor` node uses LangGraph's interrupt mechanism to pause execution and wait for user input. This creates a collaborative pause where the user can provide guidance.\n**LangGraph Implementation:**\nThe supervisor pauses the graph execution and waits for user feedback.",
    codeExamples: [
      {
        title: "Supervisor Node with Interrupt",
        code: `def supervisor(state: TranslateState) -> Command[Literal["refine_translation"]]:
    last_message = "I came, I saw, I conquered"  # From state
    value = interrupt(last_message)  # Pauses graph execution
    return Command(
        goto="refine_translation",
        update={"messages": [HumanMessage(content=value)]}
    )`,
        language: "python",
        description:
          "The supervisor node pauses execution and waits for user input using LangGraph's interrupt mechanism"
      }
    ]
  },
  {
    uiDescription:
      'The user types their feedback in the refinement field: "Use won instead of conquered". This specific guidance tells the AI exactly how to improve the translation. The user\'s feedback is now ready to be sent to the AI for processing.\n**User Feedback:**\n- User types: "Use won instead of conquered"\n- This provides specific guidance on word choice\n- The feedback is clear and actionable\n- The system prepares to send this guidance to the AI',
    langgraphDescription:
      "When the user submits feedback, the frontend calls the `/refine-translation` endpoint which resumes the graph execution with the user's guidance.\n**LangGraph Implementation:**\nThe system resumes the paused graph with the user's feedback.",
    codeExamples: [
      {
        title: "Refine Translation Endpoint",
        code: `@router.post("/refine-translation")
def refine_translation(translate_request: TranslateRequest):
    thread_id = translate_request.conversation_id
    user_refinement_message = "Use won instead of conquered"  # User feedback
    
    # Resume graph with user's feedback
    result = run_graph(Command(resume=user_refinement_message), thread_id)
    
    return {"response": extractInterruption(result), "conversation_id": thread_id}`,
        language: "python",
        description:
          "API endpoint that resumes the graph execution with user feedback"
      }
    ]
  },
  {
    uiDescription:
      'The AI processes the user\'s feedback "Use won instead of conquered" and generates the improved translation: "I came, I saw, I won." The new translation appears in the chat, showing that the AI successfully applied the user\'s guidance. The system is now ready for another round of feedback if needed.\n**Final Result:**\n- Original: "I came, I saw, I conquered"\n- User feedback: "Use won instead of conquered"\n- Improved translation: "I came, I saw, I won"\n- The AI successfully applied the user\'s specific guidance',
    langgraphDescription:
      "The `refine_translation` node processes the user's feedback and generates an improved translation, then returns to the supervisor for potential further refinement.\n**LangGraph Implementation:**\nThe node processes the feedback and creates an improved translation.",
    codeExamples: [
      {
        title: "Refine Translation Node",
        code: `def refine_translation(state: TranslateState) -> Command[Literal["supervisor"]]:
    last_two_messages = [
        "I came, I saw, I conquered",  # AI message
        "Use won instead of conquered"  # User feedback
    ]
    source_language = "latin"
    target_language = "english"
    
    # Create refinement prompt with conversation history
    prompt = update_translation_instructions.format(
        messages=get_buffer_string(last_two_messages),
        source_language=source_language,
        target_language=target_language,
        translation_instructions=translation_instructions.format(...)
    )
    
    response = llm.invoke(prompt)  # Returns "I came, I saw, I won"
    
    return Command(
        goto="supervisor",
        update={"messages": [AIMessage(content=response.content)]}
    )`,
        language: "python",
        description:
          "Processes user feedback and generates an improved translation, creating a refinement loop"
      }
    ]
  }
];

// Step data without text content
export const stepData: StepData[] = [
  {
    step: 0,
    title: "How Langgraph and Translate Prompt work together?",
    uiImage: uistep0, // Initial empty state
    graphImage: lgstudiostep0, // All nodes idle
    highlights: {
      ui: [
        {
          key: "translate-input",
          text: (
            <span className="flex items-center gap-2">
              Text to translate <User className={responsiveIconClass} />
            </span>
          ),
          position: uiTranslateInputPosition,
          className: ""
        },
        {
          key: "ai-messages",
          text: (
            <span className="flex items-center gap-2">
              Translations <Bot className={responsiveIconClass} />
            </span>
          ),
          position: uiAiMessagesPosition,
          className: ""
        },
        {
          key: "user-feedback",
          text: (
            <span className="flex items-center gap-2">
              Feedback <User className={responsiveIconClass} />
            </span>
          ),
          position: uiUserFeedbackPosition,
          className: ""
        },
        {
          key: "source-lang",
          text: (
            <span className="flex items-center gap-2">
              Source Language <MoveRight className={responsiveIconClass} />
            </span>
          ),
          position: uiSourceLangPosition,
          className: ""
        },
        {
          key: "target-lang",
          text: (
            <span className="flex items-center gap-2">
              Target Language <MoveRight className={responsiveIconClass} />
            </span>
          ),
          position: uiTargetLangPosition,
          className: ""
        }
      ],
      graph: []
    }
  },
  {
    step: 1,
    title: "Step 1: User Enters Text and Chooses Languages",
    uiImage: uistep1, // Input text is filled
    graphImage: lgstudiostep1, // START -> initial_translation highlighted,
    highlights: {
      ui: [
        {
          key: "translate-input-filled",
          text: (
            <span className="flex items-center gap-2">
              User enters text to translate{" "}
              <User className={responsiveIconClass} />
            </span>
          ),
          position: uiTranslateInputPosition,
          className: ""
        },
        {
          key: "ai-translating",
          text: (
            <span className="flex items-center gap-2">
              AI translating <Bot className={responsiveIconClass} />
            </span>
          ),
          position: uiAiMessagesPosition,
          className: ""
        }
      ],
      graph: []
    }
  },
  {
    step: 2,
    title: "Step 2: AI Agent Creates First Translation",
    uiImage: uistep2, // Translation appears
    graphImage: lgstudiostep2, // initial_translation node is active
    highlights: {
      ui: [
        {
          key: "translation-result",
          text: (
            <span className="flex items-center gap-2">
              AI first translation <Bot className={responsiveIconClass} />
            </span>
          ),
          position: uiAiMessagesPosition,
          className: ""
        },
        {
          key: "input-still-visible",
          text: (
            <span className="flex items-center gap-2">
              User's original text <User className={responsiveIconClass} />
            </span>
          ),
          position: uiTranslateInputPosition,
          className: ""
        }
      ],
      graph: []
    }
  },
  {
    step: 3,
    title: "Step 3: User Provides Feedback",
    uiImage: uistep3, // Refine input is highlighted/active
    graphImage: lgstudiostep3, // supervisor node is active
    highlights: {
      ui: [
        {
          key: "refine-input-activated",
          text: (
            <span className="flex items-center gap-2">
              User feedback <User className={responsiveIconClass} />
            </span>
          ),
          position: uiUserFeedbackPosition,
          className: ""
        },
        {
          key: "translation-displayed",
          text: (
            <span className="flex items-center gap-2">
              AI first translation <Bot className={responsiveIconClass} />
            </span>
          ),
          position: uiAiMessagesPosition,
          className: ""
        }
      ],
      graph: []
    }
  },
  {
    step: 4,
    title: "Step 4: User Guides the AI Agent",
    uiImage: uistep4, // Refine input is filled by user
    graphImage: lgstudiostep4, // supervisor -> refine_translation highlighted
    highlights: {
      ui: [
        {
          key: "user-feedback-entered",
          text: (
            <span className="flex items-center gap-2">
              User's feedback <User className={responsiveIconClass} />
            </span>
          ),
          position: uiUserFeedbackPosition,
          className: ""
        },
        {
          key: "translation-to-refine",
          text: (
            <span className="flex items-center gap-2">
              AI analyzing feedback <Bot className={responsiveIconClass} />
            </span>
          ),
          position: uiAiMessagesPosition,
          className: ""
        }
      ],
      graph: []
    }
  },
  {
    step: 5,
    title: "Step 5: AI Agent Learns and Improves",
    uiImage: uistep5, // Translation is updated
    graphImage: lgstudiostep5, // refine_translation -> supervisor loop is active
    highlights: {
      ui: [
        {
          key: "new-translation",
          text: (
            <span className="flex items-center gap-2">
              New AI translation <Bot className={responsiveIconClass} />
            </span>
          ),
          position: uiAiMessagesPosition,
          className: ""
        }
      ],
      graph: []
    }
  }
];

// Function to merge step data with text content
export function createSteps(): Step[] {
  return stepData.map((step, index) => ({
    ...step,
    ...stepTextContent[index]
  }));
}

// Export the merged steps for backward compatibility
export const steps: Step[] = createSteps();
