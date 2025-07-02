import React from 'react';
import { Trophy, TrendingUp } from 'lucide-react';
import { useAuth } from '../AuthContext/AuthContext';

const DashboardHeader = () => {
  const { user } = useAuth();
  if (!user) return <div className="text-center py-6">Loading...</div>;



  const maxLevel = 10;
  const maxXP = 1000;

  const levelProgress = Math.min((user.level / maxLevel) * 100, 100);
  const xpProgress = Math.min((user.xp / maxXP) * 100, 100);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mb-4 shadow-lg">
          <Trophy className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
          Achievement Dashboard
        </h1>
        <p className="text-lg text-gray-600">Track your learning journey and celebrate your progress</p>
      </div>

      {/* Profile Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6 border border-blue-100">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <div className="flex items-center space-x-4 mb-4 sm:mb-0">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">
                {user.name.charAt(0)}
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 border-2 border-white rounded-full"></div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{user.xp.toLocaleString()}</div>
              <div className="text-sm text-gray-500">XP Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">Level {user.level}</div>
              <div className="text-sm text-gray-500">Current Level</div>
            </div>
          </div>
        </div>
      </div>

      {/* 🔵 LEVEL Progress Bar */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-5 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-gray-800">Level Progress</span>
          </div>
          <div className="text-right">
            <span className="text-sm font-medium text-gray-600">
              Level {user.level} / {maxLevel}
            </span>
          </div>
        </div>

        <div className="relative w-full bg-gray-200 rounded-full h-3 mb-3 overflow-hidden">
          <div
            className="bg-indigo-500 h-3 rounded-full transition-all duration-700 ease-out relative"
            style={{ width: `${levelProgress}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
          </div>
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">Level {user.level}</span>
          <span className="font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-full text-xs">
            {Math.round(levelProgress)}% Complete
          </span>
          <span className="text-gray-500">Level {maxLevel}</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
