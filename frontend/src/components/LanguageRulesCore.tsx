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

interface LanguageRulesCoreProps {
  sourceLanguage: string;
  targetLanguage: string;
}

export function LanguageRulesCore({
  sourceLanguage,
  targetLanguage
}: LanguageRulesCoreProps) {
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
    if (!confirm("Are you sure you want to delete this language rule?")) {
      return;
    }

    try {
      await deleteRule(text, sourceLanguage, targetLanguage);
      loadRulesEntries();
    } catch (error) {
      console.error("Failed to delete rule:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-base font-medium text-base-content">
            Active Rules
          </h3>
          <p className="text-sm text-base-content/70 mt-1">
            {rulesEntries.length} rule{rulesEntries.length !== 1 ? "s" : ""}{" "}
            defined
          </p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="btn btn-primary btn-sm"
          disabled={isAdding}
        >
          <Plus className="h-4 w-4" />
          Add Rule
        </button>
      </div>

      {/* Add New Rule Section */}
      {isAdding && (
        <div className="bg-base-100 border border-base-300 rounded-lg p-4">
          <h4 className="text-sm font-medium text-base-content mb-3">
            Add New Rule
          </h4>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-base-content/70 mb-2">
                Rule Text
              </label>
              <textarea
                value={newRuleText}
                onChange={(e) => setNewRuleText(e.target.value)}
                placeholder="Enter your language rule here..."
                className="textarea textarea-bordered w-full resize-none"
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAddRule}
                className="btn btn-primary btn-sm"
                disabled={!newRuleText.trim()}
              >
                Add Rule
              </button>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setNewRuleText("");
                }}
                className="btn btn-secondary btn-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rules List */}
      <div className="space-y-3">
        {rulesEntries.length === 0 ? (
          <div className="text-center py-12">
            <Edit className="h-12 w-12 mx-auto mb-4 text-base-content/30" />
            <h4 className="text-lg font-medium text-base-content mb-2">
              No language rules found
            </h4>
            <p className="text-sm text-base-content/60 mb-4">
              Add your first language rule to get started
            </p>
            <button
              onClick={() => setIsAdding(true)}
              className="btn btn-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Rule
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {rulesEntries.map((entry, index) => (
              <div
                key={index}
                className="bg-base-100 border border-base-300 rounded-lg"
              >
                <div className="p-4">
                  {editingEntry && editingEntry.index === index ? (
                    // Edit mode
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-base-content/70 mb-2">
                          Rule Text
                        </label>
                        <textarea
                          value={editingEntry.text}
                          onChange={(e) =>
                            setEditingEntry({
                              ...editingEntry,
                              text: e.target.value
                            })
                          }
                          className="textarea textarea-bordered w-full resize-none"
                          rows={3}
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveEdit}
                          className="btn btn-primary btn-sm"
                          disabled={!editingEntry.text.trim()}
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="btn btn-secondary btn-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View mode
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <p className="text-base-content text-sm leading-relaxed whitespace-pre-wrap">
                          {entry.text}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleStartEdit(entry, index)}
                          className="btn btn-accent btn-sm"
                          title="Edit rule"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteEntry(entry.text)}
                          className="btn btn-error btn-sm"
                          title="Delete rule"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
