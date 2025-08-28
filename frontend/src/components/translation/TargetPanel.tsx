import {Copy} from "lucide-react";
import LanguageSelector from "../LanguageSelector";

interface TargetPanelProps {
  targetLanguage: string;
  onTargetLanguageChange: (language: string) => void;
  translation: string | null;
  onCopyToClipboard: () => void;
  isCopying: boolean;
  isTranslating: boolean;
}

function TargetPanel({
  targetLanguage,
  onTargetLanguageChange,
  translation,
  onCopyToClipboard,
  isCopying,
  isTranslating
}: TargetPanelProps) {
  return (
    <div className="bg-base-200/30 rounded-lg border border-base-300/30 p-2 lg:p-6 space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg lg:text-xl font-bold text-base-content">
          Translation
        </h2>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-base-content/60 hidden sm:inline">
              To:
            </span>
            <LanguageSelector
              value={targetLanguage}
              onChange={onTargetLanguageChange}
            />
          </div>
        </div>
      </div>

      <div className="form-control">
        <textarea
          className="textarea w-full min-h-36 lg:min-h-52 resize-none text-base lg:text-lg leading-relaxed bg-base-100/80 border-base-300/50 focus:outline-none"
          placeholder="Translation will appear here..."
          value={isTranslating ? "..." : translation || ""}
          readOnly
          style={{
            backgroundColor: translation
              ? "oklch(var(--color-base-100))"
              : "oklch(var(--color-base-200) / 0.5)"
          }}
        />
      </div>

      <div className="flex items-center justify-between">
        {isTranslating && (
          <div className="flex items-center gap-2 text-sm text-base-content/60">
            <div className="w-2 h-2 bg-warning rounded-full animate-pulse"></div>
            <span>Translation in progress...</span>
          </div>
        )}

        {translation && !isTranslating && (
          <div className="flex items-center gap-2 text-sm text-base-content/60">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span>Translation complete</span>
          </div>
        )}

        <button
          className={`btn btn-sm transition-all ${
            translation
              ? "btn-neutral hover:btn-primary hover:scale-105"
              : "btn-ghost opacity-50 cursor-not-allowed"
          }`}
          title="Copy translation to clipboard"
          onClick={onCopyToClipboard}
          disabled={!translation || isCopying}
        >
          <Copy className="h-4 w-4" />
          <span className="hidden sm:inline ml-1">
            {isCopying ? "Copied!" : "Copy"}
          </span>
        </button>
      </div>
    </div>
  );
}

export default TargetPanel;
