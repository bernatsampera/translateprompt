import {ArrowRightLeft} from "lucide-react";
import LanguageSelector, {LANGUAGE_OPTIONS} from "../LanguageSelector";

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg md:text-xl font-bold text-base-content">
          Original
        </h2>
        <LanguageSelector
          value={sourceLanguage}
          onChange={onSourceLanguageChange}
        />
      </div>

      <textarea
        className="textarea textarea-bordered w-full min-h-40 lg:min-h-56 resize-none text-lg leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        placeholder="Enter text to translate..."
        value={textToTranslate}
        onChange={(e) => onTextToTranslateChange(e.target.value)}
      />

      <button
        className="btn btn-primary w-full text-sm md:text-lg font-semibold h-14"
        onClick={() => onTranslate(textToTranslate)}
        disabled={!textToTranslate.trim() || isTranslating}
      >
        {isTranslating ? (
          <span className="loading loading-spinner loading-sm"></span>
        ) : (
          <ArrowRightLeft className="h-5 w-5" />
        )}
        {isTranslating ? "Translating..." : getTranslationButtonText()}
      </button>
    </div>
  );
}

export default SourcePanel;
