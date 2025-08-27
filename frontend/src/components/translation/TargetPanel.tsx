import {Copy} from "lucide-react";
import LanguageSelector from "../LanguageSelector";

interface TargetPanelProps {
  targetLanguage: string;
  onTargetLanguageChange: (language: string) => void;
  translation: string | null;
  onCopyToClipboard: () => void;
  isCopying: boolean;
}

function TargetPanel({
  targetLanguage,
  onTargetLanguageChange,
  translation,
  onCopyToClipboard,
  isCopying
}: TargetPanelProps) {
  return (
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
        />
      </div>
    </div>
  );
}

export default TargetPanel;
