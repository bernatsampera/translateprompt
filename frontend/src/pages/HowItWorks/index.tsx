import {useState} from "react";
import {twMerge} from "tailwind-merge";
import {steps, type Highlight} from "./steps";

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
  const activeStep = steps[currentStep];

  return (
    <div className="mx-auto p-1 sm:p-8 rounded-lg shadow-xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <ImageWithHighlights
          image={activeStep.uiImage}
          highlights={activeStep.highlights?.ui as Highlight[]}
          alt="UI State"
        />
        <ImageWithHighlights
          image={activeStep.graphImage}
          highlights={activeStep.highlights?.graph as Highlight[] | null}
          alt="Graph State"
        />
      </div>

      <div className="mt-8 text-center bg-white dark:bg-gray-800 p-6 rounded-lg shadow-inner">
        <div className="mb-4">
          <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
            Step {activeStep.step + 1} of {steps.length}
          </span>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          {activeStep.title}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-6 text-lg leading-relaxed">
          {activeStep.description}
        </p>

        <div className="flex flex-col items-center space-y-4">
          <div className="flex space-x-2">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-4 h-4 rounded-full transition-all ${
                  currentStep === index
                    ? "bg-blue-500 scale-125"
                    : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                }`}
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div>

          <div className="flex justify-center items-center space-x-4">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="px-6 py-2 font-semibold text-gray-700 bg-gray-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              ← Previous
            </button>

            <button
              onClick={() =>
                setCurrentStep(Math.min(steps.length - 1, currentStep + 1))
              }
              disabled={currentStep === steps.length - 1}
              className="px-6 py-2 font-semibold text-white bg-blue-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
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
    <div className="relative w-full aspect-[16/9] border p-2 rounded-md bg-white dark:bg-gray-800">
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
              <div className="flex items-center bg-white dark:bg-gray-900 text-black dark:text-white px-2 py-0.5 md:px-3 md:py-1 rounded-md shadow-lg text-nowrap text-[6px] sm:text-xs md:text-sm ">
                {highlight.icon}
                <span>{highlight.text}</span>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}
