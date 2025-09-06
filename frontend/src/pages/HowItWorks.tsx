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
import {useState} from "react";

// dynamicAgentSteps.js
export const steps = [
  {
    step: 0,
    title: "An Agentic, Human-in-the-Loop Workflow",
    description:
      "This isn't a simple API call. It's a stateful langgraph graph built with LangGraph that enables a collaborative translation process. Let's begin.",
    uiImage: uistep0, // Initial empty state
    graphImage: lgstudiostep0 // All nodes idle
  },
  {
    step: 1,
    title: "Step 1: The Initial Request",
    description:
      "You enter text into the main input. This data, along with language settings, is passed as the initial state to the agent's entry point.",
    uiImage: uistep1, // Input text is filled
    graphImage: lgstudiostep1 // START -> initial_translation highlighted
  },
  {
    step: 2,
    title: "Step 2: `initial_translation`",
    description:
      "The agent fetches your personal glossary and rules, then generates the first translation. The result is placed in the (uneditable) translation field.",
    uiImage: uistep2, // Translation appears
    graphImage: lgstudiostep2 // initial_translation node is active
  },
  {
    step: 3,
    title: "Step 3: `supervisor` and `interrupt`",
    description:
      "The agent now hits the 'supervisor' node, which pauses the workflow. The 'Refine Translation' input is activated, waiting for your feedback.",
    uiImage: uistep3, // Refine input is highlighted/active
    graphImage: lgstudiostep3 // supervisor node is active
  },
  {
    step: 4,
    title: "Step 4: The Human in the Loop",
    description:
      "You provide feedback in the refinement field. This new input is sent back into the graph to the `refine_translation` node.",
    uiImage: uistep4, // Refine input is filled by user
    graphImage: lgstudiostep4 // supervisor -> refine_translation highlighted
  },
  {
    step: 5,
    title: "Step 5: `refine_translation` and The Loop",
    description:
      "The agent uses your feedback to create an improved translation. The updated result is displayed, and the process loops back to the 'supervisor', ready for more feedback.",
    uiImage: uistep5, // Translation is updated
    graphImage: lgstudiostep5 // refine_translation -> supervisor loop is active
  }
];
const HowItWorks = () => {
  return (
    <div>
      <AgentExplainer />
    </div>
  );
};

export default HowItWorks;

// DynamicAgentExplainer.jsx

export function AgentExplainer() {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const activeStep = steps[currentStep];

  return (
    <div className="mx-auto p-4 sm:p-8  rounded-lg shadow-xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* LEFT PANEL: UI VISUAL - Source changes dynamically */}
        <div className="border p-2 rounded-md bg-white dark:bg-gray-800">
          <img
            src={activeStep.uiImage}
            alt="TranslatePrompt UI State"
            className="w-full rounded shadow-md"
          />
        </div>

        {/* RIGHT PANEL: LANGGRAPH VISUAL - Source changes dynamically */}
        <div className="border p-2 rounded-md bg-white dark:bg-gray-800">
          <img
            src={activeStep.graphImage}
            alt="LangGraph Agent State"
            className="w-full rounded shadow-md"
          />
        </div>
      </div>

      {/* BOTTOM PANEL: EXPLANATION & CONTROLS - (Largely unchanged) */}
      <div className="mt-8 text-center bg-white dark:bg-gray-800 p-6 rounded-lg shadow-inner">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          {activeStep.title}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-6 h-16 sm:h-12">
          {activeStep.description}
        </p>

        <div className="flex justify-center items-center space-x-4">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="px-6 py-2 font-semibold text-gray-700 bg-gray-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            Previous
          </button>

          <div className="flex space-x-2">
            {steps.map((step, index) => (
              <div
                key={step.step}
                className={`w-3 h-3 rounded-full transition-all ${
                  currentStep === index
                    ? "bg-blue-500 scale-125"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
              ></div>
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={currentStep === steps.length - 1}
            className="px-6 py-2 font-semibold text-white bg-blue-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
