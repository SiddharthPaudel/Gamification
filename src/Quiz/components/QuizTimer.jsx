import React, { useEffect } from 'react';

const QuizTimer = ({ timeLeft, setTimeLeft, activeModule, quizCompleted, showResult, onTimeUp }) => {
  useEffect(() => {
    let timer;
    if (activeModule && !quizCompleted && !showResult && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && !showResult) {
      onTimeUp();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, activeModule, quizCompleted, showResult, setTimeLeft, onTimeUp]);

  return null; // This is a logic-only component
};

export default QuizTimer;