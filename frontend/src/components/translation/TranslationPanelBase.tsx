import type {ReactNode} from "react";
import LanguageSelector from "../LanguageSelector";

interface TranslationPanelBaseProps {
  title: string;
  languageLabel: string;
  languageValue: string;
  onLanguageChange: (language: string) => void;
  children: ReactNode;
}

function TranslationPanelBase({
  title,
  languageLabel,
  languageValue,
  onLanguageChange,
  children
}: TranslationPanelBaseProps) {
  return (
    <div className="bg-base-200 rounded-lg border border-base-300/30 p-2 space-y-4 shadow-sm h-fit">
      <div className="flex items-center justify-between">
        <h2 className="text-lg lg:text-xl font-bold text-base-content">
          {title}
        </h2>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-base-content/60 hidden sm:inline">
              {languageLabel}:
            </span>
            <LanguageSelector
              value={languageValue}
              onChange={onLanguageChange}
            />
          </div>
        </div>
      </div>

      <div className="form-control">{children}</div>
    </div>
  );
}

export default TranslationPanelBase;
