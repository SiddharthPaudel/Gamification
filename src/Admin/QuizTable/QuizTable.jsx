import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash } from "lucide-react";
import toast from "react-hot-toast";

const API_BASE_URL = "http://localhost:5000/api/quizzes";

const QuizTable = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [editedQuestions, setEditedQuestions] = useState([]);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/all`);
      setQuizzes(res.data);
    } catch (error) {
      toast.error("Failed to fetch quizzes");
    }
  };

  const deleteQuiz = async (quizId) => {
    try {
      await axios.delete(`${API_BASE_URL}/delete/${quizId}`);
      toast.success("Quiz deleted");
      setQuizzes((prev) => prev.filter((q) => q._id !== quizId));
    } catch (error) {
      toast.error("Failed to delete quiz");
    }
  };

  const openEditModal = (quiz) => {
    setEditingQuiz(quiz);
    setEditedQuestions(quiz.questions);
  };

  const handleUpdateQuiz = async () => {
    try {
      await axios.put(`${API_BASE_URL}/update/${editingQuiz._id}`, {
        questions: editedQuestions,
      });
      toast.success("Quiz updated");
      setEditingQuiz(null);
      fetchQuizzes();
    } catch (error) {
      toast.error("Failed to update quiz");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Quiz List</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">#</th>
            <th className="p-2 border">Questions</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {quizzes.map((quiz, index) => (
            <tr key={quiz._id}>
              <td className="p-2 border text-center">{index + 1}</td>
              <td className="p-2 border">
                <ul className="list-disc ml-4">
                  {quiz.questions.map((q, i) => (
                    <li key={i}>{q}</li>
                  ))}
                </ul>
              </td>
              <td className="p-2 border text-center space-x-2">
                <button
                  className="text-blue-600"
                  onClick={() => openEditModal(quiz)}
                >
                  <Pencil size={18} />
                </button>
                <button
                  className="text-red-600"
                  onClick={() => deleteQuiz(quiz._id)}
                >
                  <Trash size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingQuiz && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Edit Quiz</h3>
            {editedQuestions.map((q, idx) => (
              <input
                key={idx}
                className="w-full p-2 border rounded mb-2"
                value={q}
                onChange={(e) => {
                  const updated = [...editedQuestions];
                  updated[idx] = e.target.value;
                  setEditedQuestions(updated);
                }}
              />
            ))}
            <button
              onClick={() =>
                setEditedQuestions((prev) => [...prev, "New Question"])
              }
              className="text-sm text-blue-500 mb-4"
            >
              + Add Question
            </button>
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
