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
    <div className="min-h-screen bg-base-100 relative">
      {/* Floating Navigation */}
      <FloatingNavigation
        currentStep={currentStep}
        totalSteps={stepData.length}
        onStepChange={setCurrentStep}
      />

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

        {/* Call to Action Section */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-base-content mb-4">
            Want to learn more?
          </h3>
          <p className="text-base-content/70 mb-8 max-w-2xl mx-auto">
            Explore the code, follow my journey, and read more about AI and
            development on my blog.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="https://github.com/bernatsampera/translateprompt"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-primary flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              View on GitHub
            </a>

            <a
              href="https://twitter.com/bsampera97"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-primary flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
              </svg>
              Follow on Twitter
            </a>

            <a
              href="https://samperalabs.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-primary flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
              Read the Blog
            </a>
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

// Floating Navigation Component
function FloatingNavigation({
  currentStep,
  totalSteps,
  onStepChange
}: {
  currentStep: number;
  totalSteps: number;
  onStepChange: (step: number) => void;
}) {
  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-base-100/95 backdrop-blur-sm border border-base-300 rounded-2xl shadow-lg p-4 flex items-center gap-4">
        {/* Previous Button */}
        <button
          onClick={() => onStepChange(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className="btn btn-sm btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← Previous
        </button>

        {/* Step Dots */}
        <div className="flex space-x-2">
          {Array.from({length: totalSteps}, (_, index) => (
            <button
              key={index}
              onClick={() => onStepChange(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                currentStep === index
                  ? "bg-primary scale-125"
                  : "bg-base-300 hover:bg-base-content/20"
              }`}
              aria-label={`Go to step ${index + 1}`}
            />
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={() =>
            onStepChange(Math.min(totalSteps - 1, currentStep + 1))
          }
          disabled={currentStep === totalSteps - 1}
          className="btn btn-sm btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
