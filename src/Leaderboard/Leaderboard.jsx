import React, { useState, useEffect } from 'react';
import {
  Trophy, Crown, Medal, Award, Star, Zap, Target, BookOpen, Code, Brain,
  ChevronDown, ChevronUp, Flame, Sparkles, Shield, TrendingUp, Calendar,
  Users, Activity, Gem, Sword, Heart, Bolt, Rocket, Diamond
} from 'lucide-react';

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [expandedUser, setExpandedUser] = useState(null);
  const [animatingRanks, setAnimatingRanks] = useState(new Set());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showTopThreeBars, setShowTopThreeBars] = useState(false);

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

    // Update time every second
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Animate rank appearance
    const timer = setTimeout(() => {
      setAnimatingRanks(new Set([1, 2, 3, 4, 5, 6]));
    }, 100);

    // Show top three bars after a delay
    const barTimer = setTimeout(() => {
      setShowTopThreeBars(true);
    }, 500);

    return () => {
      clearInterval(timeInterval);
      clearTimeout(timer);
      clearTimeout(barTimer);
    };
  }, []);

  const sortedUsers = [...users];

  const getRankDisplay = (rank) => {
    const baseClasses = "w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl transform transition-all duration-700 hover:scale-110";
    switch (rank) {
      case 1:
        return {
          icon: <Crown className="w-8 h-8 text-yellow-100" />,
          bg: 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500',
          glow: 'shadow-yellow-400/60 shadow-2xl',
          particle: '✨',
          border: 'border-4 border-yellow-300/50'
        };
      case 2:
        return {
          icon: <Medal className="w-8 h-8 text-gray-100" />,
          bg: 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500',
          glow: 'shadow-gray-400/60 shadow-2xl',
          particle: '🥈',
          border: 'border-4 border-gray-300/50'
        };
      case 3:
        return {
          icon: <Award className="w-8 h-8 text-orange-100" />,
          bg: 'bg-gradient-to-br from-orange-400 via-red-400 to-pink-500',
          glow: 'shadow-orange-400/60 shadow-2xl',
          particle: '🥉',
          border: 'border-4 border-orange-300/50'
        };
      default:
        return {
          icon: <span className="text-xl font-bold text-white">#{rank}</span>,
          bg: 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500',
          glow: 'shadow-purple-500/40 shadow-xl',
          particle: '⭐',
          border: 'border-2 border-purple-300/30'
        };
    }
  };

  const getLevelInfo = (level) => {
    if (level >= 15) return { 
      color: 'from-purple-500 via-pink-500 to-red-500', 
      title: 'Legend', 
      icon: '👑',
      glow: 'shadow-purple-500/50'
    };
    if (level >= 10) return { 
      color: 'from-blue-500 via-cyan-500 to-teal-500', 
      title: 'Expert', 
      icon: '🔥',
      glow: 'shadow-blue-500/50'
    };
    if (level >= 5) return { 
      color: 'from-green-500 via-emerald-500 to-blue-500', 
      title: 'Pro', 
      icon: '⚡',
      glow: 'shadow-green-500/50'
    };
    return { 
      color: 'from-gray-500 via-slate-500 to-gray-600', 
      title: 'Novice', 
      icon: '🌟',
      glow: 'shadow-gray-500/50'
    };
  };

  const getXPProgress = (currentXP, level) => {
    const baseXP = (level - 1) * 200;
    const nextLevelXP = level * 200;
    const progress = ((currentXP - baseXP) / (nextLevelXP - baseXP)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  const getStreakColor = (streak) => {
    if (streak >= 30) return 'from-red-500 to-orange-500';
    if (streak >= 20) return 'from-orange-500 to-yellow-500';
    if (streak >= 10) return 'from-yellow-500 to-green-500';
    return 'from-blue-500 to-purple-500';
  };

  const toggleExpanded = (userId) => {
    setExpandedUser(expandedUser === userId ? null : userId);
  };

  const getTopThreeBarHeight = (rank, maxXP) => {
    const user = sortedUsers[rank - 1];
    if (!user) return 0;
    const baseHeight = 150;
    const maxHeight = 300;
    const percentage = user.xp / maxXP;
    return baseHeight + (maxHeight - baseHeight) * percentage;
  };

  const maxXP = Math.max(...sortedUsers.map(user => user.xp));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${1 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Floating geometric shapes */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute opacity-5 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${10 + Math.random() * 10}s`
            }}
          >
            {i % 4 === 0 && <Diamond className="w-8 h-8 text-purple-400" />}
            {i % 4 === 1 && <Gem className="w-6 h-6 text-blue-400" />}
            {i % 4 === 2 && <Star className="w-7 h-7 text-yellow-400" />}
            {i % 4 === 3 && <Sparkles className="w-5 h-5 text-pink-400" />}
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Enhanced Header Section */}
        <div className="text-center mb-16">
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 animate-ping bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full opacity-75"></div>
            <div className="relative inline-flex items-center justify-center w-32 h-32 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full shadow-2xl shadow-yellow-500/50 animate-bounce">
              <Trophy className="w-16 h-16 text-white" />
            </div>
          </div>
          <h1 className="text-8xl font-black bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 bg-clip-text text-transparent mb-6 animate-pulse tracking-tight">
            🏆 LEADERBOARD 🏆
          </h1>
          {/* <p className="text-3xl text-gray-300 font-bold mb-6 animate-fade-in">Where Learning Legends Are Born! 🚀✨</p> */}
          <div className="flex justify-center items-center gap-8 text-lg text-gray-300 bg-gray-800/30 backdrop-blur-sm rounded-2xl p-4 inline-flex border border-gray-700/50">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" />
              <span className="font-semibold">{users.length} Champions</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-400" />
              <span className="font-semibold">Live Rankings</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-400" />
              <span className="font-semibold">{currentTime.toLocaleTimeString()}</span>
            </div>
          </div>
        </div>

        {/* Top 3 Bars Visualization */}
        <div className="mb-12">
          <div className="flex justify-center items-end gap-12 mb-6">
            {[2, 1, 3].map((position) => {
              const user = sortedUsers[position - 1];
              if (!user) return null;
              
              const rankDisplay = getRankDisplay(position);
              const levelInfo = getLevelInfo(user.level);
              const barHeight = getTopThreeBarHeight(position, maxXP);
              
              return (
                <div key={user._id} className="text-center group cursor-pointer" onClick={() => toggleExpanded(user._id)}>
                  {/* User Avatar and Rank */}
                  <div className="mb-4 transform group-hover:scale-110 transition-all duration-300">
                    <div className={`${rankDisplay.bg} ${rankDisplay.glow} ${rankDisplay.border} w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-3`}>
                      {rankDisplay.icon}
                    </div>
                    <div className="text-white font-bold text-xl mb-1">{user.name}</div>
                    <div className={`text-sm font-bold text-white px-3 py-1 rounded-full inline-block bg-gradient-to-r ${levelInfo.color} shadow-lg`}>
                      {levelInfo.icon} {levelInfo.title} {user.level}
                    </div>
                  </div>
                  
                  {/* Animated Bar */}
                  <div className="relative">
                    <div 
                      className={`w-32 mx-auto rounded-t-2xl transition-all duration-2000 ease-out ${
                        position === 1 ? 'bg-gradient-to-t from-yellow-600 via-yellow-500 to-yellow-400' :
                        position === 2 ? 'bg-gradient-to-t from-gray-600 via-gray-500 to-gray-400' :
                        'bg-gradient-to-t from-orange-600 via-orange-500 to-orange-400'
                      } shadow-2xl relative overflow-hidden`}
                      style={{ 
                        height: showTopThreeBars ? `${barHeight}px` : '0px',
                        transform: showTopThreeBars ? 'scaleY(1)' : 'scaleY(0)',
                        transformOrigin: 'bottom'
                      }}
                    >
                      {/* Shimmer effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 animate-shimmer"></div>
                      
                      {/* XP Display */}
                      <div className="absolute top-4 left-0 right-0 text-center">
                        <div className="text-white font-bold text-lg drop-shadow-lg">
                          {user.xp.toLocaleString()}
                        </div>
                        <div className="text-white/80 text-sm drop-shadow-lg">XP</div>
                      </div>
                      
                      {/* Position indicator */}
                      <div className="absolute bottom-4 left-0 right-0 text-center">
                        <div className="text-white font-black text-3xl drop-shadow-lg">
                          #{position}
                        </div>
                      </div>
                    </div>
                    
                    {/* Base platform */}
                    <div className={`w-36 h-8 mx-auto rounded-b-xl ${
                      position === 1 ? 'bg-gradient-to-b from-yellow-500 to-yellow-700' :
                      position === 2 ? 'bg-gradient-to-b from-gray-500 to-gray-700' :
                      'bg-gradient-to-b from-orange-500 to-orange-700'
                    } shadow-xl border-4 border-gray-800/50`}>
                      <div className="text-white text-xs font-bold pt-1 text-center">
                        {user.accuracy || 0}% • {user.streak || 0} streak
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Enhanced Full Leaderboard */}
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
            {sortedUsers.map((user, index) => {
              const rank = index + 1;
              const rankDisplay = getRankDisplay(rank);
              const xpProgress = getXPProgress(user.xp, user.level);
              const levelInfo = getLevelInfo(user.level);
              const isExpanded = expandedUser === user._id;

              return (
                <div 
                  key={user._id} 
                  className={`rounded-2xl border-2 p-5 transition-all duration-500 hover:shadow-2xl cursor-pointer relative overflow-hidden ${
                    rank <= 3 
                      ? 'border-yellow-400/40 bg-gradient-to-r from-yellow-900/20 via-orange-900/20 to-pink-900/20' 
                      : 'border-gray-600/30 bg-gray-800/30'
                  } backdrop-blur-sm hover:border-purple-400/50 transform hover:scale-[1.02] group`}
                  onClick={() => toggleExpanded(user._id)}
                >
                  {/* Rank badge enhancement for top 3 */}
                  {/* {rank <= 3 && (
                    <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg animate-pulse">
                      TOP {rank}
                    </div>
                  )} */}
                  
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
            })}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
        
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        .animate-float {
          animation: float 15s ease-in-out infinite;
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Leaderboard;