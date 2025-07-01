import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast'; // ✅ import toast

const Quiz = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [modules, setModules] = useState([]);
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([{ question: '', options: [], correctAnswer: '' }]);
  const [selectedModule, setSelectedModule] = useState('');

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/modules/get-all-module');
        const fetchedModules = res.data.modules || res.data || [];
        setModules(fetchedModules);
      } catch (error) {
        console.error('Failed to fetch modules:', error);
        toast.error('Failed to load modules');
      }
    };

    fetchModules();
  }, []);

  const handleCreateQuiz = async () => {
    if (!title || !selectedModule || questions.length === 0) {
      return toast.error('Please fill all fields');
    }

    try {
      const res = await axios.post(`http://localhost:5000/api/quiz/${selectedModule}`, {
        title,
        questions
      });

      const newQuiz = res.data.quiz;
      setQuizzes([...quizzes, {
        id: newQuiz._id,
        title: newQuiz.title,
        questions: newQuiz.questions.length,
        attempts: 0,
        module: modules.find(m => m._id === selectedModule)?.title || 'Unknown'
      }]);

      setTitle('');
      setQuestions([{ question: '', options: [], correctAnswer: '' }]);
      setSelectedModule('');

      toast.success('Quiz created successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to create quiz');
    }
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { question: '', options: [], correctAnswer: '' }]);
  };

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    if (field === 'options') {
      updated[index][field] = value.split(',').map(opt => opt.trim());
    } else {
      updated[index][field] = value;
    }
    setQuestions(updated);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Create New Quiz</h2>

        <div className="mb-3">
          <label className="block mb-1">Quiz Title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="border p-2 rounded w-full"
            placeholder="Enter quiz title"
          />
        </div>

        <div className="mb-3">
          <label className="block mb-1">Select Module</label>
          <select
            value={selectedModule}
            onChange={e => setSelectedModule(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="">-- Select Module --</option>
            {modules.map(module => (
              <option key={module._id} value={module._id}>
                {module.title}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold mb-2">Questions</h3>
          {questions.map((q, idx) => (
            <div key={idx} className="mb-4 p-3 border rounded">
              <input
                type="text"
                placeholder="Question"
                value={q.question}
                onChange={e => handleQuestionChange(idx, 'question', e.target.value)}
                className="border p-2 rounded w-full mb-2"
              />
              <input
                type="text"
                placeholder="Options (comma separated)"
                value={q.options.join(', ')}
                onChange={e => handleQuestionChange(idx, 'options', e.target.value)}
                className="border p-2 rounded w-full mb-2"
              />
              <input
                type="text"
                placeholder="Correct Answer"
                value={q.correctAnswer}
                onChange={e => handleQuestionChange(idx, 'correctAnswer', e.target.value)}
                className="border p-2 rounded w-full"
              />
            </div>
          ))}
          <button
            onClick={handleAddQuestion}
            className="text-sm text-blue-600 hover:underline"
          >
            + Add another question
          </button>
        </div>

        <button
          onClick={handleCreateQuiz}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Quiz
        </button>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Existing Quizzes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quizzes.map((quiz, index) => (
            <div key={index} className="border p-4 rounded shadow-sm">
              <h3 className="font-semibold text-lg">{quiz.title}</h3>
              <p className="text-sm text-gray-500 mb-2">{quiz.module}</p>
              <p className="text-sm">{quiz.questions} Questions</p>
              <p className="text-sm">{quiz.attempts} Attempts</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
