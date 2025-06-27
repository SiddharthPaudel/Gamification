import React, { useState, useEffect } from "react";
import { BookOpen, Trophy, RotateCcw, CheckCircle, XCircle, Star, Zap } from "lucide-react";

// Sample modules with enhanced data
const modules = {
  General: {
    icon: "🌍",
    color: "from-blue-500 to-purple-600",
    cards: [
      { front: "What is the capital of Germany?", back: "Berlin" },
      { front: "Which planet is known as the Red Planet?", back: "Mars" },
      { front: "What is the largest mammal in the world?", back: "Blue Whale" },
      { front: "In which year did World War II end?", back: "1945" },
    ]
  },
  Web: {
    icon: "💻",
    color: "from-green-500 to-teal-600",
    cards: [
      { front: "What does CSS stand for?", back: "Cascading Style Sheets" },
      { front: "What does HTML stand for?", back: "HyperText Markup Language" },
      { front: "What does API stand for?", back: "Application Programming Interface" },
      { front: "What is the default port for HTTP?", back: "80" },
    ]
  },
  Math: {
    icon: "🔢",
    color: "from-orange-500 to-red-600",
    cards: [
      { front: "What is 10 / 2?", back: "5" },
      { front: "What is the square root of 16?", back: "4" },
      { front: "What is 7 × 8?", back: "56" },
      { front: "What is 15% of 200?", back: "30" },
    ]
  },
  Science: {
    icon: "🔬",
    color: "from-purple-500 to-pink-600",
    cards: [
      { front: "What is the chemical symbol for gold?", back: "Au" },
      { front: "How many bones are in an adult human body?", back: "206" },
      { front: "What gas do plants absorb from the atmosphere?", back: "Carbon Dioxide" },
      { front: "What is the speed of light?", back: "299,792,458 m/s" },
    ]
  }
};

