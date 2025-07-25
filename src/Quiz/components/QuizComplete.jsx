import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import OwlMascot from '../../OwlMascot/OwlMascot'; // Adjust path if needed

const ConfettiCelebration = () => {
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

const QuizComplete = ({ totalXP, answers, onBack, getAccuracy }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 px-6 py-12 flex flex-col items-center justify-center relative">
      
      {/* Confetti Celebration */}
      <ConfettiCelebration />
      
      {/* Mascot Container */}
      <div className="w-36 h-36 drop-shadow-xl animate-bounce mb-4">
        <OwlMascot 
          isInCongrats 
          size={100} 
          showMessage={true} 
          message="You Did It!🎉"
          position="relative"
          positionProps={{ top: 100, left: 30 }}
        />
      </div>

      {/* Heading */}
      <h2 className="text-4xl font-extrabold text-white mb-4 text-center tracking-wide drop-shadow-md leading-tight">
        Quiz Complete!
      </h2>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-10 mb-8 text-white max-w-md w-full">
        <div className="text-center">
          <div className="text-4xl font-bold text-yellow-400 drop-shadow-lg">{totalXP}</div>
          <div className="text-sm opacity-80 uppercase tracking-wider">Total XP</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold text-green-400 drop-shadow-lg">{getAccuracy()}%</div>
          <div className="text-sm opacity-80 uppercase tracking-wider">Accuracy</div>
        </div>
      </div>

      {/* Performance Breakdown */}
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 mb-10 max-w-md w-full shadow-lg border border-white/20">
        <h3 className="text-white font-semibold mb-5 text-center text-lg tracking-wide">
          Performance Breakdown
        </h3>
        <div className="space-y-4 text-sm text-white/90">
          {answers.map((answer, index) => (
            <div key={index} className="flex justify-between items-center border-b border-white/20 pb-2 last:border-none">
              <span className="font-medium">Question {index + 1}</span>
              <div className="flex items-center gap-3">
                {answer.isCorrect ? (
                  <CheckCircle className="w-5 h-5 text-green-400 drop-shadow-md" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-400 drop-shadow-md" />
                )}
                <span className="font-semibold">{totalXP} XP</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-3xl font-semibold shadow-lg hover:from-purple-700 hover:to-pink-700 transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-500"
        aria-label="Choose New Quiz"
      >
        <ArrowLeft className="w-6 h-6" />
        Choose New Quiz
      </button>
    </div>
  );
};

export default QuizComplete;