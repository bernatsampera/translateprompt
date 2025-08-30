import {ArrowRightLeft} from "lucide-react";
import TranslationPanelBase from "./TranslationPanelBase";

interface SourcePanelProps {
  sourceLanguage: string;
  onSourceLanguageChange: (language: string) => void;
  textToTranslate: string;
  onTextToTranslateChange: (text: string) => void;
  onTranslate: (text: string) => void;
  isTranslating: boolean;
  targetLanguage: string;
}

function SourcePanel({
  sourceLanguage,
  onSourceLanguageChange,
  textToTranslate,
  onTextToTranslateChange,
  onTranslate,
  isTranslating,
  targetLanguage
}: SourcePanelProps) {
  return (
    <TranslationPanelBase
      title="Original"
      languageLabel="From"
      languageValue={sourceLanguage}
      onLanguageChange={onSourceLanguageChange}
    >
      <div className="space-y-4">
        <textarea
          className="textarea w-full min-h-36 lg:min-h-52 resize-none text-base lg:text-lg leading-relaxed bg-base-100/80 border-base-300/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          placeholder="Enter text to translate..."
          value={textToTranslate}
          onChange={(e) => onTextToTranslateChange(e.target.value)}
        />

        <button
          className={`btn btn-sm transition-all ${
            textToTranslate.trim()
              ? "btn-primary hover:scale-105"
              : "btn-ghost opacity-50 cursor-not-allowed"
          }`}
          onClick={() => onTranslate(textToTranslate)}
          disabled={!textToTranslate.trim() || isTranslating}
        >
          {isTranslating ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            <ArrowRightLeft className="h-4 w-4" />
          )}
          <span className="hidden sm:inline ml-1">
            {isTranslating ? "Translating..." : "Translate"}
          </span>
        </button>
      </div>
    </TranslationPanelBase>
  );
}

export default SourcePanel;