const FlashCard = () => {
  const [selectedModule, setSelectedModule] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [answerFeedback, setAnswerFeedback] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [animateXP, setAnimateXP] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const flashcards = selectedModule ? modules[selectedModule].cards : [];

  const handleFlip = () => setFlipped(!flipped);

  const handleSubmit = () => {
    const isCorrect =
      userAnswer.trim().toLowerCase() ===
      flashcards[currentIndex].back.trim().toLowerCase();

    setAnswerFeedback(isCorrect);
    
    if (isCorrect) {
      const points = 10 + (streak * 2);
      setXp((prev) => prev + points);
      setStreak((prev) => prev + 1);
      setCorrectAnswers((prev) => prev + 1);
      setAnimateXP(true);
      setTimeout(() => setAnimateXP(false), 600);
    } else {
      setStreak(0);
    }

    setTimeout(() => {
      setUserAnswer("");
      setFlipped(false);
      setAnswerFeedback(null);
      setShowHint(false);

      if (currentIndex + 1 < flashcards.length) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setUserAnswer("");
    setXp(0);
    setStreak(0);
    setCorrectAnswers(0);
    setFlipped(false);
    setShowResult(false);
    setSelectedModule(null);
    setAnswerFeedback(null);
    setShowHint(false);
  };

  const handleSkip = () => {
    setStreak(0);
    setUserAnswer("");
    setFlipped(false);
    setShowHint(false);
    
    if (currentIndex + 1 < flashcards.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowResult(true);
    }
  };

  const getAccuracy = () => {
    const totalAnswered = currentIndex + (showResult ? 1 : 0);
    return totalAnswered > 0 ? Math.round((correctAnswers / totalAnswered) * 100) : 0;
  };

  const current = flashcards[currentIndex];
  const progress = ((currentIndex + 1) / flashcards.length) * 100;

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && userAnswer.trim()) {
      handleSubmit();
    }
  };

  useEffect(() => {
    document.addEventListener('keypress', handleKeyPress);
    return () => document.removeEventListener('keypress', handleKeyPress);
  }, [userAnswer]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex flex-col items-center px-4 py-8">
      {/* Header Stats */}
      {selectedModule && !showResult && (
        <div className="w-full max-w-4xl mb-6">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-white">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <span className={`font-bold ${animateXP ? 'text-yellow-400 scale-110' : ''} transition-all duration-300`}>
                    {xp} XP
                  </span>
                </div>
                {streak > 0 && (
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-orange-400" />
                    <span className="font-bold text-orange-400">{streak} streak</span>
                  </div>
                )}
              </div>
              <div className="text-sm opacity-75">
                {currentIndex + 1} / {flashcards.length}
              </div>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {!selectedModule ? (
        <div className="w-full max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
              FlashCard Master
            </h1>
            <p className="text-xl text-white/80">Choose your learning adventure</p>
          </div>
          
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(modules).map(([mod, data]) => (
              <div
                key={mod}
                onClick={() => setSelectedModule(mod)}
                className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
              >
                <div className={`bg-gradient-to-br ${data.color} rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 border border-white/20`}>
                  <div className="text-center">
                    <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      {data.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{mod}</h3>
                    <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white/90 text-sm">
                      {data.cards.length} cards
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : showResult ? (
        <div className="text-center mt-20 animate-fadeIn">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-12 shadow-2xl border border-white/20">
            <Trophy className="w-24 h-24 text-yellow-400 mx-auto mb-6 animate-bounce" />
            <h2 className="text-4xl font-bold text-white mb-6">
              🎉 Amazing Work!
            </h2>
            <div className="grid grid-cols-2 gap-8 mb-8 text-white">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">{xp}</div>
                <div className="text-sm opacity-75">Total XP</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">{getAccuracy()}%</div>
                <div className="text-sm opacity-75">Accuracy</div>
              </div>
            </div>
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleRestart}
                className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <RotateCcw className="w-5 h-5" />
                Play Again
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-white mb-2 flex items-center justify-center gap-2">
              <span className="text-3xl">{modules[selectedModule].icon}</span>
              {selectedModule} Module
            </h2>
          </div>

          {/* Flashcard */}
          <div className="mb-8 perspective-1000">
            <div
              className={`relative w-full h-80 cursor-pointer transform-style-preserve-3d transition-transform duration-700 ${
                flipped ? 'rotate-y-180' : ''
              } hover:scale-105 transition-all`}
              onClick={handleFlip}
            >
              {/* Front */}
              <div className="absolute w-full h-full bg-white rounded-3xl shadow-2xl flex items-center justify-center text-center px-8 py-6 backface-hidden border-4 border-white/20">
                <div>
                  <BookOpen className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
                  <p className="text-gray-800 text-xl font-medium leading-relaxed">
                    {current.front}
                  </p>
                  <p className="text-gray-400 text-sm mt-4">Click to reveal answer</p>
                </div>
              </div>

              {/* Back */}
              <div className={`absolute w-full h-full rotate-y-180 bg-gradient-to-br ${modules[selectedModule].color} text-white rounded-3xl shadow-2xl flex items-center justify-center text-center px-8 py-6 backface-hidden border-4 border-white/20`}>
                <div>
                  <CheckCircle className="w-12 h-12 text-white mx-auto mb-4" />
                  <p className="text-2xl font-bold leading-relaxed">
                    {current.back}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Answer Section */}
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/20">
            {answerFeedback !== null ? (
              <div className={`text-center py-8 ${answerFeedback ? 'text-green-400' : 'text-red-400'}`}>
                {answerFeedback ? (
                  <>
                    <CheckCircle className="w-16 h-16 mx-auto mb-4 animate-bounce" />
                    <p className="text-2xl font-bold">Correct! 🎉</p>
                    <p className="text-lg">+{10 + (streak * 2)} XP</p>
                  </>
                ) : (
                  <>
                    <XCircle className="w-16 h-16 mx-auto mb-4" />
                    <p className="text-2xl font-bold">Not quite right</p>
                    <p className="text-lg text-white/70">The answer was: {current.back}</p>
                  </>
                )}
              </div>
            ) : (
              <>
                <p className="text-lg text-white mb-6 text-center">What's your answer?</p>
                <div className="space-y-4">
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    className="w-full px-6 py-4 text-lg border-2 border-white/20 rounded-2xl focus:outline-none focus:border-white/50 bg-white/10 text-white placeholder-white/50 backdrop-blur-sm"
                    placeholder="Type your answer..."
                    autoFocus
                  />
                  <div className="flex gap-4">
                    <button
                      onClick={handleSubmit}
                      disabled={!userAnswer.trim()}
                      className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-6 rounded-2xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-semibold text-lg"
                    >
                      Submit Answer
                    </button>
                    <button
                      onClick={() => setShowHint(!showHint)}
                      className="px-6 py-4 bg-white/10 text-white rounded-2xl hover:bg-white/20 transition-all duration-300 backdrop-blur-sm"
                    >
                      💡 Hint
                    </button>
                    <button
                      onClick={handleSkip}
                      className="px-6 py-4 bg-white/10 text-white rounded-2xl hover:bg-white/20 transition-all duration-300 backdrop-blur-sm"
                    >
                      Skip
                    </button>
                  </div>
                  {showHint && (
                    <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-2xl p-4 text-yellow-200 animate-fadeIn">
                      <p className="text-sm">💡 First letter: <span className="font-bold">{current.back.charAt(0)}</span></p>
                    </div>
                  )}
                  <p className="text-center text-white/60 text-sm">Press Enter to submit</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashCard;