import {
  getGlossaryImprovements,
  refineTranslation,
  startTranslation,
  type GlossaryEntry
} from "@/api/translateApi";
import GlossaryImprovements from "@/components/GlossaryImprovements";
import TranslationPanel from "@/components/TranslationPanel";
import React, {useCallback, useState} from "react";

function TranslateGraph({
  conversationIdRef
}: {
  conversationIdRef: React.RefObject<string | null>;
}) {
  const [improvements, setImprovements] = useState<GlossaryEntry[]>([]);
  const [textToTranslate, setTextToTranslate] = useState(
    "Dos cervezas, por favor"
  );
  const [translation, setTranslation] = useState<string | null>(
    "Two pints, please"
  );
  const [textToRefine, setTextToRefine] = useState("");
  const [sourceLanguage, setSourceLanguage] = useState("es");
  const [targetLanguage, setTargetLanguage] = useState("en");
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

    setTranslation(response.response);
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

      setTranslation(response.response);

      if (response.conversation_id) {
        conversationIdRef.current = response.conversation_id;
      }
    } catch (error) {
      console.error("Translation error:", error);
      setTranslation("Error: Translation failed. Please try again.");
    } finally {
      setIsTranslating(false);
    }
  };

  const handleCopyToClipboard = async () => {
    if (!translation) return;

    setIsCopying(true);
    try {
      await navigator.clipboard.writeText(translation);
      // You could add a toast notification here
    } catch (err) {
      console.error("Failed to copy text: ", err);
    } finally {
      setIsCopying(false);
    }
  };

  return (
    <div className="flex h-full">
      <div className="flex-1 mx-auto max-w-6xl p-2 lg:p-4">
        <TranslationPanel
          sourceLanguage={sourceLanguage}
          onSourceLanguageChange={setSourceLanguage}
          textToTranslate={textToTranslate}
          onTextToTranslateChange={setTextToTranslate}
          onTranslate={handleStartTranslation}
          isTranslating={isTranslating}
          targetLanguage={targetLanguage}
          onTargetLanguageChange={setTargetLanguage}
          translation={translation}
          onCopyToClipboard={handleCopyToClipboard}
          isCopying={isCopying}
          textToRefine={textToRefine}
          onTextToRefineChange={setTextToRefine}
          onRefine={handleRefineTranslation}
        />
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
