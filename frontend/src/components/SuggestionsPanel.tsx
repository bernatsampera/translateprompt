import type {ImprovementEntry} from "@/api/graphApi";
import {ChevronRight, Lightbulb} from "lucide-react";
import {useState} from "react";
import {ImprovementSuggestions} from "./ImprovementSuggestions";

interface SuggestionsPanelProps {
  improvements: ImprovementEntry[];
  conversationId: string;
  loadImprovements: () => void;
  sourceLanguage: string;
  targetLanguage: string;
}

export function SuggestionsPanel({
  improvements,
  conversationId,
  loadImprovements,
  sourceLanguage,
  targetLanguage
}: SuggestionsPanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    // Default to collapsed on mobile, expanded on desktop when there are suggestions
    if (typeof window !== "undefined") {
      return window.innerWidth < 1024 || improvements.length === 0;
    }
    return improvements.length === 0;
  });

  // Auto-expand when suggestions arrive
  if (
    improvements.length > 0 &&
    isCollapsed &&
    typeof window !== "undefined" &&
    window.innerWidth >= 1024
  ) {
    setIsCollapsed(false);
  }

  const handleImprovementApplied = () => {
    loadImprovements();
  };

  // Don't render anything if no improvements and collapsed
  if (improvements.length === 0 && isCollapsed) {
    return null;
  }

  if (isCollapsed) {
    return (
      <div className="hidden lg:flex h-full items-center">
        <button
          onClick={() => setIsCollapsed(false)}
          className="btn btn-ghost btn-sm p-2 h-auto border-l border-base-300 rounded-none"
          title="Show suggestions"
        >
          <div className="flex flex-col items-center gap-1">
            <Lightbulb className="h-4 w-4" />
            {improvements.length > 0 && (
              <span className="text-xs bg-primary text-primary-content rounded-full px-1.5 py-0.5 min-w-[18px] h-[18px] flex items-center justify-center">
                {improvements.length}
              </span>
            )}
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="h-full bg-base-100 border-l border-base-300 flex flex-col w-80">
      {/* Header */}
      <div className="p-3 border-b border-base-300 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-base-content/70" />
          <h2 className="text-sm font-medium text-base-content">Suggestions</h2>
          {improvements.length > 0 && (
            <span className="text-xs bg-base-200 text-base-content/70 rounded-full px-2 py-0.5">
              {improvements.length}
            </span>
          )}
        </div>
        <button
          onClick={() => setIsCollapsed(true)}
          className="btn btn-ghost btn-xs p-1"
          title="Hide suggestions"
        >
          <ChevronRight className="h-3 w-3" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3">
        {improvements.length === 0 ? (
          <div className="text-center py-8">
            <Lightbulb className="h-8 w-8 mx-auto mb-3 text-base-content/30" />
            <p className="text-sm text-base-content/60">
              Suggestions will appear here after refining a translation
            </p>
          </div>
        ) : (
          <ImprovementSuggestions
            improvements={improvements}
            conversationId={conversationId}
            onImprovementApplied={handleImprovementApplied}
            sourceLanguage={sourceLanguage}
            targetLanguage={targetLanguage}
          />
        )}
      </div>
    </div>
  );
}
