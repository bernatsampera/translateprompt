import {applyGlossaryUpdate, type GlossaryEntry} from "@/api/glossaryApi";
import type {ImprovementEntry} from "@/api/graphApi";
import {addRule, type RulesEntry} from "@/api/rulesApi";

interface ImprovementSuggestionsProps {
  improvements: ImprovementEntry[];
  conversationId: string;
  onImprovementApplied: () => void;
  sourceLanguage: string;
  targetLanguage: string;
}

export function ImprovementSuggestions({
  improvements,
  conversationId,
  onImprovementApplied,
  sourceLanguage,
  targetLanguage
}: ImprovementSuggestionsProps) {
  // Apply a glossary update
  const handleApplyGlossaryUpdate = async (improvement: GlossaryEntry) => {
    try {
      await applyGlossaryUpdate(
        improvement.source,
        improvement.target,
        improvement.note,
        conversationId
      );

      // Notify parent component that an improvement was applied
      onImprovementApplied();
    } catch (error) {
      console.error("Failed to apply glossary update:", error);
    }
  };

  // Apply a rule update
  const handleApplyRuleUpdate = async (improvement: RulesEntry) => {
    try {
      await addRule(improvement.text, sourceLanguage, targetLanguage);

      // Notify parent component that an improvement was applied
      onImprovementApplied();
    } catch (error) {
      console.error("Failed to apply rule update:", error);
    }
  };

  if (improvements.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-medium text-base-content">
          Suggested Updates
        </h3>
        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
          {improvements.length}
        </span>
      </div>

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
                      handleApplyGlossaryUpdate(improvement as GlossaryEntry)
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
                      handleApplyRuleUpdate(improvement as RulesEntry)
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
