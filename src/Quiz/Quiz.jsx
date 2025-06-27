import React, { useState, useEffect } from "react";
import {
  BookOpenCheck,
  Globe,
  Calculator,
  Code,
  ArrowLeft,
  Trophy,
  Target,
  Clock,
  Zap,
  CheckCircle,
  XCircle,
  Star,
  Award,
  Brain,
  Timer,
  RotateCcw
} from "lucide-react";

const quizModules = [
  {
    id: 1,
    title: "General Knowledge",
    icon: Globe,
    gradient: "from-yellow-400 to-orange-500",
    bgColor: "bg-yellow-50",
    emoji: "🌍",
    description: "Test your worldly wisdom",
    difficulty: "Easy",
    questions: [
      {
        question: "What is the capital of France?",
        options: ["Paris", "Rome", "Berlin", "Madrid"],
        correctAnswer: 0,
        explanation: "Paris has been the capital of France since 987 AD!"
      },
      {
        question: "Which ocean is the largest?",
        options: ["Atlantic", "Indian", "Pacific", "Arctic"],
        correctAnswer: 2,
        explanation: "The Pacific Ocean covers about 46% of the world's water surface!"
      },
      {
        question: "Who painted the Mona Lisa?",
        options: ["Vincent van Gogh", "Leonardo da Vinci", "Pablo Picasso", "Michelangelo"],
        correctAnswer: 1,
        explanation: "Leonardo da Vinci painted this masterpiece between 1503-1519!"
      },
      {
        question: "What is the largest continent?",
        options: ["Africa", "North America", "Asia", "Europe"],
        correctAnswer: 2,
        explanation: "Asia covers about 30% of Earth's total surface area!"
      }
    ],
  },
  {
    id: 2,
    title: "Mathematics",
    icon: Calculator,
    gradient: "from-green-400 to-emerald-500",
    bgColor: "bg-green-50",
    emoji: "🔢",
    description: "Challenge your number skills",
    difficulty: "Medium",
    questions: [
      {
        question: "What is 12 × 8?",
        options: ["96", "88", "108", "112"],
        correctAnswer: 0,
        explanation: "12 × 8 = 96. Remember: 12 × 8 = (10 × 8) + (2 × 8) = 80 + 16 = 96!"
      },
      {
        question: "What is the square root of 144?",
        options: ["12", "14", "10", "16"],
        correctAnswer: 0,
        explanation: "√144 = 12, because 12 × 12 = 144!"
      },
      {
        question: "What is 15% of 200?",
        options: ["25", "30", "35", "40"],
        correctAnswer: 1,
        explanation: "15% of 200 = 0.15 × 200 = 30!"
      },
      {
        question: "If a triangle has angles of 60°, 60°, what's the third angle?",
        options: ["45°", "90°", "60°", "120°"],
        correctAnswer: 2,
        explanation: "In any triangle, all angles sum to 180°. So 180° - 60° - 60° = 60°!"
      }
    ],
  },
  {
    id: 3,
    title: "Science",
    icon: BookOpenCheck,
    gradient: "from-blue-400 to-indigo-500",
    bgColor: "bg-blue-50",
    emoji: "🔬",
    description: "Explore the wonders of science",
    difficulty: "Medium",
    questions: [
      {
        question: "What planet is known as the Red Planet?",
        options: ["Mars", "Venus", "Jupiter", "Saturn"],
        correctAnswer: 0,
        explanation: "Mars appears red due to iron oxide (rust) on its surface!"
      },
      {
        question: "What gas do plants absorb during photosynthesis?",
        options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
        correctAnswer: 2,
        explanation: "Plants absorb CO₂ and release oxygen during photosynthesis!"
      },
      {
        question: "How many bones are in an adult human body?",
        options: ["196", "206", "216", "226"],
        correctAnswer: 1,
        explanation: "An adult human has 206 bones, while babies are born with about 270!"
      },
      {
        question: "What is the chemical symbol for gold?",
        options: ["Go", "Gd", "Au", "Ag"],
        correctAnswer: 2,
        explanation: "Au comes from the Latin word 'aurum' meaning gold!"
      }
    ],
  },
  {
    id: 4,
    title: "Programming",
    icon: Code,
    gradient: "from-purple-400 to-pink-500",
    bgColor: "bg-purple-50",
    emoji: "💻",
    description: "Code your way to victory",
    difficulty: "Hard",
    questions: [
      {
        question: "Which language runs natively in web browsers?",
        options: ["Python", "Java", "C++", "JavaScript"],
        correctAnswer: 3,
        explanation: "JavaScript is the only language that runs natively in all web browsers!"
      },
      {
        question: "What does HTML stand for?",
        options: [
          "Hyper Text Markup Language",
          "Hot Mail",
          "How to Make Links",
          "Home Tool Markup Language",
        ],
        correctAnswer: 0,
        explanation: "HTML is the standard markup language for creating web pages!"
      },
      {
        question: "What does CSS stand for?",
        options: [
          "Computer Style Sheets",
          "Cascading Style Sheets",
          "Creative Style System",
          "Code Style Standard"
        ],
        correctAnswer: 1,
        explanation: "CSS controls the presentation and styling of web pages!"
      },
      {
        question: "Which of these is NOT a JavaScript framework?",
        options: ["React", "Angular", "Django", "Vue"],
        correctAnswer: 2,
        explanation: "Django is a Python web framework, not JavaScript!"
      }
    ],
  },
];

