import {
  addGlossaryEntry,
  deleteGlossaryEntry,
  editGlossaryEntry,
  getGlossaryEntries,
  type GlossaryEntry
} from "@/api/glossaryApi";
import {Edit, Plus, Trash2} from "lucide-react";
import {useEffect, useState} from "react";

interface CompactGlossaryManagerProps {
  sourceLanguage: string;
  targetLanguage: string;
}

interface EditingEntry extends GlossaryEntry {
  index: number;
  originalSource: string;
}

export function CompactGlossaryManager({
  sourceLanguage,
  targetLanguage
}: CompactGlossaryManagerProps) {
  const [glossaryEntries, setGlossaryEntries] = useState<GlossaryEntry[]>([]);
  const [editingEntry, setEditingEntry] = useState<EditingEntry | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newEntry, setNewEntry] = useState({
    source: "",
    target: "",
    note: ""
  });

  // Load glossary entries
  const loadGlossaryEntries = () => {
    if (!sourceLanguage || !targetLanguage) return;

    getGlossaryEntries(sourceLanguage, targetLanguage)
      .then((response) => {
        setGlossaryEntries(response.entries);
      })
      .catch(console.error);
  };

  // Add new entry
  const handleAddEntry = async () => {
    if (!newEntry.source.trim() || !newEntry.target.trim()) return;

    try {
      // Use applyGlossaryUpdate for adding new entries
      await addGlossaryEntry(
        newEntry.source,
        newEntry.target,
        newEntry.note,
        sourceLanguage,
        targetLanguage
      );

      setNewEntry({source: "", target: "", note: ""});
      setIsAdding(false);
      loadGlossaryEntries();
    } catch (error) {
      console.error("Failed to add entry:", error);
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
        editingEntry.originalSource,
        editingEntry.source,
        editingEntry.target,
        editingEntry.note,
        editingEntry.source_language,
        editingEntry.target_language
      );

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
    if (!confirm("Delete this glossary entry?")) return;

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
    <div className="space-y-3 h-full flex flex-col">
      {/* Add Button */}
      <button
        onClick={() => setIsAdding(true)}
        className="btn btn-primary btn-sm w-full"
        disabled={isAdding}
      >
        <Plus className="h-3 w-3" />
        Add Entry
      </button>

      {/* Add Form */}
      {isAdding && (
        <div className="bg-base-200 border border-base-300 rounded p-3 space-y-2">
          <input
            type="text"
            placeholder="Source text"
            value={newEntry.source}
            onChange={(e) => setNewEntry({...newEntry, source: e.target.value})}
            className="input input-bordered input-xs w-full"
          />
          <input
            type="text"
            placeholder="Target translation"
            value={newEntry.target}
            onChange={(e) => setNewEntry({...newEntry, target: e.target.value})}
            className="input input-bordered input-xs w-full"
          />
          <input
            type="text"
            placeholder="Note (optional)"
            value={newEntry.note}
            onChange={(e) => setNewEntry({...newEntry, note: e.target.value})}
            className="input input-bordered input-xs w-full"
          />
          <div className="flex gap-1">
            <button
              onClick={handleAddEntry}
              className="btn btn-primary btn-xs flex-1"
              disabled={!newEntry.source.trim() || !newEntry.target.trim()}
            >
              Add
            </button>
            <button
              onClick={() => {
                setIsAdding(false);
                setNewEntry({source: "", target: "", note: ""});
              }}
              className="btn btn-secondary btn-xs flex-1"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Entries List */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {glossaryEntries.length === 0 ? (
          <div className="text-center py-6 text-xs text-base-content/60">
            No entries yet
          </div>
        ) : (
          glossaryEntries.map((entry, index) => (
            <div
              key={index}
              className="bg-base-200 border border-base-300 rounded p-2"
            >
              {editingEntry && editingEntry.index === index ? (
                // Edit mode
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editingEntry.source}
                    onChange={(e) =>
                      setEditingEntry({...editingEntry, source: e.target.value})
                    }
                    className="input input-bordered input-xs w-full"
                  />
                  <input
                    type="text"
                    value={editingEntry.target}
                    onChange={(e) =>
                      setEditingEntry({...editingEntry, target: e.target.value})
                    }
                    className="input input-bordered input-xs w-full"
                  />
                  <input
                    type="text"
                    value={editingEntry.note}
                    onChange={(e) =>
                      setEditingEntry({...editingEntry, note: e.target.value})
                    }
                    className="input input-bordered input-xs w-full"
                    placeholder="Note"
                  />
                  <div className="flex gap-1">
                    <button
                      onClick={handleSaveEdit}
                      className="btn btn-primary btn-xs flex-1"
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
                    <div className="text-xs font-medium text-base-content truncate">
                      {entry.source}
                    </div>
                    <div className="text-xs text-base-content/70 truncate">
                      → {entry.target}
                    </div>
                    {entry.note && (
                      <div className="text-xs text-base-content/50 truncate mt-0.5">
                        {entry.note}
                      </div>
                    )}
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
                      onClick={() =>
                        handleDeleteEntry(
                          entry.source,
                          entry.source_language,
                          entry.target_language
                        )
                      }
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
