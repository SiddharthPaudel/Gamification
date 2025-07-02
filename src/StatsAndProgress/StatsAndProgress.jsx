

import { Trophy, TrendingUp, Star, Award, Zap, Target, Brain, Code, Users } from 'lucide-react';
const StatsAndProgress = ({ userData }) => {
  const stats = [
    {
      title: "Quiz Performance",
      icon: Brain,
      color: "from-green-400 to-emerald-500",
      stats: [
        { label: "Total Played", value: userData.gameProgress.quiz.totalPlayed },
        { label: "Correct Answers", value: userData.gameProgress.quiz.totalCorrect },
        { label: "High Score", value: `${userData.gameProgress.quiz.highScore}%` }
      ]
    },
    {
      title: "Flashcards",
      icon: Zap,
      color: "from-blue-400 to-cyan-500",
      stats: [
        { label: "Total Played", value: userData.gameProgress.flashcards.totalPlayed },
        { label: "Correct Answers", value: userData.gameProgress.flashcards.totalCorrect },
        { label: "Accuracy", value: `${Math.round((userData.gameProgress.flashcards.totalCorrect / userData.gameProgress.flashcards.totalPlayed) * 100)}%` }
      ]
    },
    {
      title: "Code Puzzles",
      icon: Code,
      color: "from-purple-400 to-pink-500",
      stats: [
        { label: "Completed", value: userData.gameProgress.codePuzzles.totalCompleted },
        { label: "First Try Success", value: userData.gameProgress.codePuzzles.correctFirstTry },
        { label: "Success Rate", value: `${Math.round((userData.gameProgress.codePuzzles.correctFirstTry / userData.gameProgress.codePuzzles.totalCompleted) * 100)}%` }
      ]
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
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