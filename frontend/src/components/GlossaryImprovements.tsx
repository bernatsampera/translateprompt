import {
  applyGlossaryUpdate,
  deleteGlossaryEntry,
  editGlossaryEntry,
  getGlossaryEntries,
  type GlossaryEntry
} from "@/services/glossaryApi";
import {useEffect, useState} from "react";

interface GlossaryImprovementsProps {
  improvements: GlossaryEntry[];
  conversationId: string;
  loadImprovements: () => void;
}

interface EditingEntry extends GlossaryEntry {
  index: number;
}

function GlossaryImprovements({
  improvements,
  conversationId,
  loadImprovements
}: GlossaryImprovementsProps) {
  const [glossaryEntries, setGlossaryEntries] = useState<GlossaryEntry[]>([]);
  const [editingEntry, setEditingEntry] = useState<EditingEntry | null>(null);

  // Load glossary entries
  const loadGlossaryEntries = () => {
    getGlossaryEntries()
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
      note: entry.note
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
  const handleDeleteEntry = async (source: string) => {
    if (!confirm("Are you sure you want to delete this glossary entry?")) {
      return;
    }

    try {
      await deleteGlossaryEntry(source);
      loadGlossaryEntries();
    } catch (error) {
      console.error("Failed to delete entry:", error);
    }
  };

  useEffect(() => {
    // Load glossary entries on mount
    loadGlossaryEntries();
  }, []);

  return (
    <div className="p-4 space-y-6">
      {/* Suggested Improvements Section */}
      <div>
        {improvements.length !== 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold mb-4">Suggested Glossary Updates</h3>

            {improvements.map((improvement, index) => {
              return (
                <div key={index} className="border p-3 rounded bg-blue-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-medium">"{improvement.source}"</div>
                      <div className="text-sm text-gray-600">
                        {improvement.target
                          ? `${improvement.target} → ${improvement.target}`
                          : `→ ${improvement.target}`}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {improvement.note}
                      </div>
                    </div>
                    <button
                      onClick={() => handleApplyUpdate(improvement)}
                      className={`px-3 py-1 text-xs rounded ${"bg-blue-600 text-white hover:bg-blue-700"}`}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Current Glossary Entries Section */}
      <div>
        <h3 className="font-semibold mb-4">Glossary Entries</h3>
        {glossaryEntries.length === 0 ? (
          <p className="text-gray-500">No glossary entries found</p>
        ) : (
          <div className="space-y-2">
            {glossaryEntries.map((entry, index) => (
              <div key={index} className="border p-3 rounded bg-gray-50">
                {editingEntry && editingEntry.index === index ? (
                  // Edit mode
                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-700">
                        Source:
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
                        className="w-full p-1 text-sm border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700">
                        Target:
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
                        className="w-full p-1 text-sm border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700">
                        Note:
                      </label>
                      <textarea
                        value={editingEntry.note}
                        onChange={(e) =>
                          setEditingEntry({
                            ...editingEntry,
                            note: e.target.value
                          })
                        }
                        className="w-full h-24 p-1 text-sm border rounded"
                        rows={2}
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveEdit}
                        className="px-3 py-1 text-xs rounded bg-green-600 text-white hover:bg-green-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-3 py-1 text-xs rounded bg-gray-600 text-white hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // View mode
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-medium">{entry.source}</div>
                      <div className="text-sm text-gray-600">
                        → {entry.target}
                      </div>
                      {entry.note && (
                        <div className="text-xs text-gray-500 mt-1">
                          {entry.note}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStartEdit(entry, index)}
                        className="px-3 py-1 text-xs rounded bg-blue-600 text-white hover:bg-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteEntry(entry.source)}
                        className="px-3 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default GlossaryImprovements;
