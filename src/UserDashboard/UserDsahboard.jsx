import React from 'react';
import { Trophy, Star, Target, BookOpen, Code, Brain, Award, TrendingUp, Zap, Medal, Crown } from 'lucide-react';

const UserDashboard= () => {
  // Mock user data - replace with actual user data from your state/props
  const userData = {
    name: "Alex Johnson",
    email: "alex@example.com",
    xp: 2450,
    level: 8,
    badges: ["First Quiz", "Speed Learner", "Code Master", "Flashcard Pro", "Problem Solver"],
    gameProgress: {
      quiz: {
        totalPlayed: 45,
        totalCorrect: 38,
        highScore: 95
      },
      flashcards: {
        totalPlayed: 120,
        totalCorrect: 98
      },
      codePuzzles: {
        totalCompleted: 23,
        correctFirstTry: 15
      }
    }
  };

  // Calculate XP needed for next level (assuming 300 XP per level)
  const xpPerLevel = 300;
  const currentLevelXP = (userData.level - 1) * xpPerLevel;
  const nextLevelXP = userData.level * xpPerLevel;
  const progressToNextLevel = userData.xp - currentLevelXP;
  const xpNeededForNext = nextLevelXP - userData.xp;
  const progressPercentage = Math.min((progressToNextLevel / xpPerLevel) * 100, 100);

  // Calculate accuracy rates
  const quizAccuracy = userData.gameProgress.quiz.totalPlayed > 0 
    ? ((userData.gameProgress.quiz.totalCorrect / userData.gameProgress.quiz.totalPlayed) * 100).toFixed(1)
    : 0;
  
  const flashcardAccuracy = userData.gameProgress.flashcards.totalPlayed > 0
    ? ((userData.gameProgress.flashcards.totalCorrect / userData.gameProgress.flashcards.totalPlayed) * 100).toFixed(1)
    : 0;

  const codeFirstTryRate = userData.gameProgress.codePuzzles.totalCompleted > 0
    ? ((userData.gameProgress.codePuzzles.correctFirstTry / userData.gameProgress.codePuzzles.totalCompleted) * 100).toFixed(1)
    : 0;

  const badgeIcons = {
    "First Quiz": <BookOpen className="w-5 h-5" />,
    "Speed Learner": <Zap className="w-5 h-5" />,
    "Code Master": <Code className="w-5 h-5" />,
    "Flashcard Pro": <Brain className="w-5 h-5" />,
    "Problem Solver": <Target className="w-5 h-5" />
  };

  const getLevelIcon = (level) => {
    if (level >= 10) return <Crown className="w-6 h-6 text-yellow-500" />;
    if (level >= 5) return <Medal className="w-6 h-6 text-purple-500" />;
    return <Star className="w-6 h-6 text-blue-500" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mb-4">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Achievement Dashboard</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Track your learning journey and celebrate your progress</p>
        </div>

        {/* User Profile Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 sm:p-8 mb-8 border border-white/20">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {userData.name.charAt(0)}
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-2xl font-bold text-gray-900">{userData.name}</h2>
                <p className="text-gray-600">{userData.email}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  {getLevelIcon(userData.level)}
                  <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    {userData.level}
                  </span>
                </div>
                <div className="text-sm text-gray-500 font-medium">Level</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {userData.xp.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500 font-medium">Total XP</div>
              </div>
            </div>
          </div>

          {/* Enhanced Progress Bar */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-semibold text-gray-700">Progress to Level {userData.level + 1}</span>
              <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {xpNeededForNext} XP remaining
              </span>
            </div>
            <div className="relative">
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                  style={{ width: `${progressPercentage}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2 font-medium">
                <span>{currentLevelXP.toLocaleString()} XP</span>
                <span className="font-semibold text-purple-600">{progressToNextLevel}/{xpPerLevel} XP</span>
                <span>{nextLevelXP.toLocaleString()} XP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Quiz Stats */}
          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Quiz Mastery</h3>
                <p className="text-sm text-gray-500">Knowledge Testing</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Total Quizzes:</span>
                <span className="font-bold text-lg">{userData.gameProgress.quiz.totalPlayed}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Correct Answers:</span>
                <span className="font-bold text-lg text-green-600">{userData.gameProgress.quiz.totalCorrect}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Accuracy Rate:</span>
                <span className="font-bold text-lg text-blue-600">{quizAccuracy}%</span>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-3 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">🏆 High Score:</span>
                  <span className="font-bold text-xl text-purple-600">{userData.gameProgress.quiz.highScore}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Flashcard Stats */}
          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Memory Palace</h3>
                <p className="text-sm text-gray-500">Flashcard Training</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Cards Practiced:</span>
                <span className="font-bold text-lg">{userData.gameProgress.flashcards.totalPlayed}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Mastered:</span>
                <span className="font-bold text-lg text-green-600">{userData.gameProgress.flashcards.totalCorrect}</span>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-3 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">🧠 Retention Rate:</span>
                  <span className="font-bold text-xl text-blue-600">{flashcardAccuracy}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Code Puzzle Stats */}
          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Code Warrior</h3>
                <p className="text-sm text-gray-500">Programming Challenges</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-xl flex items-center justify-center">
                <Code className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Challenges Solved:</span>
                <span className="font-bold text-lg">{userData.gameProgress.codePuzzles.totalCompleted}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Perfect Solutions:</span>
                <span className="font-bold text-lg text-green-600">{userData.gameProgress.codePuzzles.correctFirstTry}</span>
              </div>
              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-3 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">⚡ First Try Rate:</span>
                  <span className="font-bold text-xl text-orange-600">{codeFirstTryRate}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Badges Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 sm:p-8 border border-white/20">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Achievement Gallery</h2>
                <p className="text-gray-600">Your collection of earned badges</p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-100 to-blue-100 px-4 py-2 rounded-full">
              <span className="text-sm font-bold text-purple-700">{userData.badges.length} Badge{userData.badges.length !== 1 ? 's' : ''} Earned</span>
            </div>
          </div>
          
          {userData.badges.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {userData.badges.map((badge, index) => (
                <div 
                  key={index}
                  className="group relative bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50 rounded-2xl p-6 border-2 border-yellow-200/50 hover:border-yellow-300 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-14 h-14 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 rounded-full flex items-center justify-center text-white shadow-lg">
                        {badgeIcons[badge] || <Award className="w-6 h-6" />}
                      </div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{badge}</h3>
                      <p className="text-sm text-gray-600 font-medium">Achievement Unlocked!</p>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-200/0 via-yellow-200/20 to-yellow-200/0 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No badges yet</h3>
              <p className="text-gray-500 max-w-md mx-auto">Start your learning journey to unlock amazing achievements and showcase your progress!</p>
            </div>
          )}
        </div>

        {/* Enhanced Motivational Footer */}
        <div className="mt-8 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-3xl p-8 text-center text-white relative overflow-hidden">
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
    </div>
  );
};

export default UserDashboard;