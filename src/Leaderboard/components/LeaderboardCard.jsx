import React from 'react';
import {
  ChevronDown, ChevronUp, Flame, Star, Target,
  BookOpen, Zap, Heart, Gem
} from 'lucide-react';

const LeaderboardCard = ({
  user,
  rank,
  isExpanded,
  toggleExpanded,
  getRankDisplay,
  getXPProgress,
  getLevelInfo,
  getStreakColor
}) => {
  const rankDisplay = getRankDisplay(rank);
  const xpProgress = getXPProgress(user.xp, user.level);
  const levelInfo = getLevelInfo(user.level);

  return (
    <div 
      className={`rounded-2xl border-2 p-5 transition-all duration-500 hover:shadow-2xl cursor-pointer relative overflow-hidden ${
        rank <= 3 
          ? 'border-yellow-400/40 bg-gradient-to-r from-yellow-900/20 via-orange-900/20 to-pink-900/20' 
          : 'border-gray-600/30 bg-gray-800/30'
      } backdrop-blur-sm hover:border-purple-400/50 transform hover:scale-[1.02] group`}
      onClick={() => toggleExpanded(user._id)}
    >
      {rank <= 3 && (
        <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg animate-pulse">
          TOP {rank}
        </div>
      )}
      
      <div className="flex items-center space-x-6">
        <div className={`${rankDisplay.bg} ${rankDisplay.glow} ${rankDisplay.border} w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-all duration-300`}>
          {rankDisplay.icon}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-4">
              <h3 className="text-2xl font-black text-white group-hover:text-yellow-400 transition-colors">
                {user.name}
              </h3>
              <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${levelInfo.color} text-white text-sm font-bold shadow-lg ${levelInfo.glow} transform group-hover:scale-105 transition-all duration-300`}>
                {levelInfo.icon} {levelInfo.title} {user.level}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-yellow-400 group-hover:text-yellow-300 transition-colors">
                {user.xp.toLocaleString()}
              </span>
              <span className="text-sm text-gray-400">XP</span>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-gray-300">Progress to Level {user.level + 1}</span>
              <span className="text-sm text-purple-400 font-bold">{Math.round(xpProgress)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden shadow-inner">
              <div 
                className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-3 rounded-full transition-all duration-1000 relative overflow-hidden" 
                style={{ width: `${xpProgress}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 animate-shimmer"></div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6 text-sm">
              <div className={`flex items-center px-3 py-1 rounded-full bg-gradient-to-r ${getStreakColor(user.streak || 0)} text-white font-bold shadow-lg`}>
                <Flame className="w-4 h-4 mr-2" />
                <span>{user.streak || 0} day streak</span>
              </div>
              <div className="flex items-center text-purple-400 font-bold">
                <Star className="w-4 h-4 mr-2" />
                <span>{user.badges?.length || 0} badges</span>
              </div>
              <div className="flex items-center text-blue-400 font-bold">
                <Target className="w-4 h-4 mr-2" />
                <span>{user.accuracy || 0}% accuracy</span>
              </div>
            </div>
            <div className="text-gray-400 transform group-hover:scale-110 transition-all duration-200">
              {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
          </div>

          {isExpanded && (
            <div className="mt-6 pt-6 border-t border-gray-700/50 animate-in slide-in-from-top-2 duration-300">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-700/40 rounded-xl p-4 text-center hover:bg-gray-700/60 transition-all duration-300 transform hover:scale-105">
                  <BookOpen className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                  <div className="text-xl font-black text-white">{user.totalChallenges || 0}</div>
                  <div className="text-xs text-gray-400 font-semibold">Challenges</div>
                </div>
                <div className="bg-gray-700/40 rounded-xl p-4 text-center hover:bg-gray-700/60 transition-all duration-300 transform hover:scale-105">
                  <Zap className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                  <div className="text-xl font-black text-white">{user.level}</div>
                  <div className="text-xs text-gray-400 font-semibold">Level</div>
                </div>
                <div className="bg-gray-700/40 rounded-xl p-4 text-center hover:bg-gray-700/60 transition-all duration-300 transform hover:scale-105">
                  <Heart className="w-6 h-6 text-red-400 mx-auto mb-2" />
                  <div className="text-xl font-black text-white">{user.accuracy || 0}%</div>
                  <div className="text-xs text-gray-400 font-semibold">Accuracy</div>
                </div>
                <div className="bg-gray-700/40 rounded-xl p-4 text-center hover:bg-gray-700/60 transition-all duration-300 transform hover:scale-105">
                  <Gem className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                  <div className="text-xl font-black text-white">{user.badges?.length || 0}</div>
                  <div className="text-xs text-gray-400 font-semibold">Badges</div>
                </div>
              </div>
              {user.badges && user.badges.length > 0 && (
                <div className="mt-4">
                  <div className="text-sm text-gray-400 mb-2 font-semibold">Badges Earned:</div>
                  <div className="flex flex-wrap gap-2">
                    {user.badges.map((badge, i) => (
                      <span key={i} className="text-2xl hover:scale-125 transition-transform cursor-pointer animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}>
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardCard;
