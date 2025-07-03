import React from 'react';
import { Brain, Zap, Code } from 'lucide-react';
import { useAuth } from '../AuthContext/AuthContext';

const StatsAndProgress = () => {
  const { user } = useAuth();

  if (!user) return <div className="text-center py-6">Loading user data...</div>;

  // Destructure game progress or fallback to empty objects
  const quiz = user?.gameProgress?.quiz || {};
  const flashcards = user?.gameProgress?.flashcards || {};
  const codePuzzles = user?.gameProgress?.codePuzzles || {};

  // Calculate flashcard accuracy %
  const flashcardAccuracy =
    flashcards.totalPlayed > 0
      ? Math.round((flashcards.totalCorrect / flashcards.totalPlayed) * 100)
      : 0;

  // Calculate code puzzle success rate %
  const codePuzzleSuccessRate =
    codePuzzles.totalCompleted > 0
      ? Math.round((codePuzzles.correctFirstTry / codePuzzles.totalCompleted) * 100)
      : 0;

  console.log('Flashcards progress:', flashcards);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {/* Quiz Stats */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="bg-gradient-to-r from-green-400 to-emerald-500 p-4">
          <div className="flex items-center justify-between text-white">
            <h3 className="text-lg font-bold">Quiz Performance</h3>
            <Brain className="w-6 h-6" />
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Played</span>
            <span className="font-bold text-gray-900">{quiz.totalPlayed || 0}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Correct Answers</span>
            <span className="font-bold text-gray-900">{quiz.totalCorrect || 0}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">High Score</span>
            <span className="font-bold text-gray-900">{quiz.highScore || 0}</span>
          </div>
        </div>
      </div>

      {/* Flashcards Stats */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="bg-gradient-to-r from-blue-400 to-cyan-500 p-4">
          <div className="flex items-center justify-between text-white">
            <h3 className="text-lg font-bold">Flashcards</h3>
            <Zap className="w-6 h-6" />
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Played</span>
            <span className="font-bold text-gray-900">{flashcards.totalPlayed || 0}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Correct Answers</span>
            <span className="font-bold text-gray-900">{flashcards.totalCorrect || 0}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Accuracy</span>
            <span className="font-bold text-gray-900">{flashcardAccuracy}%</span>
          </div>
        </div>
      </div>

      {/* Code Puzzles Stats */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="bg-gradient-to-r from-purple-400 to-pink-500 p-4">
          <div className="flex items-center justify-between text-white">
            <h3 className="text-lg font-bold">Code Puzzles</h3>
            <Code className="w-6 h-6" />
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Completed</span>
            <span className="font-bold text-gray-900">{codePuzzles.totalCompleted || 0}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">First Try Success</span>
            <span className="font-bold text-gray-900">{codePuzzles.correctFirstTry || 0}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Success Rate</span>
            <span className="font-bold text-gray-900">{codePuzzleSuccessRate}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsAndProgress;
