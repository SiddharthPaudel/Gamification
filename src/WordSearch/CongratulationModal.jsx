import React, { useState, useEffect } from "react";
import { Trophy, RefreshCw, X } from "lucide-react";

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

const PufferCelebration = () => {
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    // Create confetti pieces similar to Duolingo style
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd', '#98d8c8', '#f7dc6f', '#ff9ff3', '#54a0ff'];
    const shapes = ['▪', '▫', '●', '◯', '◆', '◇', '▲', '△', '★', '✦'];
    
    const newConfetti = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: -10,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      size: Math.random() * 8 + 6, // Between 6px and 14px
      rotation: Math.random() * 360,
      animationDelay: Math.random() * 2,
      animationDuration: Math.random() * 3 + 3, // Between 3 and 6 seconds
      horizontalDrift: (Math.random() - 0.5) * 300, // Random horizontal movement
    }));
    setConfetti(newConfetti);
  }, []);

  return (
    <>
      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(-100px) translateX(0px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) translateX(var(--drift)) rotate(720deg);
            opacity: 0;
          }
        }
        
        .confetti-piece {
          animation: confetti-fall ease-in infinite;
        }
      `}</style>
      
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {confetti.map((piece) => (
          <div
            key={piece.id}
            className="absolute confetti-piece"
            style={{
              left: `${piece.left}%`,
              top: `${piece.top}px`,
              '--drift': `${piece.horizontalDrift}px`,
              color: piece.color,
              fontSize: `${piece.size}px`,
              transform: `rotate(${piece.rotation}deg)`,
              animationDelay: `${piece.animationDelay}s`,
              animationDuration: `${piece.animationDuration}s`,
            }}
          >
            {piece.shape}
          </div>
        ))}
      </div>
    </>
  );
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
    <>
      <style jsx>{`
        @keyframes bounce-in {
          0% {
            transform: scale(0) rotate(0deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.1) rotate(180deg);
            opacity: 1;
          }
          100% {
            transform: scale(1) rotate(360deg);
            opacity: 1;
          }
        }
        
        .animate-bounce-in {
          animation: bounce-in 0.8s ease-out;
        }
      `}</style>
      
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        {/* Puffer Fish Celebration */}
        <PufferCelebration />
        
        <div className="bg-gradient-to-br from-green-600 to-green-700 p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 relative animate-bounce-in">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors z-10"
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
    </>
  );
};

export default CongratulationsModal;