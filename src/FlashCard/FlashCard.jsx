import React, { useState, useEffect } from "react";
import axios from "axios";
import stringSimilarity from "string-similarity"; // Added for fuzzy matching
import {
  BookOpen,
  Trophy,
  RotateCcw,
  CheckCircle,
  XCircle,
  Star,
  Zap,
  Heart,
  Target,
  Award,
  Sparkles,
  ArrowLeft,
  Brain,
  Clock,
  TrendingUp,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../AuthContext/AuthContext"; // Adjust path as needed

const FlashCard = () => {
  const [modules, setModules] = useState({});
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
  const [attempts, setAttempts] = useState([]);
  const [attemptSent, setAttemptSent] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [confettiActive, setConfettiActive] = useState(false);

  const { user, updateUserProfile } = useAuth();

  // Timer effect
  useEffect(() => {
    let interval;
    if (selectedModule && !showResult && sessionStartTime) {
      interval = setInterval(() => {
        setTimeElapsed(Math.floor((Date.now() - sessionStartTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [selectedModule, showResult, sessionStartTime]);

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/flashcards/all");
        const sets = res.data;

        const groupedModules = {};
        sets.forEach((set) => {
          const moduleTitle = set.module?.title || "Untitled";

          if (!groupedModules[moduleTitle]) {
            groupedModules[moduleTitle] = {
              icon: getModuleIcon(moduleTitle),
              color: getModuleColor(moduleTitle),
              cards: [],
              setId: set._id,
              description: getModuleDescription(moduleTitle),
              difficulty: getModuleDifficulty(moduleTitle),
            };
          }

          groupedModules[moduleTitle].cards.push(...set.cards);
        });

        setModules(groupedModules);
      } catch (err) {
        console.error("Failed to fetch flashcards", err);
      }
    };

    fetchFlashcards();
  }, []);

  const getModuleIcon = (title) => {
    if (title.toLowerCase().includes("math")) return "🔢";
    if (title.toLowerCase().includes("science")) return "🔬";
    if (title.toLowerCase().includes("web")) return "💻";
    if (title.toLowerCase().includes("general")) return "🌍";
    return "📚";
  };

  const getModuleColor = (title) => {
    if (title.toLowerCase().includes("math"))
      return "from-orange-500 via-red-500 to-pink-600";
    if (title.toLowerCase().includes("science"))
      return "from-purple-500 via-violet-500 to-indigo-600";
    if (title.toLowerCase().includes("web"))
      return "from-green-500 via-teal-500 to-cyan-600";
    if (title.toLowerCase().includes("general"))
      return "from-blue-500 via-purple-500 to-indigo-600";
    return "from-blue-400 via-cyan-400 to-teal-600";
  };

  const getModuleDescription = (title) => {
    if (title.toLowerCase().includes("math")) return "Master mathematical concepts";
    if (title.toLowerCase().includes("science")) return "Explore scientific principles";
    if (title.toLowerCase().includes("web")) return "Learn web development";
    if (title.toLowerCase().includes("general")) return "Expand general knowledge";
    return "Enhance your learning";
  };

  const getModuleDifficulty = (title) => {
    if (title.toLowerCase().includes("math")) return "Advanced";
    if (title.toLowerCase().includes("science")) return "Intermediate";
    if (title.toLowerCase().includes("web")) return "Beginner";
    if (title.toLowerCase().includes("general")) return "Mixed";
    return "Beginner";
  };

  const flashcards = selectedModule ? modules[selectedModule]?.cards || [] : [];

  const handleFlip = () => setFlipped(!flipped);

  // Normalize text function for better comparison
  const normalizeText = (text) => {
    return text
      .toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
      .replace(/\s{2,}/g, " ")
      .trim();
  };

  const handleSubmit = () => {
    if (!flashcards[currentIndex]) return;

    const correctAnswer = normalizeText(flashcards[currentIndex].back);
    const userAns = normalizeText(userAnswer);

    const similarity = stringSimilarity.compareTwoStrings(userAns, correctAnswer);
    const THRESHOLD = 0.7; // Accept answers with 70%+ similarity

    const isCorrect = similarity >= THRESHOLD;
    setAnswerFeedback(isCorrect);

    setAttempts((prev) => [
      ...prev,
      { front: flashcards[currentIndex].front, userAnswer },
    ]);

    if (isCorrect) {
      const points = 5;
      setXp((prev) => prev + points);
      setStreak((prev) => prev + 1);
      setCorrectAnswers((prev) => prev + 1);
      setAnimateXP(true);

      // Trigger confetti for streak milestones
      if ((streak + 1) % 5 === 0) {
        setConfettiActive(true);
        setTimeout(() => setConfettiActive(false), 3000);
      }

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

  useEffect(() => {
    if (showResult && selectedModule && attempts.length > 0 && !attemptSent) {
      const sendAttemptData = async () => {
        try {
          const setId = modules[selectedModule].setId;
          const response = await axios.post(
            `http://localhost:5000/api/flashcards/attempt/${user.id}/${setId}`,
            { attempts }
          );

          const data = response.data;

          updateUserProfile({
  ...user,
  xp: (user.xp || 0) + (data.xpEarned || 0),
  level: data.newLevel ?? user.level,
  badges: data.badges ?? user.badges,
  gameProgress: {
    ...user.gameProgress,
    flashcards: {
      totalPlayed:
        (user.gameProgress.flashcards?.totalPlayed || 0) +
        (data.totalQuestions || 0),
      totalCorrect:
        (user.gameProgress.flashcards?.totalCorrect || 0) +
        (data.correctAnswers || 0),
    },
  },
});

          toast.success("XP and badges updated!");
          setAttemptSent(true);
        } catch (error) {
          console.error("Failed to send flashcard attempts:", error);
          toast.error("Failed to update XP and badges.");
        }
      };

      sendAttemptData();
    }
  }, [showResult, selectedModule, attempts, modules, updateUserProfile, user, attemptSent]);

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
    setAttempts([]);
    setAttemptSent(false);
    setTimeElapsed(0);
    setSessionStartTime(null);
  };

  const handleSkip = () => {
    setStreak(0);
    setUserAnswer("");
    setFlipped(false);
    setShowHint(false);
    setAttempts(prev => [...prev, { front: flashcards[currentIndex]?.front, userAnswer: "" }]);

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

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const current = flashcards[currentIndex];
  const progress = ((currentIndex + 1) / flashcards.length) * 100;

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && userAnswer.trim()) {
      handleSubmit();
    }
  };

 const handleModuleSelect = async (mod) => {
  try {
    const res = await axios.get("http://localhost:5000/api/flashcards/all");
    const sets = res.data;

    const groupedModules = {};
    sets.forEach((set) => {
      const moduleTitle = set.module?.title || "Untitled";

      if (!groupedModules[moduleTitle]) {
        groupedModules[moduleTitle] = {
          icon: getModuleIcon(moduleTitle),
          color: getModuleColor(moduleTitle),
          cards: [],
          setId: set._id,
          description: getModuleDescription(moduleTitle),
          difficulty: getModuleDifficulty(moduleTitle),
        };
      }

      groupedModules[moduleTitle].cards.push(...set.cards);
    });

    setModules(groupedModules);
    setSelectedModule(mod);
    setSessionStartTime(Date.now());
  } catch (err) {
    console.error("Failed to refresh flashcards before starting", err);
  }
};


  useEffect(() => {
    document.addEventListener('keypress', handleKeyPress);
    return () => document.removeEventListener('keypress', handleKeyPress);
  }, [userAnswer]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Confetti Effect */}
      {confettiActive && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 2}s`
              }}
            >
              🎉
            </div>
          ))}
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center px-4 py-8">
        {/* Progress Bar and Stats */}
        {selectedModule && !showResult && (
          <div className="w-full max-w-5xl mb-8">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full px-4 py-2">
                    <Zap className="w-5 h-5 text-white" />
                    <span className={`font-bold text-white ${animateXP ? 'scale-110' : ''} transition-all duration-300`}>
                      {xp} XP
                    </span>
                  </div>
                  
                  {streak > 0 && (
                    <div className="flex items-center gap-2 bg-gradient-to-r from-orange-400 to-red-500 rounded-full px-4 py-2">
                      <Star className="w-5 h-5 text-white" />
                      <span className="font-bold text-white">{streak} 🔥</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full px-4 py-2">
                    <Clock className="w-5 h-5 text-white" />
                    <span className="font-bold text-white">{formatTime(timeElapsed)}</span>
                  </div>
                </div>
                
                <div className="text-white/90 font-semibold">
                  {currentIndex + 1} / {flashcards.length}
                </div>
              </div>
              
              <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 h-3 rounded-full transition-all duration-700 ease-out relative"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
                </div>
              </div>
              
              <div className="flex justify-between mt-2 text-sm text-white/70">
                <span>Progress: {Math.round(progress)}%</span>
                <span>Accuracy: {getAccuracy()}%</span>
              </div>
            </div>
          </div>
        )}

        {!selectedModule ? (
          <div className="w-full max-w-7xl">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-4 mb-6">
                <Brain className="w-16 h-16 text-purple-400 animate-pulse" />
                <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                  FlashCard Master
                </h1>
                <Sparkles className="w-16 h-16 text-yellow-400 animate-spin" />
              </div>
              <p className="text-2xl text-white/80 mb-4">Choose your learning adventure</p>
              <p className="text-lg text-white/60">Master new concepts with interactive flashcards</p>
            </div>
            
            <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Object.entries(modules).map(([mod, data]) => (
                <div
                  key={mod}
                  onClick={() => handleModuleSelect(mod)}
                  className="group cursor-pointer transform hover:scale-105 transition-all duration-500 hover:rotate-1"
                >
                  <div className={`relative bg-gradient-to-br ${data.color} rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 border border-white/20 overflow-hidden`}>
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    
                    <div className="relative z-10 text-center">
                      <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300 animate-bounce">
                        {data.icon}
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">{mod}</h3>
                      <p className="text-white/80 text-sm mb-4">{data.description}</p>
                      
                      <div className="flex justify-between items-center mb-4">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-white/90 text-sm">
                          {data.cards.length} cards
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-white/90 text-sm">
                          {data.difficulty}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-center gap-2 text-white/60 text-sm">
                        <Target className="w-4 h-4" />
                        <span>Start Learning</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : showResult ? (
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
                <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl p-4 text-white">
                  <Zap className="w-8 h-8 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{xp}</div>
                  <div className="text-sm opacity-90">XP Earned</div>
                </div>
                
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-4 text-white">
                  <TrendingUp className="w-8 h-8 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{getAccuracy()}%</div>
                  <div className="text-sm opacity-90">Accuracy</div>
                </div>
                
                <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-4 text-white">
                  <Clock className="w-8 h-8 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{formatTime(timeElapsed)}</div>
                  <div className="text-sm opacity-90">Time</div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-4 text-white">
                  <Award className="w-8 h-8 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{correctAnswers}</div>
                  <div className="text-sm opacity-90">Correct</div>
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
          <div className="w-full max-w-3xl">
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={() => setSelectedModule(null)}
                className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Modules
              </button>
              
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
                  <span className="text-4xl">{modules[selectedModule]?.icon}</span>
                  {selectedModule}
                </h2>
                <p className="text-white/70">{modules[selectedModule]?.description}</p>
              </div>
              
              <div className="w-16"></div>
            </div>

            {/* Flashcard */}
            <div className="mb-8 perspective-1000">
              <div
                className={`relative w-full h-96 cursor-pointer transform-style-preserve-3d transition-all duration-700 ${flipped ? 'rotate-y-180' : ''} hover:scale-[1.02] group`}
                onClick={handleFlip}
              >
                {/* Front */}
                <div className="absolute w-full h-full bg-gradient-to-br from-white via-gray-50 to-white rounded-3xl shadow-2xl flex items-center justify-center text-center px-8 py-6 backface-hidden border border-gray-200 group-hover:shadow-3xl transition-shadow duration-300">
                  <div>
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                      <BookOpen className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-gray-800 text-2xl font-medium leading-relaxed mb-6">
                      {current?.front}
                    </p>
                    <div className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 text-gray-600 text-sm">
                      <span>Click to reveal answer</span>
                      <div className="animate-pulse">👆</div>
                    </div>
                  </div>
                </div>

                {/* Back */}
                <div className={`absolute w-full h-full rotate-y-180 bg-gradient-to-br ${modules[selectedModule]?.color} text-white rounded-3xl shadow-2xl flex items-center justify-center text-center px-8 py-6 backface-hidden border border-white/20 group-hover:shadow-3xl transition-shadow duration-300`}>
                  <div>
                    <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-3xl font-bold leading-relaxed mb-4">
                      {current?.back}
                    </p>
                    <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 text-white/90 text-sm">
                      <span>This is the answer!</span>
                      <span>✨</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Answer Input */}
            <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20">
              {answerFeedback !== null ? (
                <div className={`text-center py-8 ${answerFeedback ? 'text-green-400' : 'text-red-400'}`}>
                  {answerFeedback ? (
                    <div className="animate-fadeIn">
                      <div className="relative">
                        <CheckCircle className="w-20 h-20 mx-auto mb-4 animate-bounce" />
                        <div className="absolute -top-2 -right-2 animate-spin">
                          <Sparkles className="w-6 h-6 text-yellow-400" />
                        </div>
                      </div>
                      <p className="text-3xl font-bold mb-2">Perfect! 🎉</p>
                      <p className="text-xl text-green-300">+5 XP earned</p>
                      {streak > 1 && (
                        <p className="text-lg text-orange-300 mt-2">🔥 {streak} streak!</p>
                      )}
                    </div>
                  ) : (
                    <div className="animate-fadeIn">
                      <XCircle className="w-20 h-20 mx-auto mb-4 animate-pulse" />
                      <p className="text-3xl font-bold mb-2">Not quite right</p>
                      <p className="text-xl text-white/70 mb-2">The answer was:</p>
                      <p className="text-2xl font-bold text-white bg-white/10 rounded-xl p-3 inline-block">
                        {current?.back}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <div className="text-center mb-6">
                    <p className="text-2xl text-white mb-2">What's your answer?</p>
                    <p className="text-white/60">Type your response below</p>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="relative">
                      <input
                        type="text"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        className="w-full px-8 py-6 text-xl border-2 border-white/20 rounded-2xl focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20 bg-white/10 text-white placeholder-white/50 backdrop-blur-sm transition-all duration-300"
                        placeholder="Type your answer here..."
                        autoFocus
                      />
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/40">
                        ⏎
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button
                        onClick={handleSubmit}
                        disabled={!userAnswer.trim()}
                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-semibold text-lg flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-5 h-5" />
                        Submit Answer
                      </button>
                      
                      <button
                        onClick={() => setShowHint(!showHint)}
                        className="px-6 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-2xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
                      >
                        💡 Hint
                      </button>
                      
                      <button
                        onClick={handleSkip}
                        className="px-6 py-4 bg-white/10 text-white rounded-2xl hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/20 hover:border-white/40 flex items-center justify-center gap-2"
                      >
                        ⏭️ Skip
                      </button>
                    </div>
                    
                    {showHint && (
                      <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-2xl p-6 text-yellow-200 animate-fadeIn">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="bg-yellow-500/20 rounded-full p-2">
                            💡
                          </div>
                          <span className="font-semibold">Hint</span>
                        </div>
                        <p className="text-lg">
                          First letter: <span className="font-bold text-yellow-100 text-xl bg-yellow-500/20 px-2 py-1 rounded">{current?.back.charAt(0)}</span>
                        </p>
                      </div>
                    )}
                    
                    <div className="text-center">
                      <p className="text-white/60 text-sm flex items-center justify-center gap-2">
                        <span>Press Enter to submit</span>
                        <kbd className="bg-white/10 px-2 py-1 rounded text-xs">⏎</kbd>
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlashCard;