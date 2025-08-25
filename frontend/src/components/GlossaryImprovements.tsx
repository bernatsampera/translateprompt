import {useState, useEffect} from "react";
import {
  getGlossaryImprovements,
  applyGlossaryUpdate,
  getGlossaryEntries,
  type ToolCall,
  type GlossaryEntry
} from "@/services/translateApi";

interface GlossaryImprovementsProps {
  conversationIdRef: React.RefObject<string | null>;
  response: string | null;
}

function GlossaryImprovements({
  conversationIdRef,
  response
}: GlossaryImprovementsProps) {
  const [improvements, setImprovements] = useState<ToolCall[]>([]);
  const [glossaryEntries, setGlossaryEntries] = useState<GlossaryEntry[]>([]);
  const [applyingUpdates, setApplyingUpdates] = useState<Set<string>>(
    new Set()
  );
  console.log("improvements", improvements);

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
      setImprovements((prev) =>
        prev.filter(
          (imp) =>
            !(
              imp.args.source === improvement.args.source &&
              imp.args.target === improvement.args.target
            )
        )
      );

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

  useEffect(() => {
    if (!response) return;

    // Check for improvements every 5 seconds
    const checkImprovements = () => {
      getGlossaryImprovements(conversationIdRef.current ?? "")
        .then((response) => {
          setImprovements(response);
        })
        .catch(console.error);
    };

    // Check immediately
    checkImprovements();

    // Then check every 5 seconds
    // const interval = setInterval(checkImprovements, 5000);

    // return () => clearInterval(interval);
  }, [response]);

  if (!conversationIdRef.current) {
    return <div className="p-4">No active conversation</div>;
  }

  return (
    <div className="p-4 space-y-6">
      {/* Suggested Improvements Section */}
      <div>
        <h3 className="font-semibold mb-4">Suggested Glossary Updates</h3>
        {improvements.length === 0 ? (
          <p className="text-gray-500">
            {status === "processing" ? "Analyzing..." : "No suggestions found"}
          </p>
        ) : (
          <div className="space-y-2">
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
        <h3 className="font-semibold mb-4">Current Glossary Entries</h3>
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
