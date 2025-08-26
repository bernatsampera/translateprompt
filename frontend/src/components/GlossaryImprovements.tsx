import {
  applyGlossaryUpdate,
  deleteGlossaryEntry,
  editGlossaryEntry,
  getGlossaryEntries,
  type GlossaryEntry
} from "@/services/glossaryApi";
import {ChevronLeft, ChevronRight} from "lucide-react";
import {useEffect, useState} from "react";

interface GlossaryImprovementsProps {
  improvements: GlossaryEntry[];
  conversationId: string;
  loadImprovements: () => void;
  sourceLanguage: string;
  targetLanguage: string;
}

interface EditingEntry extends GlossaryEntry {
  index: number;
}

function GlossaryImprovements({
  improvements,
  conversationId,
  loadImprovements,
  sourceLanguage,
  targetLanguage
}: GlossaryImprovementsProps) {
  const [glossaryEntries, setGlossaryEntries] = useState<GlossaryEntry[]>([]);
  const [editingEntry, setEditingEntry] = useState<EditingEntry | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Load glossary entries
  const loadGlossaryEntries = () => {
    getGlossaryEntries(sourceLanguage, targetLanguage)
      .then((response) => {
        setGlossaryEntries(response.entries);
      })
      .catch(console.error);
  };

  // Apply a glossary update
  const handleApplyUpdate = async (improvement: GlossaryEntry) => {
    try {
      await applyGlossaryUpdate(
        improvement.source,
        improvement.target,
        improvement.note,
        conversationId
      );

      // Refresh glossary entries
      loadGlossaryEntries();
      loadImprovements();
    } catch (error) {
      console.error("Failed to apply update:", error);
    }
  };

  // Start editing an entry
  const handleStartEdit = (entry: GlossaryEntry, index: number) => {
    setEditingEntry({
      index,
      source: entry.source,
      target: entry.target,
      note: entry.note,
      source_language: entry.source_language,
      target_language: entry.target_language
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
      await editGlossaryEntry(
        editingEntry.source, // old source
        editingEntry.source, // new source (same for now, could be made editable)
        editingEntry.target,
        editingEntry.note
      );

      // Refresh glossary entries
      loadGlossaryEntries();
      setEditingEntry(null);
    } catch (error) {
      console.error("Failed to edit entry:", error);
    }
  };

  // Delete an entry
  const handleDeleteEntry = async (
    source: string,
    source_language: string,
    target_language: string
  ) => {
    if (!confirm("Are you sure you want to delete this glossary entry?")) {
      return;
    }

    try {
      await deleteGlossaryEntry(source, source_language, target_language);
      loadGlossaryEntries();
    } catch (error) {
      console.error("Failed to delete entry:", error);
    }
  };

  useEffect(() => {
    // Load glossary entries on mount
    loadGlossaryEntries();
  }, [sourceLanguage, targetLanguage]);

  if (isCollapsed) {
    return (
      <div className="h-full bg-base-100  flex flex-col">
        {/* Collapsed Header */}
        <div className="p-2  flex items-center justify-center">
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
    <div className="h-full bg-base-100 border-l border-base-300 flex flex-col w-80">
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
        {/* Suggested Improvements Section */}
        {improvements.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-base-content">
              Suggested Updates
            </h3>

            <div className="space-y-2">
              {improvements.map((improvement, index) => (
                <div
                  key={index}
                  className="card bg-base-200 border border-base-300"
                >
                  <div className="card-body p-3">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-base-content text-sm">
                          "{improvement.source}"
                        </div>
                        <div className="text-xs text-base-content/70 mt-1">
                          {improvement.target
                            ? `${improvement.source} → ${improvement.target}`
                            : `→ ${improvement.target}`}
                        </div>
                        {improvement.note && (
                          <div className="text-xs text-base-content/60 mt-1">
                            {improvement.note}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => handleApplyUpdate(improvement)}
                        className="btn btn-neutral btn-xs"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Current Glossary Entries Section */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-base-content">
            Current Entries ({sourceLanguage} → {targetLanguage})
          </h3>

          {glossaryEntries.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-base-content/60 text-sm">
                No glossary entries found
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {glossaryEntries.map((entry, index) => (
                <div
                  key={index}
                  className="card bg-base-200 border border-base-300"
                >
                  <div className="card-body p-3">
                    {editingEntry && editingEntry.index === index ? (
                      // Edit mode
                      <div className="space-y-3">
                        <div>
                          <label className="label label-text text-xs font-medium text-base-content">
                            Source
                          </label>
                          <input
                            type="text"
                            value={editingEntry.source}
                            onChange={(e) =>
                              setEditingEntry({
                                ...editingEntry,
                                source: e.target.value
                              })
                            }
                            className="input input-bordered input-sm w-full"
                          />
                        </div>
                        <div>
                          <label className="label label-text text-xs font-medium text-base-content">
                            Target
                          </label>
                          <input
                            type="text"
                            value={editingEntry.target}
                            onChange={(e) =>
                              setEditingEntry({
                                ...editingEntry,
                                target: e.target.value
                              })
                            }
                            className="input input-bordered input-sm w-full"
                          />
                        </div>
                        <div>
                          <label className="label label-text text-xs font-medium text-base-content">
                            Note
                          </label>
                          <textarea
                            value={editingEntry.note}
                            onChange={(e) =>
                              setEditingEntry({
                                ...editingEntry,
                                note: e.target.value
                              })
                            }
                            className="textarea textarea-bordered textarea-sm w-full"
                            rows={2}
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={handleSaveEdit}
                            className="btn btn-neutral btn-xs flex-1"
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
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-base-content text-sm">
                            {entry.source}
                          </div>
                          <div className="text-xs text-base-content/70 mt-1">
                            → {entry.target}
                          </div>
                          {entry.note && (
                            <div className="text-xs text-base-content/60 mt-1">
                              {entry.note}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleStartEdit(entry, index)}
                            className="btn btn-neutral btn-xs"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteEntry(
                                entry.source,
                                entry.source_language,
                                entry.target_language
                              )
                            }
                            className="btn btn-secondary btn-xs"
                          >
                            Delete
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
  );
}

export default GlossaryImprovements;
