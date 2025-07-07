import React from "react";
import { Trophy, RefreshCw, X } from "lucide-react";

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

const CongratulationsModal = ({ 
  isVisible, 
  xpEarned, 
  timeElapsed, 
  onPlayAgain, 
  onClose 
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-green-600 to-green-700 p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 relative animate-bounce-in">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Trophy animation */}
        <div className="text-center mb-6">
          <Trophy className="mx-auto w-16 h-16 text-yellow-400 animate-bounce mb-4" />
          <h2 className="text-3xl font-bold text-white mb-2">
            🎉 Congratulations! 🎉
          </h2>
          <p className="text-green-100 text-lg">
            You found all the words!
          </p>
        </div>

        {/* Stats */}
        <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-6 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-green-100">XP Earned:</span>
            <span className="text-white font-bold text-xl">+{xpEarned}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-green-100">Time Taken:</span>
            <span className="text-white font-bold">{formatTime(timeElapsed)}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={onPlayAgain}
            className="flex-1 bg-white text-green-700 font-bold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Play Again
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-green-800 text-white font-bold px-6 py-3 rounded-lg hover:bg-green-900 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CongratulationsModal;
