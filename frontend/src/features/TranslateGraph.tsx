import {getImprovements, type ImprovementEntry} from "@/api/translateApi";
import {LanguageInput} from "@/components/LanguageInput";
import {ManagementHub} from "@/components/ManagementHub";
import {SuggestionsPanel} from "@/components/SuggestionsPanel";
import TranslationPanel from "@/components/TranslationPanel";
import {
  useAuth,
  useClipboard,
  useLanguageSelection,
  useTextInput,
  useTranslation
} from "@/hooks";
import {Settings} from "lucide-react";
import {useCallback, useRef, useState} from "react";
import {toast} from "sonner";

function TranslateGraph() {
  const conversationIdRef = useRef<string | null>(null);

  const [improvements, setImprovements] = useState<ImprovementEntry[]>([]);
  const [isManagementHubOpen, setIsManagementHubOpen] = useState(false);
  const session = useAuth();

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

  const handleOpenManagementHub = () => {
    if (session && session.loggedIn) {
      setIsManagementHubOpen(true);
    } else {
      toast.error("Sign in to have your own glossary and rules!");
    }
  };

  const checkImprovements = useCallback(() => {
    if (!conversationIdRef.current) {
      return;
    }
    getImprovements(conversationIdRef.current ?? "").then((improvements) => {
      setImprovements(improvements);
    });
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
    <div className="w-full h-full flex flex-col">
      {/* Header with Management Button */}
      <div className="bg-base-100 border-b border-base-300 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-base-content">
              Translation Workspace
            </h1>
            {sourceLanguage && targetLanguage && (
              <span className="text-sm text-base-content/70 bg-base-200 px-3 py-1 rounded-full">
                {sourceLanguage} → {targetLanguage}
              </span>
            )}
          </div>
          {sourceLanguage && targetLanguage && (
            <button
              onClick={handleOpenManagementHub}
              className="btn btn-secondary btn-sm gap-2"
            >
              <Settings className="h-4 w-4" />
              Manage
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-auto">
          <div className="mx-auto p-4">
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
        </div>

        {/* Suggestions Panel */}
        <SuggestionsPanel
          improvements={improvements}
          conversationId={conversationIdRef.current ?? ""}
          loadImprovements={checkImprovements}
        />
      </div>

      {/* Management Hub Modal */}
      {sourceLanguage && targetLanguage && (
        <ManagementHub
          sourceLanguage={sourceLanguage}
          targetLanguage={targetLanguage}
          isOpen={isManagementHubOpen}
          onClose={() => setIsManagementHubOpen(false)}
        />
      )}
    </div>
  );
}

export default TranslateGraph;
