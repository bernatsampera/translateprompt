import {
  addRule,
  deleteRule,
  editRule,
  getRulesEntries,
  type RulesEntry
} from "@/api/rulesApi";
import {Edit, Plus, Trash2} from "lucide-react";
import {useEffect, useState} from "react";

interface EditingEntry extends RulesEntry {
  index: number;
  originalText: string;
}

interface LanguageRulesProps {
  sourceLanguage: string;
  targetLanguage: string;
}

const LanguageRules = ({
  sourceLanguage,
  targetLanguage
}: LanguageRulesProps) => {
  const [rulesEntries, setRulesEntries] = useState<RulesEntry[]>([]);
  const [editingEntry, setEditingEntry] = useState<EditingEntry | null>(null);
  const [newRuleText, setNewRuleText] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  // Load rules entries
  const loadRulesEntries = () => {
    getRulesEntries(sourceLanguage, targetLanguage)
      .then((response) => {
        setRulesEntries(response.entries);
      })
      .catch(console.error);
  };

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

  useEffect(() => {
    // Load rules entries on mount
    loadRulesEntries();
  }, []);

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex justify-between items-center mb-6">
            <h2 className="card-title text-2xl">
              Language Rules ({sourceLanguage} → {targetLanguage})
            </h2>
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
            <div className="card bg-base-200 border border-base-300 mb-6">
              <div className="card-body p-4">
                <h3 className="text-lg font-semibold mb-3">Add New Rule</h3>
                <div className="space-y-3">
                  <div>
                    <label className="label label-text text-sm font-medium">
                      Rule Text
                    </label>
                    <textarea
                      value={newRuleText}
                      onChange={(e) => setNewRuleText(e.target.value)}
                      placeholder="Enter your language rule here..."
                      className="textarea textarea-bordered w-full"
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
            </div>
          )}

          {/* Rules List */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Your Language Rules</h3>

            {rulesEntries.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-base-content/60 mb-4">
                  <Edit className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No language rules found</p>
                  <p className="text-sm mt-2">
                    Add your first language rule to get started
                  </p>
                </div>
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
                    className="card bg-base-200 border border-base-300"
                  >
                    <div className="card-body p-4">
                      {editingEntry && editingEntry.index === index ? (
                        // Edit mode
                        <div className="space-y-3">
                          <div>
                            <label className="label label-text text-sm font-medium">
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
                              className="textarea textarea-bordered w-full"
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
                            <p className="text-base-content whitespace-pre-wrap">
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
      </div>
    </div>
  );
};

export default LanguageRules;
