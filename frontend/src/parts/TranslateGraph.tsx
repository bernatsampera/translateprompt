import GlossaryImprovements from "@/components/GlossaryImprovements";
import {
  getGlossaryImprovements,
  refineTranslation,
  startTranslation,
  type GlossaryEntry
} from "@/services/translateApi";
import {ArrowRightLeft, Copy, RotateCcw} from "lucide-react";
import React, {useCallback, useState} from "react";

function TranslateGraph({
  conversationIdRef
}: {
  conversationIdRef: React.RefObject<string | null>;
}) {
  const [response, setResponse] = useState<string | null>(null);
  const [improvements, setImprovements] = useState<GlossaryEntry[]>([]);
  const [textToTranslate, setTextToTranslate] = useState(
    "Birds look at the sky and smile"
  );
  const [textToRefine, setTextToRefine] = useState("");

  const handleRefineTranslation = async (text: string) => {
    if (!conversationIdRef.current) {
      alert("Please start a new conversation first");
      return;
    }

    const response = await refineTranslation(
      textToRefine,
      conversationIdRef.current
    );

    setResponse(response.response);
    checkImprovements();
  };

  const checkImprovements = useCallback(() => {
    getGlossaryImprovements(conversationIdRef.current ?? "").then(
      (improvements) => {
        setImprovements(improvements);
      }
    );
  }, [conversationIdRef]);

  const handleStartTranslation = async (text: string) => {
    console.log("start translation", text);
    const response = await startTranslation(text);

    setResponse(response.response);

    if (response.conversation_id) {
      conversationIdRef.current = response.conversation_id;
    }
  };

  return (
    <div className="flex h-screen">
      <div className="flex-1 mx-auto max-w-6xl p-4">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-primary">Text Translation</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Original</h2>
              <select className="select select-bordered select-sm">
                <option>Auto-detect</option>
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
              </select>
            </div>
            <div className="form-control">
              <textarea
                className="textarea textarea-bordered w-full min-h-48 resize-none focus:textarea-primary"
                placeholder="Enter text to translate..."
                value={textToTranslate}
                onChange={(e) => setTextToTranslate(e.target.value)}
              ></textarea>
            </div>
            <button
              className="btn btn-primary w-full"
              onClick={() => handleStartTranslation(textToTranslate)}
            >
              <ArrowRightLeft className="h-4 w-4" />
              Translate
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Translation</h2>
              <div className="flex items-center gap-2">
                <select className="select select-bordered select-sm">
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                </select>
                <button
                  className="btn btn-ghost btn-sm"
                  title="Copy to clipboard"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="form-control">
              <textarea
                className="textarea textarea-bordered textarea w-full min-h-48 resize-none bg-base-200/50"
                placeholder="Translation will appear here..."
                value={response || ""}
                readOnly
              ></textarea>
            </div>

            {/* {response && ( */}
            <div className="bg-base-200/30 rounded-lg p-1">
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <h3 className="text-sm font-semibold">Refine</h3>
                </div>
                <div className="form-control">
                  <textarea
                    className="textarea textarea-bordered w-full h-16 resize-none"
                    placeholder="Suggest improvements..."
                    value={textToRefine}
                    onChange={(e) => setTextToRefine(e.target.value)}
                  ></textarea>
                </div>
                <div className="flex gap-2">
                  <button
                    className="btn btn-accent flex-1"
                    onClick={() => handleRefineTranslation(textToRefine)}
                    disabled={!textToRefine}
                  >
                    <RotateCcw className="h-4 w-4" />
                    Refine
                  </button>
                </div>
              </div>
            </div>
            {/* )} */}
          </div>
        </div>
      </div>
      <div className="w-80 border-l">
        {response && (
          <GlossaryImprovements
            improvements={improvements}
            conversationId={conversationIdRef.current ?? ""}
            loadImprovements={checkImprovements}
          />
        )}
      </div>
    </div>
  );
}

export default TranslateGraph;
