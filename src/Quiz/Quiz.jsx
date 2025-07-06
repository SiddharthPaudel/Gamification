import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext/AuthContext";
import {
  ArrowLeft,
  Brain,
  CheckCircle,
  RotateCcw,
  Star,
  Target,
  Timer,
  Trophy,
  XCircle,
  Zap,
} from "lucide-react";
import toast from "react-hot-toast";
import OwlMascot from "../OwlMascot/OwlMascot"; // adjust the path
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

const formatTime = (seconds) => {
  return `${Math.floor(seconds / 60)}:${(seconds % 60)
    .toString()
    .padStart(2, "0")}`;
};

const Quiz = () => {
  const [modules, setModules] = useState([]);
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
 

const { user ,updateUserProfile} = useAuth();
const userId = user?.id;

console.log("Current User:", user);
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/modules/get-all-module"
        );
        const fetchedModulesRaw = res.data.modules || res.data || [];
        const fetchedModules = fetchedModulesRaw.map((m) => ({
          ...m,
          id: m.id || m._id,
        }));
        setModules(fetchedModules);
      } catch (error) {
        console.error("Failed to fetch modules:", error);
        toast.error("Failed to load modules");
      }
    };

    fetchModules();
  }, []);

  useEffect(() => {
    if (!activeModule || !activeModule.id) return;

    const fetchQuizzes = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/quiz/${activeModule.id}`
        );
        const data = res.data;

        let allQuestions = [];
        data.forEach((quiz) => {
          if (quiz.questions && quiz.questions.length) {
            allQuestions = allQuestions.concat(
              quiz.questions.map((q) => ({
                ...q,
                quizId: quiz._id || quiz.id,
              }))
            );
          }
        });

        setActiveModule((prev) => ({
          ...prev,
          questions: allQuestions,
        }));

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
      } catch (err) {
        console.error("Failed to fetch quizzes:", err);
        alert("Failed to load quizzes for this module.");
      }
    };

    fetchQuizzes();
  }, [activeModule?.id]);

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
    setActiveModule({
      ...module,
      questions: [],
    });
  };

  const handleTimeUp = () => {
    if (selectedAnswer === null) {
      setSelectedAnswer(-1);
    }
    handleAnswerSubmit();
  };

  const handleAnswerClick = (answerIndex) => {
    if (!showResult) {
      setSelectedAnswer(answerIndex);
    }
  };

  const handleAnswerSubmit = () => {
    if (!activeModule?.questions?.length) return;

    const currentQ = activeModule.questions[currentQuestion];
    if (!currentQ || selectedAnswer === null) return;

    const selectedOption = currentQ.options[selectedAnswer];
    const isCorrect =
      selectedOption.trim().toLowerCase() ===
      currentQ.correctAnswer.trim().toLowerCase();

    const timeBonus = Math.floor(timeLeft / 5);

if (isCorrect) {
  const nextStreak = streak + 1;
  const points =  isCorrect ? 10 : 0; // use current streak for now
  setScore((prev) => prev + points);
  setTotalXP((prev) => prev + points);
  setStreak(nextStreak);
  setAnimateScore(true);
  setTimeout(() => setAnimateScore(false), 600);
} else {
  setStreak(0);
}


    setAnswers((prev) => [
      ...prev,
      {
        questionIndex: currentQuestion,
        selectedAnswer,
        selectedOption,
        isCorrect,
        timeLeft,
        points: isCorrect ? 100 + timeBonus + streak * 10 : 0,
        quizId: currentQ.quizId,
      },
    ]);

    setShowResult(true);
    setShowExplanation(true);
  };



const handleNextQuestion = async () => {
  if (!activeModule?.questions?.length) return;

  if (currentQuestion + 1 < activeModule.questions.length) {
    setCurrentQuestion(currentQuestion + 1);
    setSelectedAnswer(null);
    setShowResult(false);
    setShowExplanation(false);
    setTimeLeft(30);
  } else {
    if (!userId) {
      toast.error("User not logged in. Please log in again.");
      return;
    }

    setQuizCompleted(true);

    const groupedByQuizId = {};
    answers.forEach((ans) => {
      if (!groupedByQuizId[ans.quizId]) groupedByQuizId[ans.quizId] = [];
      groupedByQuizId[ans.quizId].push(ans);
    });

    try {
      // Call API and get responses for all quizzes attempted
      const responses = await Promise.all(
        Object.entries(groupedByQuizId).map(([quizId, quizAnswers]) =>
          axios.post(
            `http://localhost:5000/api/quiz/attempt/${quizId}/${userId}`,
            {
              answers: quizAnswers.map((a) => a.selectedOption),
            }
          )
        )
      );

      // Example: take last response (or merge all if multiple quizzes)
      const lastResponse = responses[responses.length - 1];
      const data = lastResponse.data;

      // Construct updated user object merging existing with backend data
      const updatedUser = {
        ...user,
        xp: data.currentXP ?? user.xp,
        level: data.newLevel ?? user.level,
        badges: data.badges ?? user.badges,
        gameProgress: {
          ...user.gameProgress,
          quiz: data.gameProgress ?? user.gameProgress.quiz,
        },
        // optionally update completedTasks if backend sends it
      };

      // Update context and localStorage
      updateUserProfile(updatedUser);

      toast.success("XP and badges updated based on quiz results!");
    } catch (error) {
      console.error("Failed to update quiz attempt:", error);
      toast.error("Failed to update XP and badges.");
    }
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
    const correct = answers.filter((a) => a.isCorrect).length;
    return Math.round((correct / answers.length) * 100);
  };

  if (!activeModule) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 px-4 py-8">
 <OwlMascot 
  message="Welcome to Quiz " 
  position="absolute"
  positionProps={{ top: 100, left: 30 }}
