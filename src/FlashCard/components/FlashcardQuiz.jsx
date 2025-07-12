import React, { useEffect, useState } from "react";
import axios from "axios";

const FlashcardQuiz = ({
  flashcards,
  moduleName,
  moduleData,
  setShowResult,
  xp,
  setXp,
  streak,
  setStreak,
  correctAnswers,
  setCorrectAnswers,
  attempts,
  setAttempts,
  user,
  updateUserProfile,
  attemptSent,
  setAttemptSent,
  timeElapsed,
  setTimeElapsed,
  sessionStartTime,
  setSelectedModule
}) => {
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeElapsed(Math.floor((Date.now() - sessionStartTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [sessionStartTime]);

  const handleAnswer = (isCorrect) => {
    const currentCard = flashcards[index];
    const updatedAttempts = [...attempts, {
      question: currentCard.question,
      userAnswer: isCorrect ? currentCard.answer : "Wrong",
      correctAnswer: currentCard.answer,
      isCorrect
    }];
    setAttempts(updatedAttempts);

    if (isCorrect) {
      setCorrectAnswers(correctAnswers + 1);
      setStreak(streak + 1);
      const gainedXp = 10 + streak * 2;
      setXp(xp + gainedXp);
    } else {
      setStreak(0);
    }

    setShowAnswer(false);

    if (index + 1 < flashcards.length) {
      setIndex(index + 1);
    } else {
      handleComplete(updatedAttempts);
    }
  };

  const handleComplete = async (finalAttempts) => {
    setShowResult(true);
    if (!attemptSent && user) {
      try {
        const response = await axios.post("http://localhost:5000/api/flashcards/attempt", {
          userId: user._id,
          moduleTitle: moduleName,
          flashcardSetId: moduleData.setId,
          attempts: finalAttempts,
          xpGained: xp,
          timeTaken: timeElapsed
        });
        updateUserProfile(response.data.updatedUser);
        setAttemptSent(true);
      } catch (err) {
        console.error("Failed to record attempt", err);
      }
    }
  };

  const currentCard = flashcards[index];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-white">
      <div className="bg-black bg-opacity-40 p-8 rounded-lg max-w-lg w-full shadow-xl">
        <h2 className="text-2xl font-bold mb-4">Flashcard {index + 1} of {flashcards.length}</h2>
        <p className="text-lg mb-4">{currentCard.question}</p>
        {showAnswer ? (
          <p className="text-green-400 mb-4">Answer: {currentCard.answer}</p>
        ) : (
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mb-4"
            onClick={() => setShowAnswer(true)}
          >
            Show Answer
          </button>
        )}
        <div className="flex gap-4 justify-center">
          <button
            className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
            onClick={() => handleAnswer(true)}
          >
            Correct
          </button>
          <button
            className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
            onClick={() => handleAnswer(false)}
          >
            Wrong
          </button>
        </div>
        <div className="mt-6 text-sm opacity-80">
          XP: {xp} | Streak: {streak} | Time: {timeElapsed}s
        </div>
        <button
          className="mt-4 underline text-xs text-gray-300 hover:text-white"
          onClick={() => setSelectedModule(null)}
        >
          Exit Quiz
        </button>
      </div>
    </div>
  );
};

export default FlashcardQuiz;
