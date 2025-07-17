// hooks/useQuiz.js
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export const useQuiz = (user, updateUserProfile) => {
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

  const resetQuizState = () => {
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

  const fetchQuizzes = async (moduleId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/quiz/${moduleId}`);
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

      return allQuestions;
    } catch (err) {
      console.error("Failed to fetch quizzes:", err);
      toast.error("Failed to load quizzes for this module.");
      return [];
    }
  };
const handleModuleClick = async (module) => {
  if (!user || (user.hearts ?? 0) <= 0) {
    toast.error("You don't have enough hearts to play. Please wait or earn more!");
    return;  // stop from starting quiz
  }
  
  setActiveModule({ ...module, questions: [] });
  resetQuizState();
  
  const questions = await fetchQuizzes(module.id);
  setActiveModule(prev => ({ ...prev, questions }));
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
      const points = 10;
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
      await completeQuiz();
    }
  };

  const completeQuiz = async () => {
    if (!user?.id) {
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
      const responses = await Promise.all(
        Object.entries(groupedByQuizId).map(([quizId, quizAnswers]) =>
          axios.post(
            `http://localhost:5000/api/quiz/attempt/${quizId}/${user.id}`,
            {
              answers: quizAnswers.map((a) => a.selectedOption),
            }
          )
        )
      );

      const lastResponse = responses[responses.length - 1];
      const data = lastResponse.data;

      const updatedUser = {
        ...user,
        xp: data.currentXP ?? user.xp,
        level: data.newLevel ?? user.level,
        hearts: data.heartsLeft ?? user.hearts, // <== Add this line
        badges: data.badges ?? user.badges,
        gameProgress: {
          ...user.gameProgress,
          quiz: data.gameProgress ?? user.gameProgress.quiz,
        },
      };

      updateUserProfile(updatedUser);
      toast.success(
        `XP, badges, and hearts updated! Hearts left: ${updatedUser.hearts}`
      );
    } catch (error) {
      console.error("Failed to update quiz attempt:", error);
      toast.error("Failed to update XP and badges.");
    }
  };

  const handleBack = () => {
    setActiveModule(null);
    resetQuizState();
  };

  const getAccuracy = () => {
    if (answers.length === 0) return 0;
    const correct = answers.filter((a) => a.isCorrect).length;
    return Math.round((correct / answers.length) * 100);
  };

  return {
    modules,
    activeModule,
    currentQuestion,
    selectedAnswer,
    showResult,
    score,
    timeLeft,
    quizCompleted,
    answers,
    showExplanation,
    streak,
    totalXP,
    animateScore,
    setSelectedAnswer,
    setTimeLeft,
    fetchModules,
    handleModuleClick,
    handleAnswerSubmit,
    handleNextQuestion,
    handleBack,
    getAccuracy,
  };
};
