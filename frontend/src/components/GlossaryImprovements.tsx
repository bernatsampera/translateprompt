import {useState, useEffect} from "react";
import {
  getGlossaryImprovements,
  type GlossaryImprovement
} from "@/services/translateApi";

interface GlossaryImprovementsProps {
  conversationId: string | null;
}

function GlossaryImprovements({conversationId}: GlossaryImprovementsProps) {
  const [improvements, setImprovements] = useState<GlossaryImprovement[]>([]);
  const [status, setStatus] = useState<string>("idle");

  useEffect(() => {
    if (!conversationId) return;

    // Check for improvements every 5 seconds
    const checkImprovements = () => {
      getGlossaryImprovements(conversationId)
        .then((response) => {
          setStatus(response.status);
          if (response.status === "completed") {
            setImprovements(response.improvements);
          }
        })
        .catch(console.error);
    };

    // Check immediately
    checkImprovements();

    // Then check every 5 seconds
    const interval = setInterval(checkImprovements, 5000);

    return () => clearInterval(interval);
  }, [conversationId]);

  if (!conversationId) {
    return <div className="p-4">No active conversation</div>;
  }

  return (
    <div className="p-4">
      <h3 className="font-semibold mb-4">
        Glossary Improvements
        <span className="text-xs text-gray-500 ml-2">({status})</span>
      </h3>
      {improvements.length === 0 ? (
        <p className="text-gray-500">
          {status === "processing" ? "Analyzing..." : "No improvements found"}
        </p>
      ) : (
        <div className="space-y-2">
          {improvements.map((improvement, index) => (
            <div key={index} className="border p-3 rounded">
              <div className="font-medium">"{improvement.source}"</div>
              <div className="text-sm text-gray-600">
                {improvement.current_target} → {improvement.suggested_target}
              </div>
              <div className="text-xs text-gray-500">{improvement.reason}</div>
              <div className="text-xs text-blue-600">
                {Math.round(improvement.confidence * 100)}% confidence
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default GlossaryImprovements;
