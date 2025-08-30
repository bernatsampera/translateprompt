import {ArrowDown, ArrowRight, BookOpen, Bot, User} from "lucide-react";

interface StepCardProps {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  content: React.ReactNode;
  maxWidth?: string;
}

function StepCard({
  icon,
  iconBg,
  title,
  content,
  maxWidth = "max-w-xs"
}: StepCardProps) {
  return (
    <div className={`text-center mx-auto lg:mx-0 ${maxWidth} w-full`}>
      <div
        className={`w-16 h-16 ${iconBg} rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6`}
      >
        {icon}
      </div>
      <div className="space-y-4">
        <div className="mb-3">
          <p className="text-xs text-gray-400 uppercase tracking-wide px-2">
            {title}
          </p>
        </div>
        {content}
      </div>
    </div>
  );
}

function StepArrow() {
  return (
    <div className="flex justify-center lg:block">
      <ArrowDown className="w-6 h-6 text-gray-300 lg:hidden" />
      <ArrowRight className="w-6 h-6 text-gray-300 hidden lg:block" />
    </div>
  );
}

export default function SystemExplanation() {
  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8">
      {/* <div className="text-center mb-8 md:mb-16">
        <h2 className="text-2xl md:text-4xl font-light text-gray-900 mb-4">
          Translation That Learns
        </h2>
        <p className="text-gray-500 text-lg md:text-xl font-light max-w-2xl mx-auto px-4">
          AI learns from your corrections to deliver perfect translations
        </p>
      </div> */}

      <div className="relative">
        {/* Flow Line - only visible on desktop */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-200 -translate-y-1/2 z-0 hidden lg:block"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-8">
          {/* Step 1: User Intent & Input */}
          <StepCard
            icon={<User className="w-8 h-8 text-white" />}
            iconBg="bg-gray-900"
            title="Translate from spanish to english"
            content={
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-900 font-medium">
                  "dos cervezas por favor"
                </p>
              </div>
            }
          />

          <StepArrow />

          {/* Step 2: AI's First Attempt */}
          <StepCard
            icon={<Bot className="w-8 h-8 text-white" />}
            iconBg="bg-gray-400"
            title="AI Translates"
            content={
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-900">"two beers please"</p>
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <span className="text-gray-500 text-sm">
                    Incorrect (user prefers pint instead of beer)
                  </span>
                </div>
              </div>
            }
          />

          <StepArrow />

          {/* Step 3: User Teaches */}
          <StepCard
            icon={<User className="w-8 h-8 text-white" />}
            iconBg="bg-gray-900"
            title="Corrects translation"
            content={
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-900">"Use pint instead of beer"</p>
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <span className="text-gray-500 text-sm">Correction</span>
                </div>
              </div>
            }
          />

          <StepArrow />

          {/* Step 4: AI Learns & Delivers */}
          <StepCard
            icon={<Bot className="w-8 h-8 text-white" />}
            iconBg="bg-gray-400"
            title="Translates and suggest Glossary Entry"
            content={
              <div className="space-y-3">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Bot className="w-4 h-4 text-gray-600" />
                    <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                      Translates
                    </span>
                  </div>
                  <p className="text-gray-900">"two pints, please"</p>
                </div>

                <div className="bg-gray-100 rounded-lg p-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <BookOpen className="w-4 h-4 text-gray-600" />
                    <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                      Suggest Glossary Entry
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm">cerveza → pint</p>
                </div>
              </div>
            }
            maxWidth="max-w-sm"
          />
        </div>
      </div>

      <div className="mt-12 md:mt-20 text-center">
        <p className="text-gray-500 text-base md:text-lg font-light max-w-2xl mx-auto px-4">
          Next time, AI will translate "cerveza" as "pint"
        </p>
      </div>
    </div>
  );
}
