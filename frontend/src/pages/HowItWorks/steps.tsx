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

export type Step = {
  step: number;
  title: string;
  description: string;
  uiImage: string;
  graphImage: string;
  highlights: Highlights;
};
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

export const steps: Step[] = [
  {
    step: 0,
    title: "Meet Your Personal Translation Partner",
    description:
      "Imagine having a translation expert who knows your style, remembers your preferences, and gets better with every conversation. That's exactly what you're about to experience. This isn't just another translation tool – it's your personal AI collaborator that learns from you.",
    uiImage: uistep0, // Initial empty state
    graphImage: lgstudiostep0, // All nodes idle
    highlights: {
      ui: [
        {
          key: "translate-input",
          text: (
            <span className="flex items-center gap-2">
              Type your text here <User className={responsiveIconClass} />
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
    description:
      "User types the text they want to translate and selects the source and target languages. The system captures this information and prepares to create the first translation using the user's personal glossary and translation rules.",
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
        },
        {
          key: "source-lang-selected",
          text: (
            <span className="flex items-center gap-2">
              User selects source language{" "}
              <MoveRight className={responsiveIconClass} />
            </span>
          ),
          position: uiSourceLangPosition,
          className: ""
        },
        {
          key: "target-lang-selected",
          text: (
            <span className="flex items-center gap-2">
              User selects target language{" "}
              <MoveRight className={responsiveIconClass} />
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
    step: 2,
    title: "Step 2: AI Agent Creates First Translation",
    description:
      "The AI agent looks up the user's personal glossary and translation rules, then creates the first translation. It matches words from the user's text with saved glossary entries and applies custom rules to generate a personalized translation.",
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
    description:
      "The AI agent pauses and waits for user input. The feedback field becomes active, ready for the user to tell the AI agent how to improve the translation. This is where the collaboration happens - the user guides the AI agent to make it better.",
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
    description:
      "User types feedback in the refinement field. The user might say things like 'make it more formal', 'use simpler words', or 'this word should be translated as...'. The AI agent receives the guidance and prepares to improve the translation.",
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
    description:
      "The AI agent takes the user's feedback and creates a better translation. It learns from the user's guidance and applies the suggestions. The improved translation appears, and the system is ready for another round of feedback if the user wants to refine it further. This cycle can continue until the user is completely satisfied with the result.",
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
