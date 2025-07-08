import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2, Save, XCircle } from "lucide-react";

const FlashCardTable = () => {
  const [modules, setModules] = useState({});
  const [editingCardId, setEditingCardId] = useState(null);
  const [editFront, setEditFront] = useState("");
  const [editBack, setEditBack] = useState("");

  useEffect(() => {
    fetchFlashcards();
  }, []);

  const fetchFlashcards = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/flashcards/all");
      const sets = res.data;

      const groupedModules = {};
      sets.forEach((set) => {
        const moduleTitle = set.module?.title || "Untitled";

        if (!groupedModules[moduleTitle]) {
          groupedModules[moduleTitle] = {
            icon: "📘",
            color: "text-blue-600",
            cards: [],
            setId: set._id,
            description: "Default description",
            difficulty: "Easy",
          };
        }

        const cardsWithSetId = set.cards.map((card) => ({
          ...card,
          setId: set._id,
        }));

        groupedModules[moduleTitle].cards.push(...cardsWithSetId);
      });

      setModules(groupedModules);
    } catch (err) {
      console.error("Failed to fetch flashcards", err);
    }
  };

  const startEdit = (card) => {
    setEditingCardId(card._id);
    setEditFront(card.front);
    setEditBack(card.back);
  };

  const cancelEdit = () => {
    setEditingCardId(null);
    setEditFront("");
    setEditBack("");
  };

  const saveEdit = async (card) => {
    try {
      await axios.put(
        `http://localhost:5000/api/flashcards/set/${card.setId}/card/${card._id}`,
        { front: editFront, back: editBack }
      );
      cancelEdit();
      fetchFlashcards();
    } catch (err) {
      console.error("Failed to update flashcard", err);
      alert("Update failed");
    }
  };

  const deleteCard = async (card) => {
    if (!window.confirm("Delete this flashcard?")) return;
    try {
      await axios.delete(
        `http://localhost:5000/api/flashcards/set/${card.setId}/card/${card._id}`
      );
      fetchFlashcards();
    } catch (err) {
      console.error("Failed to delete flashcard", err);
      alert("Delete failed");
    }
  };

  const deleteFlashcardSet = async (setId) => {
    if (!window.confirm("Delete the entire flashcard set?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/flashcards/set/${setId}`);
      fetchFlashcards();
    } catch (err) {
      console.error("Failed to delete set", err);
      alert("Delete flashcard set failed");
    }
  };

  const updateFullFlashcardSet = async (setId, cards) => {
    try {
      await axios.put(`http://localhost:5000/api/flashcards/set/${setId}`, {
        cards,
      });
      alert("Flashcard set updated");
      fetchFlashcards();
    } catch (err) {
      console.error("Failed to update set", err);
      alert("Update flashcard set failed");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">📚 Flashcard Sets</h1>

      {Object.entries(modules).map(([moduleTitle, moduleData]) => (
        <div key={moduleTitle} className="mb-10 border rounded-lg shadow bg-white">
          <div className="p-4 border-b flex justify-between items-center bg-gray-50">
            <div>
              <h2 className={`text-xl font-semibold ${moduleData.color}`}>
                {moduleData.icon} {moduleTitle}
              </h2>
              <p className="text-sm text-gray-500">{moduleData.description} · Difficulty: {moduleData.difficulty}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => updateFullFlashcardSet(moduleData.setId, moduleData.cards)}
                className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Save Set
              </button>
              <button
                onClick={() => deleteFlashcardSet(moduleData.setId)}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete Set
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-4 py-2">Front</th>
                  <th className="px-4 py-2">Back</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {moduleData.cards.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-4 py-3 text-center text-gray-500">
                      No flashcards found.
                    </td>
                  </tr>
                ) : (
                  moduleData.cards.map((card) => (
                    <tr key={card._id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2">
                        {editingCardId === card._id ? (
                          <input
                            value={editFront}
                            onChange={(e) => setEditFront(e.target.value)}
                            className="w-full border rounded px-2 py-1"
                          />
                        ) : (
                          card.front
                        )}
                      </td>
                      <td className="px-4 py-2">
                        {editingCardId === card._id ? (
                          <input
                            value={editBack}
                            onChange={(e) => setEditBack(e.target.value)}
                            className="w-full border rounded px-2 py-1"
                          />
                        ) : (
                          card.back
                        )}
                      </td>
                      <td className="px-4 py-2">
                        {editingCardId === card._id ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => saveEdit(card)}
                              className="text-green-600 hover:text-green-800"
                            >
                              <Save size={18} />
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              <XCircle size={18} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <button
                              onClick={() => startEdit(card)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <Pencil size={18} />
                            </button>
                            <button
                              onClick={() => deleteCard(card)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FlashCardTable;
