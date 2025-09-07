import {CodeBlock} from "@/components/CodeBlock";
import {DescriptionRenderer} from "@/components/DescriptionRenderer";
import {Bot, Code, User} from "lucide-react";

export type CodeExample = {
  title: string;
  code: string;
  language: string;
  description?: string;
};

export type StepTextContent = {
  uiDescription: string;
  langgraphDescription: string;
  codeExamples?: CodeExample[];
};

interface StepTextContentProps {
  content: StepTextContent;
}

export function StepTextContentComponent({content}: StepTextContentProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
      {/* UI Description - Left side on big screens */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-base-content flex items-center gap-2">
          <User className="w-5 h-5" />
          Translate Prompt UI
        </h3>
        <div className="bg-base-200 p-4 rounded-lg">
          <DescriptionRenderer description={content.uiDescription} />
        </div>
      </div>

      {/* LangGraph Description - Right side on big screens */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-base-content flex items-center gap-2">
          <Bot className="w-5 h-5" />
          LangGraph Studio
        </h3>
        <div className="bg-base-200 p-4 rounded-lg">
          <DescriptionRenderer description={content.langgraphDescription} />
        </div>

        {/* Code Examples Section - Always shown below LangGraph Studio */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-base-content mb-4 flex items-center gap-2">
            <Code className="w-5 h-5" />
            Code Examples
          </h3>
          {content.codeExamples && content.codeExamples.length > 0 ? (
            <div className="space-y-4">
              {content.codeExamples.map((example, index) => (
                <div key={index} className="space-y-3">
                  <div className="bg-base-200 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-base-content mb-2">
                      {example.title}
                    </h4>
                    {example.description && (
                      <p className="text-base-content/70 mb-4 text-sm">
                        {example.description}
                      </p>
                    )}
                    <CodeBlock
                      code={example.code}
                      language={example.language}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-base-200 p-6 rounded-lg text-center">
              <p className="text-base-content/70">
                No code examples available for this step.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
