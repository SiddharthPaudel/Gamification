import { Trophy, TrendingUp, Star, Award, Zap, Target, Brain, Code, Users } from 'lucide-react';
const BadgesAndMotivation = ({ badges }) => {
  const badgeIcons = {
    "First Quiz": Target,
    "Speed Learner": Zap,
    "Code Master": Code,
    "Flashcard Pro": Brain,
    "Problem Solver": Award
  };

  return (
    <div className="space-y-6">
      {/* Badges Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Award className="w-6 h-6 mr-2 text-yellow-500" />
          Your Achievements
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {badges.map((badge, index) => {
            const IconComponent = badgeIcons[badge] || Star;
            return (
              <div key={index} className="flex flex-col items-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-200 hover:shadow-md transition-shadow duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-2">
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700 text-center">{badge}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Motivation Section */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-3xl p-8 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-indigo-600/20 backdrop-blur-sm"></div>
        <div className="relative z-10">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-3">🚀 Keep Pushing Forward!</h3>
          <p className="text-lg text-purple-100 max-w-2xl mx-auto leading-relaxed">
            You're making incredible progress! Every challenge you complete, every quiz you ace, and every concept you master brings you closer to your goals.
            <span className="font-semibold text-white"> Your dedication is inspiring!</span>
          </p>
        </div>
      </div>
    </div>
  );
}
export default BadgesAndMotivation;