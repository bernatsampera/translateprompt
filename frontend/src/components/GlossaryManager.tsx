import {
  deleteGlossaryEntry,
  editGlossaryEntry,
  getGlossaryEntries,
  type GlossaryEntry
} from "@/api/glossaryApi";
import {useEffect, useState} from "react";

interface GlossaryManagerProps {
  sourceLanguage: string;
  targetLanguage: string;
}

interface EditingEntry extends GlossaryEntry {
  index: number;
  originalSource: string;
}

export function GlossaryManager({
  sourceLanguage,
  targetLanguage
}: GlossaryManagerProps) {
  const [glossaryEntries, setGlossaryEntries] = useState<GlossaryEntry[]>([]);
  const [editingEntry, setEditingEntry] = useState<EditingEntry | null>(null);

  // Load glossary entries
  const loadGlossaryEntries = () => {
    if (!sourceLanguage || !targetLanguage) return;

    getGlossaryEntries(sourceLanguage, targetLanguage)
      .then((response) => {
        setGlossaryEntries(response.entries);
      })
      .catch(console.error);
  };

  // Start editing an entry
  const handleStartEdit = (entry: GlossaryEntry, index: number) => {
    setEditingEntry({
      index,
      source: entry.source,
      target: entry.target,
      note: entry.note,
      source_language: entry.source_language,
      target_language: entry.target_language,
      originalSource: entry.source
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
        editingEntry.originalSource, // old source
        editingEntry.source, // new source
        editingEntry.target,
        editingEntry.note,
        editingEntry.source_language,
        editingEntry.target_language
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
    loadGlossaryEntries();
  }, [sourceLanguage, targetLanguage]);

  return (
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
                        className="btn btn-primary btn-xs"
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
                        className="btn bg-accent/20 border-primary btn-xs"
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
  );
}
