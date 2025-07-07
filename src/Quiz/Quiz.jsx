import React, { useEffect } from 'react';
import { useAuth } from '../AuthContext/AuthContext';
import { Target, Zap, Star } from 'lucide-react';
import OwlMascot from '../OwlMascot/OwlMascot';

// Import custom hook
import { useQuiz } from './hooks/useQuiz';

// Import all components
import QuizHeader from './components/QuizHeader';
import ModuleCard from './components/ModuleCard';
import QuestionCard from './components/QuestionCard';
import QuizComplete from './components/QuizComplete';
import QuizTimer from './components/QuizTimer';

const Quiz = () => {
  const { user, updateUserProfile } = useAuth();
  const {
    modules,
    activeModule,
    currentQuestion,
    selectedAnswer,
    showResult,
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
  } = useQuiz(user, updateUserProfile);

  useEffect(() => {
    fetchModules();
  }, []);

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

  // NEW: Skip question handler
  const handleSkipQuestion = () => {
    setSelectedAnswer(null);        // Reset answer
    handleNextQuestion();           // Go to next question
  };

  // Module selection screen
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
              <p className="text-white text-center col-span-full">Loading modules...</p>
            ) : (
              modules.map((module, idx) => (
                <ModuleCard
                  key={module.id || module._id || idx}
                  module={module}
                  onClick={handleModuleClick}
                />
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  // Loading questions
  if (!activeModule.questions || activeModule.questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-xl bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 px-4 py-8">
        Loading questions...
      </div>
    );
  }

  // Quiz completed
  if (quizCompleted) {
    return (
      <QuizComplete
        totalXP={totalXP}
        answers={answers}
        onBack={handleBack}
        getAccuracy={getAccuracy}
      />
    );
  }

  const currentQ = activeModule.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 px-4 py-8">
      {/* <QuizTimer
        timeLeft={timeLeft}
        setTimeLeft={setTimeLeft}
        activeModule={activeModule}
        quizCompleted={quizCompleted}
        showResult={showResult}
        onTimeUp={handleTimeUp}
      /> */}
      
      <div className="max-w-4xl mx-auto">
        <QuizHeader
          onBack={handleBack}
          totalXP={totalXP}
          streak={streak}
          timeLeft={timeLeft}
          activeModule={activeModule}
          currentQuestion={currentQuestion}
          totalQuestions={activeModule.questions.length}
          animateScore={animateScore}
        />

        <QuestionCard
          question={currentQ.question}
          options={currentQ.options}
          correctAnswer={currentQ.correctAnswer}
          explanation={currentQ.explanation}
          selectedAnswer={selectedAnswer}
          showResult={showResult}
          showExplanation={showExplanation}
          onAnswerClick={handleAnswerClick}
          onSubmit={handleAnswerSubmit}
          onNext={handleNextQuestion}
          onSkip={handleSkipQuestion}          
          isLastQuestion={currentQuestion + 1 >= activeModule.questions.length}
        />
        
        {/* <OwlMascot message="Keep going, you're doing great! 🦉" /> */}
      </div>
    </div>
  );
};

export default Quiz;
