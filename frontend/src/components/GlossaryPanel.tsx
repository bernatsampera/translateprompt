import type {ImprovementEntry} from "@/api/graphApi";
import {ChevronDown, ChevronLeft, ChevronRight, ChevronUp} from "lucide-react";
import {useState} from "react";
import {GlossaryManager} from "./GlossaryManager";
import {ImprovementSuggestions} from "./ImprovementSuggestions";

interface GlossaryPanelProps {
  improvements: ImprovementEntry[];
  conversationId: string;
  loadImprovements: () => void;
  sourceLanguage: string;
  targetLanguage: string;
}

export function GlossaryPanel({
  improvements,
  conversationId,
  loadImprovements,
  sourceLanguage,
  targetLanguage
}: GlossaryPanelProps) {
  // Initialize collapsed state based on screen size
  const [isCollapsed, setIsCollapsed] = useState(() => {
    // Default to collapsed on mobile, expanded on desktop
    return typeof window !== "undefined" ? window.innerWidth < 1024 : false;
  });

  // Handle when an improvement is applied - refresh both improvements and glossary
  const handleImprovementApplied = () => {
    loadImprovements();
  };

  if (isCollapsed) {
    return (
      <div className="lg:h-full lg:bg-base-100 lg:relative lg:flex lg:flex-col">
        {/* Collapsed Header - Mobile */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-base-100 border-t border-base-300 p-2">
          <button
            onClick={() => setIsCollapsed(false)}
            className="btn btn-ghost btn-sm w-full flex items-center justify-center gap-2"
            title="Expand glossary"
          >
            Show glossary
            <ChevronUp className="h-4 w-4" />
          </button>
        </div>

        {/* Collapsed Header - Desktop */}
        <div className="hidden lg:flex p-2 items-center justify-center absolute top-0 left-10 right-0">
          <button
            onClick={() => setIsCollapsed(false)}
            className="btn btn-ghost btn-sm p-1"
            title="Expand glossary"
          >
            Show glossary
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Bottom Drawer */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-base-100 border-t border-base-300 max-h-[70vh] flex flex-col">
        <div className="p-4 border-b border-base-300 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-base-content">Glossary</h2>
          <button
            onClick={() => setIsCollapsed(true)}
            className="btn btn-ghost btn-sm p-1"
            title="Collapse glossary"
          >
            Hide glossary
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <ImprovementSuggestions
            improvements={improvements}
            conversationId={conversationId}
            onImprovementApplied={handleImprovementApplied}
          />

          <GlossaryManager
            sourceLanguage={sourceLanguage}
            targetLanguage={targetLanguage}
          />
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex h-full bg-base-100 border-l border-base-300 flex-col w-80">
        {/* Header */}
        <div className="p-4 border-b border-base-300 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-base-content">Glossary</h2>
          <button
            onClick={() => setIsCollapsed(true)}
            className="btn btn-ghost btn-sm p-1"
            title="Collapse glossary"
          >
            Hide glossary
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <ImprovementSuggestions
            improvements={improvements}
            conversationId={conversationId}
            onImprovementApplied={handleImprovementApplied}
          />

          <GlossaryManager
            sourceLanguage={sourceLanguage}
            targetLanguage={targetLanguage}
          />
        </div>
      </div>
    </>
  );
}