const Quiz = () => {
  const [activeModule, setActiveModule] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [streak, setStreak] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [animateScore, setAnimateScore] = useState(false);

  useEffect(() => {
    let timer;
    if (activeModule && !quizCompleted && !showResult && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && !showResult) {
      handleTimeUp();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, activeModule, quizCompleted, showResult]);

  const handleModuleClick = (module) => {
    setActiveModule(module);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setTimeLeft(30);
    setQuizCompleted(false);
    setAnswers([]);
    setShowExplanation(false);
    setStreak(0);
    setTotalXP(0);
  };

  const handleTimeUp = () => {
    if (selectedAnswer === null) {
      setSelectedAnswer(-1); // Mark as timeout
    }
    handleAnswerSubmit();
  };

  const handleAnswerClick = (answerIndex) => {
    if (!showResult) {
      setSelectedAnswer(answerIndex);
    }
  };

  const handleAnswerSubmit = () => {
    const currentQ = activeModule.questions[currentQuestion];
    const isCorrect = selectedAnswer === currentQ.correctAnswer;
    const timeBonus = Math.floor(timeLeft / 5);
    
    if (isCorrect) {
      const points = 100 + timeBonus + (streak * 10);
      setScore(prev => prev + points);
      setTotalXP(prev => prev + points);
      setStreak(prev => prev + 1);
      setAnimateScore(true);
      setTimeout(() => setAnimateScore(false), 600);
    } else {
      setStreak(0);
    }

    setAnswers(prev => [...prev, {
      questionIndex: currentQuestion,
      selectedAnswer,
      isCorrect,
      timeLeft,
      points: isCorrect ? 100 + timeBonus + (streak * 10) : 0
    }]);

    setShowResult(true);
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion + 1 < activeModule.questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setShowExplanation(false);
      setTimeLeft(30);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleBack = () => {
    setActiveModule(null);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setQuizCompleted(false);
  };

  const getAccuracy = () => {
    if (answers.length === 0) return 0;
    const correct = answers.filter(a => a.isCorrect).length;
    return Math.round((correct / answers.length) * 100);
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTime = (seconds) => {
    return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  if (!activeModule) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
              Quiz Arena 🧠
            </h1>
            <p className="text-xl text-white/80 mb-2">
              Challenge your knowledge and earn XP!
            </p>
            <div className="flex justify-center items-center gap-4 text-white/60">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                <span>Timed Questions</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                <span>XP Rewards</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                <span>Streak Bonuses</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {quizModules.map((module) => (
              <div
                key={module.id}
                className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
                onClick={() => handleModuleClick(module)}
              >
                <div className={`bg-gradient-to-br ${module.gradient} rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 border border-white/20 relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full" />
                  <div className="relative">
                    <div className="flex justify-between items-start mb-4">
                      <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                        {module.emoji}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(module.difficulty)}`}>
                        {module.difficulty}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{module.title}</h3>
                    <p className="text-white/80 text-sm mb-4">{module.description}</p>
                    <div className="flex justify-between items-center text-white/70 text-sm">
                      <span>{module.questions.length} questions</span>
                      <span>30s each</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (quizCompleted) {
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
                    <span>{answer.points} XP</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => handleModuleClick(activeModule)}
              className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-2xl hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <RotateCcw className="w-5 h-5" />
              Retry Quiz
            </button>
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <ArrowLeft className="w-5 h-5" />
              Choose New Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = activeModule.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / activeModule.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8 text-white">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Modules
            </button>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span className={`font-bold ${animateScore ? 'text-yellow-400 scale-110' : ''} transition-all duration-300`}>
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
                <Timer className={`w-5 h-5 ${timeLeft <= 10 ? 'text-red-400' : 'text-blue-400'}`} />
                <span className={`font-bold ${timeLeft <= 10 ? 'text-red-400' : ''}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <span className="text-3xl">{activeModule.emoji}</span>
              {activeModule.title}
            </h2>
            <span className="text-white/70">
              Question {currentQuestion + 1} of {activeModule.questions.length}
            </span>
          </div>
          
          <div className="w-full bg-white/20 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20 mb-8">
          <div className="text-center mb-8">
            <Brain className="w-12 h-12 text-white mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">
              {currentQ.question}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {currentQ.options.map((option, index) => {
              let buttonClass = "p-6 rounded-2xl text-left transition-all duration-300 transform hover:scale-105 border-2 ";
              
              if (!showResult) {
                buttonClass += selectedAnswer === index 
                  ? "bg-blue-500 text-white border-blue-400 shadow-lg" 
                  : "bg-white/10 text-white border-white/20 hover:bg-white/20 hover:border-white/40";
              } else {
                if (index === currentQ.correctAnswer) {
                  buttonClass += "bg-green-500 text-white border-green-400 shadow-lg";
                } else if (selectedAnswer === index && selectedAnswer !== currentQ.correctAnswer) {
                  buttonClass += "bg-red-500 text-white border-red-400 shadow-lg";
                } else {
                  buttonClass += "bg-white/10 text-white/60 border-white/20";
                }
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerClick(index)}
                  disabled={showResult}
                  className={buttonClass}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="font-medium">{option}</span>
                    {showResult && index === currentQ.correctAnswer && (
                      <CheckCircle className="w-6 h-6 ml-auto" />
                    )}
                    {showResult && selectedAnswer === index && selectedAnswer !== currentQ.correctAnswer && (
                      <XCircle className="w-6 h-6 ml-auto" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {showExplanation && (
            <div className="bg-blue-500/20 border border-blue-500/30 rounded-2xl p-6 mb-6 animate-fadeIn">
              <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Explanation
              </h4>
              <p className="text-white/90">{currentQ.explanation}</p>
            </div>
          )}

          <div className="flex justify-center">
            {!showResult ? (
              <button
                onClick={handleAnswerSubmit}
                disabled={selectedAnswer === null}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-semibold text-lg"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold text-lg"
              >
                {currentQuestion + 1 < activeModule.questions.length ? 'Next Question' : 'View Results'}
              </button>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Quiz;