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
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base lg:text-lg font-semibold">Original</h2>
        <LanguageSelector
          value={sourceLanguage}
          onChange={onSourceLanguageChange}
        />
      </div>
      <div className="form-control">
        <textarea
          className="textarea textarea-bordered w-full min-h-32 lg:min-h-48 resize-none focus:textarea-primary text-sm lg:text-base"
          placeholder="Enter text to translate..."
          value={textToTranslate}
          onChange={(e) => onTextToTranslateChange(e.target.value)}
        />
      </div>
      <button
        className="btn btn-primary w-full text-sm lg:text-base"
        onClick={() => onTranslate(textToTranslate)}
        disabled={!textToTranslate.trim() || isTranslating}
      >
        <ArrowRightLeft className="h-4 w-4" />
        {isTranslating ? "Translating..." : getTranslationButtonText()}
      </button>
    </div>
  );
}

export default SourcePanel;
