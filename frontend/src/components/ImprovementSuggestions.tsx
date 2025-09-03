import type {ImprovementEntry} from "@/api/graphApi";
import {applyImprovement} from "@/api/graphApi";

interface ImprovementSuggestionsProps {
  improvements: ImprovementEntry[];
  conversationId: string;
  onImprovementApplied: () => void;
}

export function ImprovementSuggestions({
  improvements,
  conversationId,
  onImprovementApplied
}: ImprovementSuggestionsProps) {
  // Apply a glossary update
  const handleApplyImprovement = async (improvement: ImprovementEntry) => {
    console.log("Applying improvement:", improvement);
    try {
      await applyImprovement(improvement, conversationId);

      // Notify parent component that an improvement was applied
      onImprovementApplied();
    } catch (error) {
      console.error("Failed to apply glossary update:", error);
    }
  };

  if (improvements.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {improvements.map((improvement, index) => (
          <div
            key={index}
            className="bg-base-200 border border-base-300 rounded-lg overflow-hidden"
          >
            <div className="p-4">
              {improvement.type === "glossary" ? (
                // Glossary Entry Improvement
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-base-content/50 uppercase tracking-wider font-medium mb-1">
                      Glossary Entry
                    </div>
                    <div className="font-medium text-base-content text-sm">
                      "{improvement.source}"
                    </div>
                    <div className="text-xs text-base-content/70 mt-1">
                      → {improvement.target}
                    </div>
                    {improvement.note && (
                      <div className="text-xs text-base-content/60 mt-1">
                        {improvement.note}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() =>
                      handleApplyImprovement(improvement as ImprovementEntry)
                    }
                    className="btn btn-primary btn-xs"
                  >
                    Apply
                  </button>
                </div>
              ) : (
                // Rules Entry Improvement
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-base-content/50 uppercase tracking-wider font-medium mb-1">
                      Translation Rule
                    </div>
                    <div className="text-sm text-base-content">
                      {improvement.text}
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      handleApplyImprovement(improvement as ImprovementEntry)
                    }
                    className="btn btn-primary btn-xs"
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
