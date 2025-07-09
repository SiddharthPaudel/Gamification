// Leaderboard.jsx (FULL CONNECTED FRONTEND CODE)

import React, { useState, useEffect } from 'react';
import {
  Trophy, Crown, Medal, Award, Star, Zap, Target, BookOpen, Code, Brain,
  ChevronDown, ChevronUp, Flame, Sparkles, Shield
} from 'lucide-react';

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [expandedUser, setExpandedUser] = useState(null);
  const [animatingRanks, setAnimatingRanks] = useState(new Set());

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/leaderboard/xp');
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
      }
    };

    fetchLeaderboard();

    const timer = setTimeout(() => {
      setAnimatingRanks(new Set([1, 2, 3, 4, 5, 6]));
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const sortedUsers = [...users];

  const getRankDisplay = (rank) => {
    const baseClasses = "w-14 h-14 rounded-full flex items-center justify-center shadow-lg transform transition-all duration-500";
    switch (rank) {
      case 1:
        return {
          icon: <Crown className="w-7 h-7 text-yellow-100" />, bg: 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500', glow: 'shadow-yellow-400/50 shadow-2xl', particle: '✨'
        };
      case 2:
        return {
          icon: <Medal className="w-7 h-7 text-gray-100" />, bg: 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500', glow: 'shadow-gray-400/50 shadow-2xl', particle: '🥈'
        };
      case 3:
        return {
          icon: <Award className="w-7 h-7 text-orange-100" />, bg: 'bg-gradient-to-br from-orange-400 via-red-400 to-pink-500', glow: 'shadow-orange-400/50 shadow-2xl', particle: '🥉'
        };
      default:
        return {
          icon: <span className="text-lg font-bold text-white">#{rank}</span>, bg: 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500', glow: 'shadow-purple-500/30 shadow-xl', particle: '⭐'
        };
    }
  };

  const getLevelInfo = (level) => {
    if (level >= 15) return { color: 'from-purple-500 via-pink-500 to-red-500', title: 'Legend', icon: '👑' };
    if (level >= 10) return { color: 'from-blue-500 via-cyan-500 to-teal-500', title: 'Expert', icon: '🔥' };
    if (level >= 5) return { color: 'from-green-500 via-emerald-500 to-blue-500', title: 'Pro', icon: '⚡' };
    return { color: 'from-gray-500 via-slate-500 to-gray-600', title: 'Novice', icon: '🌟' };
  };

  const getXPProgress = (currentXP, level) => {
    const baseXP = (level - 1) * 200;
    const nextLevelXP = level * 200;
    const progress = ((currentXP - baseXP) / (nextLevelXP - baseXP)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 relative overflow-hidden">
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full mb-6 shadow-2xl shadow-yellow-500/50 animate-pulse">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 bg-clip-text text-transparent mb-4 animate-pulse">
            🏆 HALL OF FAME 🏆
          </h1>
          <p className="text-xl text-gray-300 font-medium">Where Learning Legends Are Born! 🚀✨</p>
        </div>

        <div className="flex justify-center items-end gap-6 mb-16">
          {sortedUsers.slice(0, 3).map((user, index) => {
            const rank = index + 1;
            const rankDisplay = getRankDisplay(rank);
            const levelInfo = getLevelInfo(user.level);
            const xpProgress = getXPProgress(user.xp, user.level);

            return (
              <div key={user._id} className="text-center">
                <div className={`${rankDisplay.bg} ${rankDisplay.glow} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2`}>{rankDisplay.icon}</div>
                <div className="text-white font-bold text-lg">{user.name}</div>
                <div className={`text-xs font-semibold text-white mb-1 bg-gradient-to-r ${levelInfo.color} px-2 py-1 rounded-full inline-block`}>{levelInfo.icon} {levelInfo.title} {user.level}</div>
                <div className="text-yellow-400 font-semibold mb-2">{user.xp.toLocaleString()} XP</div>
                <div className="w-24 h-2 bg-gray-700 rounded-full mx-auto">
                  <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full" style={{ width: `${xpProgress}%` }}></div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-gray-800/30 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-gray-700/50">
          <div className="space-y-6">
            {sortedUsers.map((user, index) => {
              const rank = index + 1;
              const rankDisplay = getRankDisplay(rank);
              const xpProgress = getXPProgress(user.xp, user.level);
              const levelInfo = getLevelInfo(user.level);

              return (
                <div key={user._id} className="rounded-2xl border-2 p-6 border-gray-600/50 bg-gray-800/40 backdrop-blur-sm">
                  <div className="flex items-center space-x-6">
                    <div className={`${rankDisplay.bg} ${rankDisplay.glow} w-16 h-16 rounded-full flex items-center justify-center shadow-2xl`}> {rankDisplay.icon} </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-2xl font-bold text-white">{user.name}</h3>
                        <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${levelInfo.color} text-white text-sm font-bold shadow-lg`}>
                          {levelInfo.icon} {levelInfo.title} {user.level}
                        </div>
                      </div>
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-semibold text-gray-300">XP</span>
                          <span className="text-lg font-bold text-yellow-400">{user.xp.toLocaleString()} XP</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                          <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-3 rounded-full" style={{ width: `${xpProgress}%` }}></div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center text-orange-400">
                          <Flame className="w-4 h-4 mr-1" />
                          <span className="font-semibold">{user.streak || 0} day streak</span>
                        </div>
                        <div className="flex items-center text-purple-400">
                          <Star className="w-4 h-4 mr-1" />
                          <span className="font-semibold">{user.badges.length} badges</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
