import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const CreateFlashcardSet = () => {
  const [modules, setModules] = useState([]);
  const [selectedModuleId, setSelectedModuleId] = useState("");
  const [cards, setCards] = useState([{ front: "", back: "" }]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch modules on component mount
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/modules/get-all-module");
        const fetchedModules = res.data.modules || res.data || [];
        setModules(fetchedModules);
      } catch (error) {
        console.error("Failed to fetch modules:", error);
        toast.error("Failed to load modules");
      }
    };

    fetchModules();
  }, []);

  // Handle input changes
  const handleCardChange = (index, field, value) => {
    const updatedCards = [...cards];
    updatedCards[index][field] = value;
    setCards(updatedCards);
  };

  // Add a new card
  const addCard = () => {
    setCards([...cards, { front: "", back: "" }]);
  };

  // Remove a card
  const removeCard = (index) => {
    const updatedCards = cards.filter((_, i) => i !== index);
    setCards(updatedCards);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedModuleId) return toast.error("Please select a module");

    try {
      setIsSubmitting(true);
      await axios.post(`http://localhost:5000/api/flashcards/${selectedModuleId}`, {
        cards
      });

      toast.success("Flashcard set created!");
      setCards([{ front: "", back: "" }]);
    } catch (error) {
      console.error("Error creating flashcard set:", error);
      toast.error("Failed to create flashcard set");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white shadow rounded-xl mt-6">
      <h2 className="text-xl font-bold mb-4">Create Flashcard Set</h2>

      {/* Module Dropdown */}
      <select
        className="w-full p-2 border rounded mb-4"
        value={selectedModuleId}
        onChange={(e) => setSelectedModuleId(e.target.value)}
        required
      >
        <option value="">Select a Module</option>
        {modules.map((mod) => (
          <option key={mod._id} value={mod._id}>
            {mod.title}
          </option>
        ))}
      </select>

      {/* Flashcard Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {cards.map((card, index) => (
          <div key={index} className="border p-4 rounded-md space-y-2 bg-gray-50">
            <input
              type="text"
              placeholder="Front"
              value={card.front}
              onChange={(e) => handleCardChange(index, "front", e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Back"
              value={card.back}
              onChange={(e) => handleCardChange(index, "back", e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
            <div className="text-right">
              {cards.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeCard(index)}
                  className="text-red-600 hover:underline text-sm"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}

        <div className="flex justify-between">
          <button
            type="button"
            onClick={addCard}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            + Add Card
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            {isSubmitting ? "Creating..." : "Create Flashcard Set"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateFlashcardSet;
