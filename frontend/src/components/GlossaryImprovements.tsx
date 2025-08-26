import {
  applyGlossaryUpdate,
  getGlossaryEntries,
  type GlossaryEntry,
  type ToolCall
} from "@/services/translateApi";
import {useEffect, useState} from "react";

interface GlossaryImprovementsProps {
  improvements: ToolCall[];
}

function GlossaryImprovements({improvements}: GlossaryImprovementsProps) {
  const [glossaryEntries, setGlossaryEntries] = useState<GlossaryEntry[]>([]);
  const [applyingUpdates, setApplyingUpdates] = useState<Set<string>>(
    new Set()
  );

  // Load glossary entries
  const loadGlossaryEntries = () => {
    getGlossaryEntries()
      .then((response) => {
        setGlossaryEntries(response.entries);
      })
      .catch(console.error);
  };

  // Apply a glossary update
  const handleApplyUpdate = async (improvement: ToolCall) => {
    const updateKey = `${improvement.args.source}-${improvement.args.target}`;
    setApplyingUpdates((prev) => new Set(prev).add(updateKey));

    try {
      await applyGlossaryUpdate(
        improvement.args.source,
        improvement.args.target,
        improvement.args.note
      );

      // Remove this improvement from the list
      // improvements = improvements.filter(
      //   (imp) =>
      //     !(
      //       imp.args.source === improvement.args.source &&
      //       imp.args.target === improvement.args.target
      //     )
      // );

      // Refresh glossary entries
      loadGlossaryEntries();
    } catch (error) {
      console.error("Failed to apply update:", error);
    } finally {
      setApplyingUpdates((prev) => {
        const newSet = new Set(prev);
        newSet.delete(updateKey);
        return newSet;
      });
    }
  };

  useEffect(() => {
    // Load glossary entries on mount
    loadGlossaryEntries();
  }, []);

  return (
    <div className="p-4 space-y-6">
      {/* Suggested Improvements Section */}
      <div>
        {improvements.length !== 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold mb-4">Suggested Glossary Updates</h3>

            {improvements.map((improvement, index) => {
              const updateKey = `${improvement.args.source}-${improvement.args.target}`;
              const isApplying = applyingUpdates.has(updateKey);

              return (
                <div key={index} className="border p-3 rounded bg-blue-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-medium">
                        "{improvement.args.source}"
                      </div>
                      <div className="text-sm text-gray-600">
                        {improvement.args.target
                          ? `${improvement.args.target} → ${improvement.args.target}`
                          : `→ ${improvement.args.target}`}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {improvement.args.note}
                      </div>
                    </div>
                    <button
                      onClick={() => handleApplyUpdate(improvement)}
                      disabled={isApplying}
                      className={`px-3 py-1 text-xs rounded ${
                        isApplying
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      {isApplying ? "Applying..." : "Apply"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Current Glossary Entries Section */}
      <div>
        <h3 className="font-semibold mb-4">Glossary Entries</h3>
        {glossaryEntries.length === 0 ? (
          <p className="text-gray-500">No glossary entries found</p>
        ) : (
          <div className="space-y-2">
            {glossaryEntries.map((entry, index) => (
              <div key={index} className="border p-3 rounded bg-gray-50">
                <div className="font-medium">"{entry.source}"</div>
                <div className="text-sm text-gray-600">→ {entry.target}</div>
                {entry.note && (
                  <div className="text-xs text-gray-500 mt-1">{entry.note}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default GlossaryImprovements;
