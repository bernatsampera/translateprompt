import {ArrowRightLeft} from "lucide-react";
import {useEffect, useRef} from "react";
import TranslationPanelBase from "./TranslationPanelBase";

interface SourcePanelProps {
  sourceLanguage: string;
  onSourceLanguageChange: (language: string) => void;
  textToTranslate: string;
  onTextToTranslateChange: (text: string) => void;
  onTranslate: (text: string) => void;
  isTranslating: boolean;
}

function SourcePanel({
  sourceLanguage,
  onSourceLanguageChange,
  textToTranslate,
  onTextToTranslateChange,
  onTranslate,
  isTranslating
}: SourcePanelProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus({preventScroll: true});
    }
  }, []);

  return (
    <TranslationPanelBase
      title=""
      languageLabel="From"
      languageValue={sourceLanguage}
      onLanguageChange={onSourceLanguageChange}
    >
      <div className="space-y-4">
        <textarea
          ref={textareaRef}
          className="textarea w-full h-48 sm:h-56 md:h-64 lg:h-80 xl:h-96 resize-none text-base lg:text-lg leading-relaxed bg-base-100/80 border-base-300/50 focus:outline-none"
          placeholder="Enter text to translate..."
          value={textToTranslate}
          onChange={(e) => onTextToTranslateChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onTranslate(textToTranslate);
            }
          }}
        />

        <div className="flex justify-end">
          <button
            className={`btn btn-sm w-full transition-all ${
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
      </div>
    </TranslationPanelBase>
  );
}

export default SourcePanel;
