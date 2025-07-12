import React from 'react';
import UserRow from './UserRow';
import { TrendingUp, Sparkles } from 'lucide-react';

const CompleteRanking = ({ users, expandedUser, toggleExpanded, getRankDisplay, getXPProgress, getLevelInfo, getStreakColor }) => {
  return (
    <div className="bg-gray-800/20 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-gray-700/30">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-black text-white flex items-center gap-3">
          <TrendingUp className="w-8 h-8 text-purple-400" />
          Complete Rankings
        </h2>
        <div className="flex items-center gap-3 text-sm text-gray-300 bg-gray-700/30 px-3 py-2 rounded-full">
          <Sparkles className="w-4 h-4 text-yellow-400" />
          <span className="font-semibold">Live Updates</span>
        </div>
      </div>

      <div className="space-y-3">
        {users.map((user, index) => {
          const rank = index + 1;
          return (
            <UserRow
              key={user._id}
              user={user}
              rank={rank}
              isExpanded={expandedUser === user._id}
              toggleExpanded={toggleExpanded}
              getRankDisplay={getRankDisplay}
              getXPProgress={getXPProgress}
              getLevelInfo={getLevelInfo}
              getStreakColor={getStreakColor}
            />
          );
        })}
      </div>
    </div>
  );
};

export default React.memo(CompleteRanking);
