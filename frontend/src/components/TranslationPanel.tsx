import RefinePanel from "./translation/RefinePanel";
import SourcePanel from "./translation/SourcePanel";
import TargetPanel from "./translation/TargetPanel";

interface TranslationPanelProps {
  // Source panel props
  sourceLanguage: string;
  onSourceLanguageChange: (language: string) => void;
  textToTranslate: string;
  onTextToTranslateChange: (text: string) => void;
  onTranslate: (text: string) => void;
  isTranslating: boolean;

  // Target panel props
  targetLanguage: string;
  onTargetLanguageChange: (language: string) => void;
  translation: string | null;
  onCopyToClipboard: () => void;
  isCopying: boolean;

  // Refine panel props
  textToRefine: string;
  onTextToRefineChange: (text: string) => void;
  onRefine: (text: string) => void;
}

function TranslationPanel({
  sourceLanguage,
  onSourceLanguageChange,
  textToTranslate,
  onTextToTranslateChange,
  onTranslate,
  isTranslating,
  targetLanguage,
  onTargetLanguageChange,
  translation,
  onCopyToClipboard,
  isCopying,
  textToRefine,
  onTextToRefineChange,
  onRefine
}: TranslationPanelProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-4 lg:mb-6">
      <SourcePanel
        sourceLanguage={sourceLanguage}
        onSourceLanguageChange={onSourceLanguageChange}
        textToTranslate={textToTranslate}
        onTextToTranslateChange={onTextToTranslateChange}
        onTranslate={onTranslate}
        isTranslating={isTranslating}
        targetLanguage={targetLanguage}
      />

      <div className="space-y-3">
        <TargetPanel
          targetLanguage={targetLanguage}
          onTargetLanguageChange={onTargetLanguageChange}
          translation={translation}
          isTranslating={isTranslating}
          onCopyToClipboard={onCopyToClipboard}
          isCopying={isCopying}
        />

        <RefinePanel
          textToRefine={textToRefine}
          onTextToRefineChange={onTextToRefineChange}
          onRefine={onRefine}
        />
      </div>
    </div>
  );
}

export default TranslationPanel;
