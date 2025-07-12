import React from "react";
import { Trophy, Sparkles, Zap, TrendingUp, Clock, Award, RotateCcw } from "lucide-react";

const FlashcardResult = ({ xp, accuracy, correctAnswers, timeElapsed, onRestart }) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="text-center mt-20 animate-fadeIn">
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/20 max-w-2xl mx-auto">
        <div className="relative">
          <Trophy className="w-32 h-32 text-yellow-400 mx-auto mb-6 animate-bounce" />
          <div className="absolute -top-4 -right-4 animate-spin">
            <Sparkles className="w-8 h-8 text-yellow-300" />
          </div>
        </div>

        <h2 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-6">
          🎉 Fantastic Work!
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <StatCard icon={<Zap />} value={xp} label="XP Earned" color="from-yellow-500 to-orange-600" />
          <StatCard icon={<TrendingUp />} value={`${accuracy}%`} label="Accuracy" color="from-green-500 to-emerald-600" />
          <StatCard icon={<Clock />} value={formatTime(timeElapsed)} label="Time" color="from-blue-500 to-cyan-600" />
          <StatCard icon={<Award />} value={correctAnswers} label="Correct" color="from-purple-500 to-pink-600" />
        </div>

        <button
          onClick={onRestart}
          className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <RotateCcw className="w-5 h-5" />
          Play Again
        </button>
      </div>
    </div>
  );
};

const StatCard = ({ icon, value, label, color }) => (
  <div className={`bg-gradient-to-br ${color} rounded-2xl p-4 text-white`}>
    <div className="w-8 h-8 mx-auto mb-2">{icon}</div>
    <div className="text-2xl font-bold">{value}</div>
    <div className="text-sm opacity-90">{label}</div>
  </div>
);

export default FlashcardResult;
