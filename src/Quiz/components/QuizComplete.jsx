import React from 'react';
import { Trophy, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';

const QuizComplete = ({ totalXP, answers, onBack, getAccuracy }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 px-4 py-8 flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-12 shadow-2xl border border-white/20 max-w-2xl w-full text-center">
        <Trophy className="w-24 h-24 text-yellow-400 mx-auto mb-6 animate-bounce" />
        <h2 className="text-4xl font-bold text-white mb-6">Quiz Complete! 🎉</h2>

        <div className="grid grid-cols-2 gap-8 mb-8 text-white">
          <div className="text-center">
            <div className="text-4xl font-bold text-yellow-400">{totalXP}</div>
            <div className="text-sm opacity-75">Total XP</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-400">{getAccuracy()}%</div>
            <div className="text-sm opacity-75">Accuracy</div>
          </div>
        </div>

        <div className="bg-white/5 rounded-2xl p-6 mb-8">
          <h3 className="text-white font-semibold mb-4">Performance Breakdown</h3>
          <div className="space-y-3 text-sm text-white/80">
            {answers.map((answer, index) => (
              <div key={index} className="flex justify-between items-center">
                <span>Question {index + 1}</span>
                <div className="flex items-center gap-2">
                  {answer.isCorrect ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-400" />
                  )}
                  <span>{totalXP} XP</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5" />
            Choose New Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizComplete;