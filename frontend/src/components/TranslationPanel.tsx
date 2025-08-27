import {ArrowRightLeft, Copy, RotateCcw} from "lucide-react";
import LanguageSelector, {LANGUAGE_OPTIONS} from "./LanguageSelector";

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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-4 lg:mb-6">
      {/* Source Panel */}
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
          ></textarea>
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

      {/* Target Panel */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base lg:text-lg font-semibold">Translation</h2>
          <div className="flex items-center gap-2">
            <LanguageSelector
              value={targetLanguage}
              onChange={onTargetLanguageChange}
            />
            <button
              className="btn btn-ghost btn-sm"
              title="Copy to clipboard"
              onClick={onCopyToClipboard}
              disabled={!translation || isCopying}
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="form-control">
          <textarea
            className="textarea textarea-bordered textarea w-full min-h-32 lg:min-h-48 resize-none bg-base-200/50 text-sm lg:text-base"
            placeholder="Translation will appear here..."
            value={translation || ""}
            readOnly
          ></textarea>
        </div>

        {/* Refine Panel */}
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
                onChange={(e) => onTextToRefineChange(e.target.value)}
              ></textarea>
            </div>
            <div className="flex gap-2">
              <button
                className="btn btn-accent flex-1 text-sm lg:text-base"
                onClick={() => onRefine(textToRefine)}
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
  );
}

export default TranslationPanel;
