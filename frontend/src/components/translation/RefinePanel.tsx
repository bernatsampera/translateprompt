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
    <div className="bg-accent/20 rounded-lg border border-accent/30 p-5 shadow-sm">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <RotateCcw className="h-5 w-5 text-accent-content/80" />
          <h3 className="text-base lg:text-lg font-bold text-accent-content">
            Refine Translation
          </h3>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text text-sm text-accent-content/70">
              Suggest specific improvements
            </span>
          </label>
          <textarea
            className="textarea textarea-bordered w-full h-20 lg:h-24 resize-none text-sm lg:text-base bg-base-100/90 border-accent/30 focus:border-accent focus:bg-base-100 transition-colors"
            placeholder="Example: Use 'word X' instead of 'word Y'..."
            value={textToRefine}
            onChange={(e) => onTextToRefineChange(e.target.value)}
          />
        </div>

        <button
          className={`btn w-full text-sm lg:text-base font-semibold transition-all ${
            textToRefine.trim()
              ? "btn-accent hover:scale-[1.02] active:scale-[0.98]"
              : "btn-ghost opacity-50 cursor-not-allowed"
          }`}
          onClick={() => onRefine(textToRefine)}
          disabled={!textToRefine.trim()}
        >
          <RotateCcw className="h-4 w-4" />
          Apply Refinement
        </button>
      </div>
    </div>
  );
}

export default RefinePanel;
