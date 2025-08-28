import {RotateCcw} from "lucide-react";

interface RefinePanelProps {
  textToRefine: string;
  onTextToRefineChange: (text: string) => void;
  onRefine: (text: string) => void;
}

function RefinePanel({
  textToRefine,
  onTextToRefineChange,
  onRefine
}: RefinePanelProps) {
  return (
    <div className="bg-base-200/30 rounded-lg p-1">
      <div className="space-y-1">
        <div className="flex items-center gap-1">
          <h3 className="text-sm font-semibold">Refine</h3>
        </div>
        <div className="form-control">
          <textarea
            className="textarea textarea-bordered w-full h-16 resize-none text-sm lg:text-base"
            placeholder="Suggest improvements... ( Use 'x word' instead of 'y word')"
            value={textToRefine}
            onChange={(e) => onTextToRefineChange(e.target.value)}
          />
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
  );
}

export default RefinePanel;
