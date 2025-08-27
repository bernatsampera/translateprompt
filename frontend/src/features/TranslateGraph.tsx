import {getGlossaryImprovements, type GlossaryEntry} from "@/api/translateApi";
import GlossaryImprovements from "@/components/GlossaryImprovements";
import {LanguageInput} from "@/components/LanguageInput";
import TranslationPanel from "@/components/TranslationPanel";
import {
  useClipboard,
  useLanguageSelection,
  useTextInput,
  useTranslation
} from "@/hooks";
import React, {useCallback, useState} from "react";

function TranslateGraph({
  conversationIdRef
}: {
  conversationIdRef: React.RefObject<string | null>;
}) {
  const [improvements, setImprovements] = useState<GlossaryEntry[]>([]);

  // Use custom hooks for state management
  const {text: textToTranslate, handleTextChange: handleTextToTranslateChange} =
    useTextInput();
  const {text: textToRefine, handleTextChange: setTextToRefine} =
    useTextInput("");

  const {
    sourceLanguage,
    targetLanguage,
    isAutoDetectionEnabled,
    handleSourceLanguageChange,
    handleTargetLanguageChange,
    handleLanguageDetected,
    toggleAutoDetection: setIsAutoDetectionEnabled
  } = useLanguageSelection();

  const {isCopying, copyToClipboard} = useClipboard();

  const {translation, isTranslating, translate, refine} = useTranslation({
    onTranslationComplete: (response) => {
      checkImprovements();
      if (response.conversation_id) {
        conversationIdRef.current = response.conversation_id;
      }
    }
  });

  const checkImprovements = useCallback(() => {
    getGlossaryImprovements(conversationIdRef.current ?? "").then(
      (improvements) => {
        setImprovements(improvements);
      }
    );
  }, [conversationIdRef]);

  const handleStartTranslation = async (text: string) => {
    await translate(text, sourceLanguage, targetLanguage);
  };

  const handleRefineTranslation = async () => {
    if (!conversationIdRef.current) {
      alert("Please start a new conversation first");
      return;
    }

    await refine(textToRefine, sourceLanguage, targetLanguage);
    checkImprovements();
  };

  const handleCopyToClipboard = async () => {
    if (translation) {
      await copyToClipboard(translation);
    }
  };

  return (
    <div className="flex h-full">
      <div className="flex-1 mx-auto max-w-6xl p-2 lg:p-4">
        <LanguageInput
          text={textToTranslate}
          onLanguageDetected={handleLanguageDetected}
          isAutoDetectionEnabled={isAutoDetectionEnabled}
          onAutoDetectionToggle={setIsAutoDetectionEnabled}
        />
        <TranslationPanel
          sourceLanguage={sourceLanguage}
          onSourceLanguageChange={handleSourceLanguageChange}
          textToTranslate={textToTranslate}
          onTextToTranslateChange={handleTextToTranslateChange}
          onTranslate={handleStartTranslation}
          isTranslating={isTranslating}
          targetLanguage={targetLanguage}
          onTargetLanguageChange={handleTargetLanguageChange}
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
