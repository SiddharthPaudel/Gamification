import React from 'react';
import { Brain, Zap, Code } from 'lucide-react';
import { useAuth } from '../AuthContext/AuthContext';

const StatsAndProgress = () => {
  const { user } = useAuth();

  if (!user) return <div className="text-center py-6">Loading user data...</div>;

  // Provide safe default values in case any field is missing
  const quiz = user?.gameProgress?.quiz || {
    totalPlayed: 0,
    totalCorrect: 0,
    highScore: 0,
  };
  const flashcards = user?.gameProgress?.flashcards || {
    totalPlayed: 0,
    totalCorrect: 0,
  };
  const codePuzzles = user?.gameProgress?.codePuzzles || {
    totalCompleted: 0,
    correctFirstTry: 0,
  };

  // Calculate accuracy percentages safely
  const flashcardAccuracy =
    flashcards.totalPlayed > 0
      ? Math.round((flashcards.totalCorrect / flashcards.totalPlayed) * 100)
      : 0;

  const codePuzzleSuccessRate =
    codePuzzles.totalCompleted > 0
      ? Math.round((codePuzzles.correctFirstTry / codePuzzles.totalCompleted) * 100)
      : 0;

  const stats = [
    {
      title: 'Quiz Performance',
      icon: Brain,
      color: 'from-green-400 to-emerald-500',
      stats: [
        { label: 'Total Played', value: quiz.totalPlayed },
        { label: 'Correct Answers', value: quiz.totalCorrect },
        { label: 'High Score', value: `${quiz.highScore}` },
      ],
    },
    {
      title: 'Flashcards',
      icon: Zap,
      color: 'from-blue-400 to-cyan-500',
      stats: [
        { label: 'Total Played', value: flashcards.totalPlayed },
        { label: 'Correct Answers', value: flashcards.totalCorrect },
        { label: 'Accuracy', value: `${flashcardAccuracy}%` },
      ],
    },
    {
      title: 'Code Puzzles',
      icon: Code,
      color: 'from-purple-400 to-pink-500',
      stats: [
        { label: 'Completed', value: codePuzzles.totalCompleted },
        { label: 'First Try Success', value: codePuzzles.correctFirstTry },
        { label: 'Success Rate', value: `${codePuzzleSuccessRate}%` },
      ],
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className={`bg-gradient-to-r ${stat.color} p-4`}>
              <div className="flex items-center justify-between text-white">
                <h3 className="text-lg font-bold">{stat.title}</h3>
                <IconComponent className="w-6 h-6" />
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {stat.stats.map((item, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span className="text-gray-600">{item.label}</span>
                    <span className="font-bold text-gray-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsAndProgress;
