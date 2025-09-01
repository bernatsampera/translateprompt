import {Settings, X} from "lucide-react";
import {CompactGlossaryManager} from "./CompactGlossaryManager";
import {CompactLanguageRules} from "./CompactLanguageRules";

interface ManagementHubProps {
  sourceLanguage: string;
  targetLanguage: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ManagementHub({
  sourceLanguage,
  targetLanguage,
  isOpen,
  onClose
}: ManagementHubProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-base-content/20 backdrop-blur-sm">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-base-100 border border-base-300 rounded-xl shadow-2xl w-full max-w-4xl h-[70vh] flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-base-300 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Settings className="h-5 w-5 text-base-content/70" />
              <div>
                <h1 className="text-lg font-semibold text-base-content">
                  Translation Management
                </h1>
                <p className="text-xs text-base-content/70 mt-0.5">
                  {sourceLanguage} → {targetLanguage}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="btn btn-ghost btn-sm p-1.5"
              title="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
              {/* Glossary Section */}
              <div className="space-y-3">
                <h2 className="text-sm font-medium text-base-content">
                  Glossary Entries
                </h2>
                <CompactGlossaryManager
                  sourceLanguage={sourceLanguage}
                  targetLanguage={targetLanguage}
                />
              </div>

              {/* Rules Section */}
              <div className="space-y-3">
                <h2 className="text-sm font-medium text-base-content">
                  Language Rules
                </h2>
                <CompactLanguageRules
                  sourceLanguage={sourceLanguage}
                  targetLanguage={targetLanguage}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
