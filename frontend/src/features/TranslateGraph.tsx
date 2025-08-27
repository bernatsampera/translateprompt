import {
  getGlossaryImprovements,
  refineTranslation,
  startTranslation,
  type GlossaryEntry
} from "@/api/translateApi";
import GlossaryImprovements from "@/components/GlossaryImprovements";
import {ArrowRightLeft, Copy, RotateCcw} from "lucide-react";
import React, {useCallback, useState} from "react";

// Language options for the selectors
const LANGUAGE_OPTIONS = [
  {value: "auto", label: "Auto-detect"},
  {value: "en", label: "English"},
  {value: "es", label: "Spanish"},
  {value: "fr", label: "French"},
  {value: "de", label: "German"},
  {value: "it", label: "Italian"},
  {value: "pt", label: "Portuguese"},
  {value: "ru", label: "Russian"},
  {value: "ja", label: "Japanese"},
  {value: "ko", label: "Korean"},
  {value: "zh", label: "Chinese"}
];

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
  const [sourceLanguage, setSourceLanguage] = useState("en");
  const [targetLanguage, setTargetLanguage] = useState("es");
  const [isCopying, setIsCopying] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);

  const handleRefineTranslation = async (text: string) => {
    if (!conversationIdRef.current) {
      alert("Please start a new conversation first");
      return;
    }

    const response = await refineTranslation(
      textToRefine,
      conversationIdRef.current,
      sourceLanguage,
      targetLanguage
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
    if (!text.trim()) return;

    setIsTranslating(true);
    try {
      console.log(
        "start translation",
        text,
        "from",
        sourceLanguage,
        "to",
        targetLanguage
      );
      const response = await startTranslation(
        text,
        sourceLanguage,
        targetLanguage
      );

      setResponse(response.response);

      if (response.conversation_id) {
        conversationIdRef.current = response.conversation_id;
      }
    } catch (error) {
      console.error("Translation error:", error);
      setResponse("Error: Translation failed. Please try again.");
    } finally {
      setIsTranslating(false);
    }
  };

  const handleCopyToClipboard = async () => {
    if (!response) return;

    setIsCopying(true);
    try {
      await navigator.clipboard.writeText(response);
      // You could add a toast notification here
    } catch (err) {
      console.error("Failed to copy text: ", err);
    } finally {
      setIsCopying(false);
    }
  };

  const getLanguageLabel = (value: string) => {
    return (
      LANGUAGE_OPTIONS.find((option) => option.value === value)?.label || value
    );
  };

  const getTranslationButtonText = () => {
    if (sourceLanguage === "auto") {
      return `Translate to ${getLanguageLabel(targetLanguage)}`;
    }
    return `Translate (${getLanguageLabel(sourceLanguage)} → ${getLanguageLabel(
      targetLanguage
    )})`;
  };

  return (
    <div className="flex h-full">
      <div className="flex-1 mx-auto max-w-6xl p-2 lg:p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-4 lg:mb-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base lg:text-lg font-semibold">Original</h2>
              <select
                className="select select-bordered select-sm text-xs lg:text-sm"
                value={sourceLanguage}
                onChange={(e) => setSourceLanguage(e.target.value)}
              >
                {LANGUAGE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-control">
              <textarea
                className="textarea textarea-bordered w-full min-h-32 lg:min-h-48 resize-none focus:textarea-primary text-sm lg:text-base"
                placeholder="Enter text to translate..."
                value={textToTranslate}
                onChange={(e) => setTextToTranslate(e.target.value)}
              ></textarea>
            </div>
            <button
              className="btn btn-primary w-full text-sm lg:text-base"
              onClick={() => handleStartTranslation(textToTranslate)}
              disabled={!textToTranslate.trim() || isTranslating}
            >
              <ArrowRightLeft className="h-4 w-4" />
              {isTranslating ? "Translating..." : getTranslationButtonText()}
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base lg:text-lg font-semibold">
                Translation
              </h2>
              <div className="flex items-center gap-2">
                <select
                  className="select select-bordered select-sm text-xs lg:text-sm"
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e.target.value)}
                >
                  {LANGUAGE_OPTIONS.filter(
                    (option) => option.value !== "auto"
                  ).map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <button
                  className="btn btn-ghost btn-sm"
                  title="Copy to clipboard"
                  onClick={handleCopyToClipboard}
                  disabled={!response || isCopying}
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="form-control">
              <textarea
                className="textarea textarea-bordered textarea w-full min-h-32 lg:min-h-48 resize-none bg-base-200/50 text-sm lg:text-base"
                placeholder="Translation will appear here..."
                value={response || ""}
                readOnly
              ></textarea>
            </div>

            <div className="bg-base-200/30 rounded-lg p-1">
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <h3 className="text-sm font-semibold">Refine</h3>
                </div>
                <div className="form-control">
                  <textarea
                    className="textarea textarea-bordered w-full h-16 resize-none text-sm lg:text-base"
                    placeholder="Suggest improvements..."
                    value={textToRefine}
                    onChange={(e) => setTextToRefine(e.target.value)}
                  ></textarea>
                </div>
                <div className="flex gap-2">
                  <button
                    className="btn btn-accent flex-1 text-sm lg:text-base"
                    onClick={() => handleRefineTranslation(textToRefine)}
                    disabled={!textToRefine}
                  >
                    <RotateCcw className="h-4 w-4" />
                    Refine
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <GlossaryImprovements
        improvements={improvements}
        conversationId={conversationIdRef.current ?? ""}
        loadImprovements={checkImprovements}
        sourceLanguage={sourceLanguage}
        targetLanguage={targetLanguage}
      />
    </div>
  );
}

export default TranslateGraph;
