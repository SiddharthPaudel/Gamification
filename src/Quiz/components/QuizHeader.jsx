// components/QuizHeader.js
import React from 'react';
import { ArrowLeft, Timer, Zap, Star } from 'lucide-react';

const formatTime = (seconds) => {
  return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, "0")}`;
};

const QuizHeader = ({ 
  onBack, 
  totalXP, 
  streak, 
  timeLeft, 
  activeModule, 
  currentQuestion, 
  totalQuestions,
  animateScore 
}) => {
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8 text-white">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Modules
        </button>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Zap
              className={`w-5 h-5 ${
                animateScore ? "text-yellow-400 scale-110" : "text-yellow-400"
              } transition-all duration-300`}
            />
            <span
              className={`font-bold ${
                animateScore ? "text-yellow-400 scale-110" : "text-yellow-400"
              } transition-all duration-300`}
            >
              {totalXP} XP
            </span>
          </div>
          {streak > 0 && (
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-orange-400" />
              <span className="font-bold text-orange-400">{streak} streak</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Timer
              className={`w-5 h-5 ${
                timeLeft <= 10 ? "text-red-400" : "text-blue-400"
              }`}
            />
            <span className={`font-bold ${timeLeft <= 10 ? "text-red-400" : ""}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <span className="text-3xl">{activeModule.emoji || "❓"}</span>
          {activeModule.title}
        </h2>
        <span className="text-white/70">
          Question {currentQuestion + 1} of {totalQuestions}
        </span>
      </div>

      <div className="w-full bg-white/20 rounded-full h-3">
        <div
          className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default QuizHeader;
