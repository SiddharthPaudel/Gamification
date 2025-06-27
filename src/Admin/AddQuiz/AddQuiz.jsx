import React, { useState } from 'react';
import { Plus } from 'lucide-react';

const Quiz = () => {
  const [quizzes, setQuizzes] = useState([
    { id: 1, title: "React Basics Quiz", questions: 10, attempts: 234, module: "React Fundamentals" },
    { id: 2, title: "JavaScript Functions", questions: 15, attempts: 187, module: "JavaScript Basics" },
    { id: 3, title: "CSS Flexbox", questions: 8, attempts: 156, module: "CSS Styling" },
    { id: 4, title: "Node.js Fundamentals", questions: 12, attempts: 89, module: "Node.js Backend" },
    { id: 5, title: "Advanced React Hooks", questions: 20, attempts: 145, module: "React Fundamentals" },
    { id: 6, title: "JavaScript ES6", questions: 18, attempts: 203, module: "JavaScript Basics" }
  ]);

  const handleCreateQuiz = () => {
    console.log('Create new quiz');
    alert('Create new quiz functionality');
  };

  const handleEditQuiz = (quizId) => {
    console.log('Edit quiz:', quizId);
    alert(`Edit quiz with ID: ${quizId}`);
  };

  const handleViewQuiz = (quizId) => {
    console.log('View quiz:', quizId);
    alert(`View quiz with ID: ${quizId}`);
  };

  const handleDeleteQuiz = (quizId) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      setQuizzes(quizzes.filter(quiz => quiz.id !== quizId));
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Quiz Management</h2>
        <button 
          onClick={handleCreateQuiz}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Quiz
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => (
          <div key={quiz.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-lg mb-2">{quiz.title}</h3>
            <p className="text-sm text-gray-600 mb-3">{quiz.module}</p>
            <div className="flex justify-between text-sm mb-4">
              <span>{quiz.questions} Questions</span>
              <span>{quiz.attempts} Attempts</span>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => handleEditQuiz(quiz.id)}
                className="flex-1 bg-blue-100 text-blue-700 py-2 px-3 rounded hover:bg-blue-200 transition-colors"
              >
                Edit
              </button>
              <button 
                onClick={() => handleViewQuiz(quiz.id)}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded hover:bg-gray-200 transition-colors"
              >
                View
              </button>
              <button 
                onClick={() => handleDeleteQuiz(quiz.id)}
                className="px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {quizzes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No quizzes available</p>
          <button 
            onClick={handleCreateQuiz}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Your First Quiz
          </button>
        </div>
      )}
    </div>
  );
};

export default Quiz;