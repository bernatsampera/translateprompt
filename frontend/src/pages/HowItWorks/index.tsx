import {useState} from "react";
import {twMerge} from "tailwind-merge";
import {stepData, stepTextContent, type Highlight} from "./steps";
import {StepTextContentComponent} from "./StepTextContent";

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
  const activeStepData = stepData[currentStep];
  const activeStepTextContent = stepTextContent[currentStep];

  return (
    <div className="min-h-screen bg-base-100">
      <div className="mx-auto p-1 sm:p-8">
        {/* Step Indicator */}
        <div className="mb-6 flex justify-center">
          <div className="inline-block bg-primary/10 text-primary text-sm font-medium px-4 py-2 rounded-full">
            Step {activeStepData.step + 1} of {stepData.length}
          </div>
        </div>
        <h2 className="text-3xl font-bold text-base-content mb-6">
          {activeStepData.title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <ImageWithHighlights
            image={activeStepData.uiImage}
            highlights={activeStepData.highlights?.ui as Highlight[]}
            alt="UI State"
          />
          <ImageWithHighlights
            image={activeStepData.graphImage}
            highlights={activeStepData.highlights?.graph as Highlight[] | null}
            alt="Graph State"
          />
        </div>

        {/* Text content component */}
        <StepTextContentComponent content={activeStepTextContent} />

        {/* Navigation Buttons - Bottom of page */}
        <div className="mt-12 flex flex-col items-center gap-6">
          {/* Step Dots */}
          <div className="flex space-x-3">
            {stepData.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-4 h-4 rounded-full transition-all ${
                  currentStep === index
                    ? "bg-primary scale-125"
                    : "bg-base-300 hover:bg-base-content/20"
                }`}
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div>

          {/* Previous/Next Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="btn btn-outline btn"
            >
              ← Previous
            </button>

            <button
              onClick={() =>
                setCurrentStep(Math.min(stepData.length - 1, currentStep + 1))
              }
              disabled={currentStep === stepData.length - 1}
              className="btn btn-primary btn"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// No changes needed to the Highlight type or data structure.

function ImageWithHighlights({
  image,
  highlights,
  alt
}: {
  image: string;
  highlights: Highlight[] | null;
  alt: string;
}) {
  const getTextPositionClass = (position: Highlight["textPosition"]) => {
    switch (position) {
      case "top":
        // Positions text above the highlight box
        return "absolute bottom-full left-1/2 -translate-x-1/2 mb-2";
      case "bottom":
        // Positions text below the highlight box
        return "absolute top-full left-1/2 -translate-x-1/2 mt-2";
      default:
        // 'inside' is the default, centered within the box
        return "relative w-full h-full flex items-center justify-center";
    }
  };
  return (
    // 1. This is now the main container. It's relative and has a fixed aspect ratio.
    // Replace 'aspect-[16/9]' with your image's actual aspect ratio.
    // Common ones: aspect-video (16:9), aspect-square (1:1), or custom aspect-[4/3].
    <div className="relative w-full aspect-[16/9] border border-base-300 p-2 rounded-md bg-base-100">
      {/* 2. The image is now positioned absolutely to fill its parent container. */}
      <img
        src={image}
        alt={alt}
        className="absolute inset-0 w-full h-full object-contain rounded shadow-md"
      />

      {/* 3. The highlights work perfectly because their parent maintains its aspect ratio! */}
      {highlights &&
        highlights.map((highlight) => (
          <div
            key={highlight.key}
            className={twMerge(
              "absolute rounded-lg  transition-all duration-300 pointer-events-none",
              highlight.className
            )}
            style={{
              top: highlight.position.top,
              left: highlight.position.left,

              width: highlight.position.width,
              height: highlight.position.height
            }}
          >
            <div className={getTextPositionClass(highlight.textPosition)}>
              {/* 4. Make the text responsive too, so it doesn't look huge on mobile. */}
              <div className="flex items-center bg-white dark:bg-zinc-800 text-black dark:text-white px-2 py-0.5 md:px-3 md:py-1 rounded-md shadow-lg text-nowrap text-[6px] sm:text-xs md:text-sm ">
                {highlight.icon}
                <span>{highlight.text}</span>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}
