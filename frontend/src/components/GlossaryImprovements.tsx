import {
  applyGlossaryUpdate,
  getGlossaryEntries,
  type GlossaryEntry
} from "@/services/translateApi";
import {useEffect, useState} from "react";

interface GlossaryImprovementsProps {
  improvements: GlossaryEntry[];
  conversationId: string;
  loadImprovements: () => void;
}

function GlossaryImprovements({
  improvements,
  conversationId,
  loadImprovements
}: GlossaryImprovementsProps) {
  const [glossaryEntries, setGlossaryEntries] = useState<GlossaryEntry[]>([]);

  // Load glossary entries
  const loadGlossaryEntries = () => {
    getGlossaryEntries()
      .then((response) => {
        setGlossaryEntries(response.entries);
      })
      .catch(console.error);
  };

  // Apply a glossary update
  const handleApplyUpdate = async (improvement: GlossaryEntry) => {
    try {
      await applyGlossaryUpdate(
        improvement.source,
        improvement.target,
        improvement.note,
        conversationId
      );

      // Refresh glossary entries
      loadGlossaryEntries();
      loadImprovements();
    } catch (error) {
      console.error("Failed to apply update:", error);
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
              return (
                <div key={index} className="border p-3 rounded bg-blue-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-medium">"{improvement.source}"</div>
                      <div className="text-sm text-gray-600">
                        {improvement.target
                          ? `${improvement.target} → ${improvement.target}`
                          : `→ ${improvement.target}`}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {improvement.note}
                      </div>
                    </div>
                    <button
                      onClick={() => handleApplyUpdate(improvement)}
                      className={`px-3 py-1 text-xs rounded ${"bg-blue-600 text-white hover:bg-blue-700"}`}
                    >
                      Apply
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
