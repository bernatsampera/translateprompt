import {
  addRule,
  deleteRule,
  editRule,
  getRulesEntries,
  type RulesEntry
} from "@/api/rulesApi";
import {Edit, Plus, Trash2} from "lucide-react";
import {useCallback, useEffect, useState} from "react";

interface EditingEntry extends RulesEntry {
  index: number;
  originalText: string;
}

interface CompactLanguageRulesProps {
  sourceLanguage: string;
  targetLanguage: string;
}

export function CompactLanguageRules({
  sourceLanguage,
  targetLanguage
}: CompactLanguageRulesProps) {
  const [rulesEntries, setRulesEntries] = useState<RulesEntry[]>([]);
  const [editingEntry, setEditingEntry] = useState<EditingEntry | null>(null);
  const [newRuleText, setNewRuleText] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const loadRulesEntries = useCallback(() => {
    getRulesEntries(sourceLanguage, targetLanguage)
      .then((response) => {
        setRulesEntries(response.entries);
      })
      .catch(console.error);
  }, [sourceLanguage, targetLanguage]);

  useEffect(() => {
    loadRulesEntries();
  }, [sourceLanguage, targetLanguage, loadRulesEntries]);

  // Add a new rule
  const handleAddRule = async () => {
    if (!newRuleText.trim()) return;

    try {
      await addRule(newRuleText.trim(), sourceLanguage, targetLanguage);
      setNewRuleText("");
      setIsAdding(false);
      loadRulesEntries();
    } catch (error) {
      console.error("Failed to add rule:", error);
    }
  };

  // Start editing an entry
  const handleStartEdit = (entry: RulesEntry, index: number) => {
    setEditingEntry({
      index,
      text: entry.text,
      source_language: entry.source_language,
      target_language: entry.target_language,
      user_id: entry.user_id,
      originalText: entry.text
    });
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingEntry(null);
  };

  // Save edited entry
  const handleSaveEdit = async () => {
    if (!editingEntry) return;

    try {
      await editRule(
        editingEntry.originalText,
        editingEntry.text,
        sourceLanguage,
        targetLanguage
      );
      loadRulesEntries();
      setEditingEntry(null);
    } catch (error) {
      console.error("Failed to edit rule:", error);
    }
  };

  // Delete an entry
  const handleDeleteEntry = async (text: string) => {
    if (!confirm("Delete this language rule?")) return;

    try {
      await deleteRule(text, sourceLanguage, targetLanguage);
      loadRulesEntries();
    } catch (error) {
      console.error("Failed to delete rule:", error);
    }
  };

  return (
    <div className="space-y-3 h-full flex flex-col">
      {/* Add Button */}
      <button
        onClick={() => setIsAdding(true)}
        className="btn btn-primary btn-sm w-full"
        disabled={isAdding}
      >
        <Plus className="h-3 w-3" />
        Add Rule
      </button>

      {/* Add Form */}
      {isAdding && (
        <div className="bg-base-200 border border-base-300 rounded p-3 space-y-2">
          <textarea
            value={newRuleText}
            onChange={(e) => setNewRuleText(e.target.value)}
            placeholder="Enter your language rule..."
            className="textarea textarea-bordered textarea-xs w-full resize-none"
            rows={2}
          />
          <div className="flex gap-1">
            <button
              onClick={handleAddRule}
              className="btn btn-primary btn-xs flex-1"
              disabled={!newRuleText.trim()}
            >
              Add
            </button>
            <button
              onClick={() => {
                setIsAdding(false);
                setNewRuleText("");
              }}
              className="btn btn-secondary btn-xs flex-1"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Rules List */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {rulesEntries.length === 0 ? (
          <div className="text-center py-6 text-xs text-base-content/60">
            No rules yet
          </div>
        ) : (
          rulesEntries.map((entry, index) => (
            <div
              key={index}
              className="bg-base-200 border border-base-300 rounded p-2"
            >
              {editingEntry && editingEntry.index === index ? (
                // Edit mode
                <div className="space-y-2">
                  <textarea
                    value={editingEntry.text}
                    onChange={(e) =>
                      setEditingEntry({
                        ...editingEntry,
                        text: e.target.value
                      })
                    }
                    className="textarea textarea-bordered textarea-xs w-full resize-none"
                    rows={2}
                  />
                  <div className="flex gap-1">
                    <button
                      onClick={handleSaveEdit}
                      className="btn btn-primary btn-xs flex-1"
                      disabled={!editingEntry.text.trim()}
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="btn btn-secondary btn-xs flex-1"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View mode
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1">
                    <p className="text-xs text-base-content leading-relaxed">
                      {entry.text}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleStartEdit(entry, index)}
                      className="btn btn-ghost btn-xs p-1"
                      title="Edit"
                    >
                      <Edit className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => handleDeleteEntry(entry.text)}
                      className="btn btn-ghost btn-xs p-1 text-error hover:bg-error/10"
                      title="Delete"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
