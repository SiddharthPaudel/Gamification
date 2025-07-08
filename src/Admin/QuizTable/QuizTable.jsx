import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Pencil, Trash } from "lucide-react";

const BASE_URL = "http://localhost:5000/api";

const QuizTable = () => {
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState("");
  const [quizzes, setQuizzes] = useState([]);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [editedQuestions, setEditedQuestions] = useState([]);

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/modules/get-all-module`);
      const fetchedModules = res.data.modules || res.data || [];
      setModules(
        fetchedModules.map((m) => ({
          ...m,
          id: m._id || m.id,
        }))
      );
    } catch (err) {
      toast.error("Failed to load modules");
    }
  };

  const fetchQuizzes = async (moduleId) => {
    try {
      const res = await axios.get(`${BASE_URL}/quiz/${moduleId}`);
      setQuizzes(res.data);
    } catch (err) {
      toast.error("Failed to fetch quizzes");
    }
  };

  const handleModuleChange = (e) => {
    const moduleId = e.target.value;
    setSelectedModule(moduleId);
    if (moduleId) fetchQuizzes(moduleId);
  };

  const handleDeleteQuiz = async (quizId) => {
    try {
      await axios.delete(`${BASE_URL}/quiz/delete/${quizId}`);
      toast.success("Quiz deleted");
      fetchQuizzes(selectedModule);
    } catch (err) {
      toast.error("Failed to delete quiz");
    }
  };

  const openEditModal = (quiz) => {
    setEditingQuiz(quiz);
    setEditedQuestions([...quiz.questions]);
  };

  const updateQuestion = (index, field, value) => {
    const updated = [...editedQuestions];
    if (field === "option1" || field === "option2" || field === "option3" || field === "option4") {
      const optionIndex = parseInt(field.replace("option", "")) - 1;
      updated[index].options[optionIndex] = value;
    } else {
      updated[index][field] = value;
    }
    setEditedQuestions(updated);
  };

  const handleUpdateQuiz = async () => {
    try {
      await axios.put(`${BASE_URL}/quiz/update/${editingQuiz._id}`, {
        questions: editedQuestions,
      });
      toast.success("Quiz updated");
      setEditingQuiz(null);
      fetchQuizzes(selectedModule);
    } catch (err) {
      toast.error("Failed to update quiz");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Toaster />
      <h2 className="text-2xl font-bold mb-4">Quizzes by Module</h2>

      <select
        value={selectedModule}
        onChange={handleModuleChange}
        className="p-2 border rounded mb-6"
      >
        <option value="">Select Module</option>
        {modules.map((mod) => (
          <option key={mod.id} value={mod.id}>
            {mod.name || mod.title || "Unnamed Module"}
          </option>
        ))}
      </select>

      {quizzes.length > 0 ? (
        <table className="w-full border text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2 border">#</th>
              <th className="p-2 border">Title & Questions</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {quizzes.map((quiz, index) => (
              <tr key={quiz._id}>
                <td className="p-2 border text-center">{index + 1}</td>
                <td className="p-2 border">
                  <strong className="block text-base mb-2">{quiz.title}</strong>
                  <ul className="list-disc ml-4">
                    {quiz.questions.map((q, i) => (
                      <li key={i} className="mb-2">
                        <div><strong>Q{i + 1}:</strong> {q.question}</div>
                        <ul className="ml-5 text-gray-600 list-decimal">
                          {q.options.map((opt, idx) => (
                            <li key={idx}>
                              {opt}{" "}
                              {opt === q.correctAnswer && (
                                <span className="text-green-500 font-semibold">
                                  (Correct)
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="p-2 border text-center">
                  <button
                    className="text-blue-600 mr-2"
                    onClick={() => openEditModal(quiz)}
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    className="text-red-600"
                    onClick={() => handleDeleteQuiz(quiz._id)}
                  >
                    <Trash size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : selectedModule ? (
        <p className="text-gray-500">No quizzes found for this module.</p>
      ) : null}

      {/* Modal */}
      {editingQuiz && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">Edit Quiz: {editingQuiz.title}</h3>
            {editedQuestions.map((q, idx) => (
              <div key={idx} className="border p-4 mb-4 rounded">
                <label className="block font-semibold mb-1">Question {idx + 1}</label>
                <input
                  className="w-full p-2 border rounded mb-2"
                  value={q.question}
                  onChange={(e) => updateQuestion(idx, "question", e.target.value)}
                />
                {[0, 1, 2, 3].map((i) => (
                  <input
                    key={i}
                    className="w-full p-2 border rounded mb-2"
                    placeholder={`Option ${i + 1}`}
                    value={q.options[i] || ""}
                    onChange={(e) => updateQuestion(idx, `option${i + 1}`, e.target.value)}
                  />
                ))}
                <input
                  className="w-full p-2 border rounded"
                  placeholder="Correct Answer"
                  value={q.correctAnswer}
                  onChange={(e) =>
                    updateQuestion(idx, "correctAnswer", e.target.value)
                  }
                />
              </div>
            ))}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditingQuiz(null)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateQuiz}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizTable;
