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
      "Our journey begins with a clean interface for our AI-powered translation tool. The user's goal is to translate a phrase and then collaborate with the AI to perfect it.\n\n**UI Components:**\n- **Text Input**: Where the user types the text to translate.\n- **Language Selection**: To choose the source and target languages.\n- **Chat Display**: Shows the back-and-forth between the user and the AI.\n- **Feedback Input**: A dedicated space for the user to guide the AI's next attempt.",
    langgraphDescription:
      "Behind the scenes, we use **LangGraph** to create our translation agent. Think of LangGraph as a flowchart for AI. It orchestrates the process through a series of steps called **nodes**.\n\n**Our Agent's Architecture:**\n- **`initial_translation`**: The specialist that performs the first translation, using the user's personal glossary and rules.\n- **`wait_for_feedback`**: This node pauses the process and waits for the user's input.\n- **`refine_translation`**: The specialist that revises the translation based on the user's guidance.",
    codeExamples: [
      {
        title: "Building the Agent's Flowchart",
        code: `# Define the nodes (specialists) for our graph
  graph.add_node("initial_translation", initial_translation)
  graph.add_node("wait_for_feedback", wait_for_feedback)
  graph.add_node("refine_translation", refine_translation)
  
  # The process always starts with the initial translation
  graph.add_edge(START, "initial_translation")`,
        language: "python",
        description:
          "Setting up the basic structure of our agent in LangGraph with three key nodes and a starting point."
      }
    ]
  },
  {
    uiDescription:
      'The user types "veni vidi vici" into the input field, selects Latin as the source, and English as the target. The system is now ready to begin the translation process.\n\n**User Actions:**\n- Types "veni vidi vici".\n- Selects Latin and English.\n- The system shows an "AI is translating..." status, indicating the agent has started its work.',
    langgraphDescription:
      "When the process starts, LangGraph creates a shared 'memory' for the conversation, which we call the **state**. This state holds all the important information, like the user's text, language choices, and the history of the conversation, allowing each node to have the context it needs to do its job.",
    codeExamples: [
      {
        title: "The Conversation's 'Memory' (State)",
        code: `input_data = {
      # The list of messages in the conversation
      "messages": ["veni vidi vici"],
      
      # User-defined parameters
      "source_language": "latin",
      "target_language": "english",
      "user_id": "user_1234"
  }`,
        language: "python",
        description:
          "This is the initial 'state' passed to the graph, containing the user's input and preferences."
      }
    ]
  },
  {
    uiDescription:
      'The AI processes the text and generates its first translation: "I came, I saw, I conquered." This initial version appears in the chat interface, ready for the user\'s review.\n\n**UI Display:**\n- The AI\'s translation "I came, I saw, I conquered" is displayed.\n- The system now waits for the user to either accept the translation or provide feedback.',
    langgraphDescription:
      "The graph's execution moves to the `initial_translation` node. This node reads the user's text from the **state**. It then consults the user's personal glossary and translation rules to generate a translation that is tailored to their preferences before sending it back to the user.",
    codeExamples: [
      {
        title: "Node: Initial Translation",
        code: `def initial_translation(state: TranslateState):
      # 1. Get user input from the 'state' (memory)
      text_to_translate = state["messages"][-1].content
      user_id = state["user_id"]
      
      # 2. Load user's personal glossary and rules
      glossary = load_user_glossary(user_id)
      rules = load_user_rules(user_id)
      
      # 3. Generate translation using the LLM with user's preferences
      prompt = create_prompt(text_to_translate, glossary, rules)
      response = llm.invoke(prompt) # -> "I came, I saw, I conquered"
      
      # 4. Update the state with the AI's message
      return {"messages": [AIMessage(content=response.content)]}`,
        language: "python",
        description:
          "This node uses the shared 'state' to access user data and generate a personalized first translation."
      }
    ]
  },
  {
    uiDescription:
      'The user reviews the translation and decides they want a different nuance. The feedback input field becomes active, inviting the user to guide the AI toward a better result.\n\n**User Interaction:**\n- The user sees "I came, I saw, I conquered".\n- They decide to offer a correction.\n- The interface prompts them for their feedback.',
    langgraphDescription:
      "The graph has now moved to the `wait_for_feedback` node. This node uses a special LangGraph feature called an **interrupt**. This intentionally pauses the entire process, effectively telling the user, 'I've made my first attempt. Now it's your turn to provide feedback.' The system will wait here indefinitely until the user responds.",
    codeExamples: [
      {
        title: "Node: Wait for Feedback (with Interrupt)",
        code: `def wait_for_feedback(state: TranslateState):
      # Get the AI's last message to display to the user
      last_message = state["messages"][-1].content
      
      # This special command pauses the graph and waits for human input.
      # The 'last_message' is sent to the UI to be displayed.
      value = interrupt(last_message)
      
      # When the user replies, their message ('value') will update the state
      return {"messages": [HumanMessage(content=value)]}`,
        language: "python",
        description:
          "The `interrupt` command pauses the graph, creating a natural point for human-in-the-loop collaboration."
      }
    ]
  },
  {
    uiDescription:
      'The user types their feedback into the refinement field: "Use won instead of conquered". This clear and specific instruction tells the AI exactly how to improve the translation.\n\n**User Feedback:**\n- The user provides the instruction: "Use won instead of conquered".\n- This feedback is sent back to the waiting AI agent.',
    langgraphDescription:
      "When the user submits their feedback, the system **resumes** the paused LangGraph process. The user's message is added to the conversation history in the **state**. This new information is now available for the next node in the graph, which is responsible for refining the translation.",
    codeExamples: [
      {
        title: "Resuming the Graph with Feedback",
        code: `user_feedback = "Use won instead of conquered"
  
  # The 'resume' command wakes up the paused graph.
  # The user's feedback is passed along to be added to the state.
  run_graph(Command(resume=user_feedback), conversation_id)`,
        language: "python",
        description:
          "The user's feedback is used to resume the graph, updating the state and triggering the next step."
      }
    ]
  },
  {
    uiDescription:
      'The AI processes the feedback and generates the improved translation: "I came, I saw, I won." This new version appears in the chat, showing that the AI successfully incorporated the user\'s guidance.\n\n**Beyond the Translation: AI Learning**\nBehind the scenes, the system also analyzes this interaction. It recognizes that the user preferred "won" over "conquered" and might proactively suggest adding this preference to the user\'s personal glossary for future translations.',
    langgraphDescription:
      "The `refine_translation` node is now triggered. It examines the last two messages in the **state** (the AI's original translation and the user's feedback) to understand the context. It then generates a new, improved translation.\n\nAfter this, a separate process analyzes the correction. It uses an LLM to determine if the feedback represents a reusable preference. If so, it can suggest a permanent **glossary** or **rule update**, allowing the agent to learn and improve over time.",
    codeExamples: [
      {
        title: "Node: Refine Translation",
        code: `def refine_translation(state: TranslateState):
      # Get the conversation history from the state
      last_two_messages = state["messages"][-2:]
      
      # Create a prompt instructing the LLM to refine its previous answer
      prompt = create_refinement_prompt(last_two_messages)
      
      response = llm.invoke(prompt) # -> "I came, I saw, I won"
      
      return {"messages": [AIMessage(content=response.content)]}`,
        language: "python",
        description:
          "This node uses the immediate feedback to make a one-time correction to the translation."
      },
      {
        title: "Bonus: Learning from Feedback",
        code: `def check_for_updates(state: TranslateState):
      # Analyze the last interaction
      original = "I came, I saw, I conquered"
      feedback = "Use won instead of conquered"
      
      # Ask an LLM to determine if this is a reusable rule
      prompt = f"Based on the feedback '{feedback}' for the translation '{original}', should a glossary be updated?"
      
      # The LLM can output a structured response, like:
      # GlossaryUpdate(source="conquered", target="won")
      suggestion = llm_with_tools.invoke(prompt)
      
      if suggestion:
          # Propose the update to the user
          propose_glossary_update(suggestion)`,
        language: "python",
        description:
          "After a refinement, the system analyzes the exchange to proactively suggest permanent improvements."
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
    graphImage: lgstudiostep3, // wait_for_feedback node is active
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
    graphImage: lgstudiostep4, // wait_for_feedback -> refine_translation highlighted
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
    graphImage: lgstudiostep5, // refine_translation -> wait_for_feedback loop is active
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