/>

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
            {modules.length === 0 ? (
              <p className="text-white text-center col-span-full">
                Loading modules...
              </p>
            ) : (
              modules.map((module, idx) => (
                <div
                  key={module.id || module._id || idx}
                  className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
                  onClick={() => handleModuleClick(module)}
                >
                  <div
                    className={`rounded-3xl p-8 shadow-2xl transition-all duration-300 border border-white/20 relative overflow-hidden bg-white/10`}
                  >
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
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {module.title}
                      </h3>
                      <p className="text-white/80 text-sm mb-4">
                        Click to start quiz
                      </p>
                      <div className="flex justify-between items-center text-white/70 text-sm">
                        <span>Varied questions</span>
                        <span>30s each</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  // If activeModule.questions is empty or undefined
  if (!activeModule.questions || activeModule.questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-xl bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 px-4 py-8">
        Loading questions...
      </div>
    );
  }

  if (quizCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 px-4 py-8 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-12 shadow-2xl border border-white/20 max-w-2xl w-full text-center">
          <Trophy className="w-24 h-24 text-yellow-400 mx-auto mb-6 animate-bounce" />
          <h2 className="text-4xl font-bold text-white mb-6">
            Quiz Complete! 🎉
          </h2>

          <div className="grid grid-cols-2 gap-8 mb-8 text-white">
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400">
                {totalXP}
              </div>
              <div className="text-sm opacity-75">Total XP</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400">
                {getAccuracy()}%
              </div>
              <div className="text-sm opacity-75">Accuracy</div>
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl p-6 mb-8">
            <h3 className="text-white font-semibold mb-4">
              Performance Breakdown
            </h3>
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
            {/* <button
              onClick={() => handleModuleClick(activeModule)}
              className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-2xl hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <RotateCcw className="w-5 h-5" />
              Retry Quiz
            </button> */}
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
  const progress =
    ((currentQuestion + 1) / activeModule.questions.length) * 100;

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
                <Zap
                  className={`w-5 h-5 ${
                    animateScore
                      ? "text-yellow-400 scale-110"
                      : "text-yellow-400"
                  } transition-all duration-300`}
                />
                <span
                  className={`font-bold ${
                    animateScore
                      ? "text-yellow-400 scale-110"
                      : "text-yellow-400"
                  } transition-all duration-300`}
                >
                  {totalXP} XP
                </span>
              </div>
              {streak > 0 && (
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-orange-400" />
                  <span className="font-bold text-orange-400">
                    {streak} streak
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Timer
                  className={`w-5 h-5 ${
                    timeLeft <= 10 ? "text-red-400" : "text-blue-400"
                  }`}
                />
                <span
                  className={`font-bold ${
                    timeLeft <= 10 ? "text-red-400" : ""
                  }`}
                >
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
              let buttonClass =
                "p-6 rounded-2xl text-left transition-all duration-300 transform hover:scale-105 border-2 ";

              if (!showResult) {
                buttonClass +=
                  selectedAnswer === index
                    ? "bg-blue-500 text-white border-blue-400 shadow-lg"
                    : "bg-white/10 text-white border-white/20 hover:bg-white/20 hover:border-white/40";
              } else {
                const isCorrectOption =
                  currentQ.options[index].trim().toLowerCase() ===
                  currentQ.correctAnswer.trim().toLowerCase();

                if (isCorrectOption) {
                  buttonClass +=
                    "bg-green-500 text-white border-green-400 shadow-lg";
                } else if (selectedAnswer === index && !isCorrectOption) {
                  buttonClass +=
                    "bg-red-500 text-white border-red-400 shadow-lg";
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
                    {showResult &&
                      selectedAnswer === index &&
                      selectedAnswer !== currentQ.correctAnswer && (
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
                {currentQuestion + 1 < activeModule.questions.length
                  ? "Next Question"
                  : "View Results"}
              </button>
            )}
          </div>
        </div>
         <OwlMascot message="Keep going, you're doing great! 🦉" />
      </div>
{/* 
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style> */}
    </div>
  );
};

export default Quiz;
