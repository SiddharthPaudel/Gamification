import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const UserRow = ({
  user,
  rank,
  isExpanded,
  toggleExpanded,
  getRankDisplay,
  getXPProgress,
  getLevelInfo,
  getStreakColor,
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
        <div
          className={`${rankDisplay.bg} ${rankDisplay.glow} ${rankDisplay.border} w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-all duration-300`}
        >
          {rankDisplay.icon}
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-4">
              <h3 className="text-2xl font-black text-white group-hover:text-yellow-400 transition-colors">
                {user.name}
              </h3>
              <div
                className={`px-4 py-2 rounded-full bg-gradient-to-r ${levelInfo.color} text-white text-sm font-bold shadow-lg ${levelInfo.glow} transform group-hover:scale-105 transition-all duration-300`}
              >
                {levelInfo.icon} {levelInfo.title} {user.level}
              </div>
            </div>

            <button
              className="text-white hover:text-yellow-400 transition-colors"
              aria-label={isExpanded ? "Collapse details" : "Expand details"}
            >
              {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </button>
          </div>

          {/* XP Progress Bar */}
          <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden shadow-inner mb-3">
            <div
              className={`h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500`}
              style={{ width: `${xpProgress}%` }}
            />
          </div>

          {/* Optional expanded details */}
          {isExpanded && (
            <div className="text-gray-300 text-sm">
              <p>XP: {user.xp.toLocaleString()}</p>
              <p>Accuracy: {user.accuracy || 0}%</p>
              <p>Streak: {user.streak || 0}</p>
              {/* Add more details as you like */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(UserRow);
