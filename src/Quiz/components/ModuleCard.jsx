// components/ModuleCard.js
import React from 'react';

const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case "Easy":
      return "text-green-600 bg-green-100";
    case "Medium":
      return "text-yellow-600 bg-yellow-100";
    case "Hard":
      return "text-red-600 bg-red-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
};

const ModuleCard = ({ module, onClick }) => {
  return (
    <div
      className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
      onClick={() => onClick(module)}
    >
      <div className="rounded-3xl p-8 shadow-2xl transition-all duration-300 border border-white/20 relative overflow-hidden bg-white/10">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full" />
        <div className="relative">
          <div className="flex justify-between items-start mb-4">
            <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
              {module.emoji || "❓"}
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(
                module.difficulty
              )}`}
            >
              {module.difficulty || "Unknown"}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">{module.title}</h3>
          <p className="text-white/80 text-sm mb-4">Click to start quiz</p>
          <div className="flex justify-between items-center text-white/70 text-sm">
            <span>Varied questions</span>
            <span>30s each</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleCard;
