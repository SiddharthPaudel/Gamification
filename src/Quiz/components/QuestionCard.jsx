import React from 'react';
import { Brain, CheckCircle, XCircle } from 'lucide-react';
import OwlMascot from "../../OwlMascot/OwlMascot.jsx" // Adjust path if needed

const QuestionCard = ({
  question,
  options,
  correctAnswer,
  explanation,
  selectedAnswer,
  showResult,
  showExplanation,
  onAnswerClick,
  onSubmit,
  onNext,
  onSkip,           // New skip handler prop
  isLastQuestion,
}) => {
  const isCorrect =
    selectedAnswer !== null &&
    options[selectedAnswer]?.trim().toLowerCase() === correctAnswer.trim().toLowerCase();

  return (
    <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20 max-w-3xl mx-auto">
      {/* Question Header */}
      <div className="text-center mb-6">
        <Brain className="w-8 h-8 text-white mx-auto mb-3" />
        <h3 className="text-xl font-bold text-white leading-tight">{question}</h3>
      </div>

      {/* Options Grid */}
      <div className="space-y-3 mb-6">
        {options.map((option, index) => {
          let buttonClass = "p-4 rounded-xl text-left transition-all duration-200 border-2 w-full ";

          if (!showResult) {
            buttonClass += selectedAnswer === index
              ? "bg-blue-500 text-white border-blue-400 shadow-md"
              : "bg-white/10 text-white border-white/20 hover:bg-white/20 hover:border-white/40";
          } else {
            const isCorrectOption = options[index].trim().toLowerCase() === correctAnswer.trim().toLowerCase();

            if (isCorrectOption) {
              buttonClass += "bg-green-500 text-white border-green-400";
            } else if (selectedAnswer === index && !isCorrectOption) {
              buttonClass += "bg-red-500 text-white border-red-400";
            } else {
              buttonClass += "bg-white/10 text-white/60 border-white/20";
            }
          }

          return (
            <button
              key={index}
              onClick={() => onAnswerClick(index)}
              disabled={showResult}
              className={buttonClass}
            >
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">
                  {String.fromCharCode(65 + index)}
                </div>
                <span className="font-medium text-sm">{option}</span>
                {showResult && options[index].trim().toLowerCase() === correctAnswer.trim().toLowerCase() && (
                  <CheckCircle className="w-5 h-5 ml-auto" />
                )}
                {showResult && selectedAnswer === index && options[selectedAnswer].trim().toLowerCase() !== correctAnswer.trim().toLowerCase() && (
                  <XCircle className="w-5 h-5 ml-auto" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {showExplanation && (
        <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-4 mb-6">
          <h4 className="text-white font-semibold mb-2 flex items-center gap-2 text-sm">
            <Brain className="w-4 h-4" />
            Explanation
          </h4>
          <p className="text-white/90 text-sm">{explanation}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        {!showResult ? (
          <>
            <button
              onClick={onSubmit}
              disabled={selectedAnswer === null}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              Submit Answer
            </button>

            <button
              onClick={onSkip}
              className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all duration-200 shadow-md hover:shadow-lg font-semibold"
            >
              Skip Question
            </button>
          </>
        ) : (
          <button
            onClick={onNext}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg font-semibold"
          >
            {isLastQuestion ? "View Results" : "Next Question"}
          </button>
        )}
      </div>

      {/* 🎉 Owl Mascot Cheer */}
  {showResult && (
  <div className="absolute top-0 right-4 z-50 flex flex-col items-end">
    {/* Speech Bubble */}
    <div className="relative bg-white text-gray-900 px-4 py-2 rounded-xl shadow-lg max-w-xs text-sm leading-snug mb-2">
      <p>
        {isCorrect
          ? "Woohoo! You got it right! 🎉🦉"
          : "Oops! You'll get the next one! 💪🦉"}
      </p>
      {/* Bubble Tail */}
      <div className="absolute bottom-[-6px] right-4 w-3 h-3 bg-white rotate-45 shadow-md"></div>
    </div>

    {/* Owl Mascot */}
    <OwlMascot
      isInCongrats
      size={85}
      position="relative"
      showMessage={false} // hide built-in message
    />
  </div>
)}

    </div>
  );
};

export default QuestionCard;
