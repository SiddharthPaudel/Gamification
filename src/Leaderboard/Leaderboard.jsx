import React, { useState, useEffect } from 'react';
import {
  Trophy, Crown, Medal, Award, Star, Zap, Target, BookOpen, Users, Activity, Calendar,
  ChevronDown, ChevronUp, Flame, TrendingUp, Heart, Gem
} from 'lucide-react';

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [expandedUser, setExpandedUser] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showTopThreeBars, setShowTopThreeBars] = useState(false);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/leaderboard/level');
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
      }
    };

    fetchLeaderboard();

    // Update time every minute instead of every second
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    // Show top three bars with a slight delay for staggered animation
    setTimeout(() => {
      setShowTopThreeBars(true);
    }, 800);

    return () => {
      clearInterval(timeInterval);
    };
  }, []);

  const sortedUsers = [...users];

  const getRankDisplay = (rank) => {
    switch (rank) {
      case 1:
        return {
          icon: <Crown className="w-8 h-8 text-yellow-100" />,
          bg: 'bg-yellow-500',
          border: 'border-2 border-yellow-300'
        };
      case 2:
        return {
          icon: <Medal className="w-8 h-8 text-gray-100" />,
          bg: 'bg-gray-500',
          border: 'border-2 border-gray-300'
        };
      case 3:
        return {
          icon: <Award className="w-8 h-8 text-orange-100" />,
          bg: 'bg-orange-500',
          border: 'border-2 border-orange-300'
        };
      default:
        return {
          icon: <span className="text-xl font-bold text-white">#{rank}</span>,
          bg: 'bg-purple-500',
          border: 'border-2 border-purple-300'
        };
    }
  };

  const getLevelInfo = (level) => {
    if (level >= 15) return { 
      color: 'bg-purple-500', 
      title: 'Table Top', 
      icon: '👑'
    };
    if (level >= 10) return { 
      color: 'bg-blue-500', 
      title: 'Expert', 
      icon: '🔥'
    };
    if (level >= 5) return { 
      color: 'bg-green-500', 
      title: 'Pro', 
      icon: '⚡'
    };
    return { 
      color: 'bg-gray-500', 
      title: 'Novice', 
      icon: '🌟'
    };
  };

  const getXPProgress = (currentXP, level) => {
    const baseXP = (level - 1) * 200;
    const nextLevelXP = level * 200;
    const progress = ((currentXP - baseXP) / (nextLevelXP - baseXP)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  const getStreakColor = (streak) => {
    if (streak >= 30) return 'bg-red-500';
    if (streak >= 20) return 'bg-orange-500';
    if (streak >= 10) return 'bg-yellow-500';
    return 'bg-blue-500';
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

  const getAnimationDelay = (position) => {
    // Staggered animation: 2nd place first, then 1st, then 3rd
    const delays = { 2: 0.2, 1: 0.6, 3: 1.0 };
    return delays[position] || 0;
  };

  const maxXP = Math.max(...sortedUsers.map(user => user.xp));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-yellow-500 rounded-full shadow-lg mb-6">
            <Trophy className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-6xl font-black text-white mb-6">
            🏆 LEADERBOARD 🏆
          </h1>
          <div className="flex justify-center items-center gap-6 text-lg text-gray-300 bg-gray-800 rounded-2xl p-4 inline-flex border border-gray-700">
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
              const animationDelay = getAnimationDelay(position);
              
              return (
                <div 
                  key={user._id} 
                  className="text-center group cursor-pointer transform transition-all duration-300 hover:scale-105"
                  onClick={() => toggleExpanded(user._id)}
                >
                  <div className="mb-4">
                    <div className={`${rankDisplay.bg} ${rankDisplay.border} w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg transform transition-all duration-300 group-hover:rotate-12 group-hover:shadow-2xl`}>
                      {rankDisplay.icon}
                    </div>
                    <div className="text-white font-bold text-xl mb-1 transform transition-all duration-300 group-hover:scale-110">{user.name}</div>
                    <div className={`text-sm font-bold text-white px-3 py-1 rounded-full inline-block ${levelInfo.color} shadow-lg transform transition-all duration-300 group-hover:scale-105`}>
                      {levelInfo.icon} {levelInfo.title} {user.level}
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div 
                      className={`w-32 mx-auto rounded-t-2xl ${
                        position === 1 ? 'bg-gradient-to-t from-yellow-600 to-yellow-400' :
                        position === 2 ? 'bg-gradient-to-t from-gray-600 to-gray-400' :
                        'bg-gradient-to-t from-orange-600 to-orange-400'
                      } shadow-lg transform transition-all duration-500 group-hover:scale-105 relative overflow-hidden`}
                      style={{ 
                        height: showTopThreeBars ? `${barHeight}px` : '0px',
                        transition: `height 1.2s ease-out ${animationDelay}s`
                      }}
                    >
                      {/* Animated shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 animate-shine"></div>
                      
                      {/* Floating particles */}
                      <div className="absolute inset-0 opacity-40">
                        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-float-1"></div>
                        <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-white rounded-full animate-float-2"></div>
                        <div className="absolute top-3/4 left-1/2 w-1.5 h-1.5 bg-white rounded-full animate-float-3"></div>
                      </div>
                      
                      <div className="absolute top-4 left-0 right-0 text-center">
                        <div className="text-white font-bold text-lg">
                          {user.xp.toLocaleString()}
                        </div>
                        <div className="text-white/80 text-sm">XP</div>
                      </div>
                      
                      <div className="absolute bottom-4 left-0 right-0 text-center">
                        <div className="text-white font-black text-3xl">
                          #{position}
                        </div>
                      </div>
                    </div>
                    
                    <div className={`w-36 h-8 mx-auto rounded-b-xl ${
                      position === 1 ? 'bg-yellow-700' :
                      position === 2 ? 'bg-gray-700' :
                      'bg-orange-700'
                    } shadow-lg border-2 border-gray-800 transform transition-all duration-300 group-hover:scale-105`}>
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

        {/* Full Leaderboard */}
        <div className="bg-gray-800 rounded-3xl shadow-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-black text-white flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-purple-400" />
              Complete Rankings
            </h2>
            <div className="flex items-center gap-3 text-sm text-gray-300 bg-gray-700 px-3 py-2 rounded-full">
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
                  className={`rounded-2xl border-2 p-5 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
                    rank <= 3 
                      ? 'border-yellow-400 bg-yellow-900/20 hover:bg-yellow-900/30' 
                      : 'border-gray-600 bg-gray-800 hover:bg-gray-700'
                  }`}
                  onClick={() => toggleExpanded(user._id)}
                >
                  <div className="flex items-center space-x-6">
                    <div className={`${rankDisplay.bg} ${rankDisplay.border} w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 hover:rotate-6`}>
                      {rankDisplay.icon}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-4">
                          <h3 className="text-2xl font-black text-white transition-all duration-300 hover:text-yellow-400">
                            {user.name}
                          </h3>
                          <div className={`px-4 py-2 rounded-full ${levelInfo.color} text-white text-sm font-bold shadow-lg transition-all duration-300 hover:scale-105`}>
                            {levelInfo.icon} {levelInfo.title} {user.level}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-black text-yellow-400 animate-pulse">
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
                        <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-1000 ease-out" 
                            style={{ width: `${xpProgress}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6 text-sm">
                          <div className={`flex items-center px-3 py-1 rounded-full ${getStreakColor(user.streak || 0)} text-white font-bold shadow-lg transition-all duration-300 hover:scale-105`}>
                            <Flame className="w-4 h-4 mr-2 animate-pulse" />
                            <span>{user.streak || 0} day streak</span>
                          </div>
                          <div className="flex items-center text-purple-400 font-bold transition-all duration-300 hover:scale-105">
                            <Star className="w-4 h-4 mr-2" />
                            <span>{user.badges?.length || 0} badges</span>
                          </div>
                          <div className="flex items-center text-blue-400 font-bold transition-all duration-300 hover:scale-105">
                            <Target className="w-4 h-4 mr-2" />
                            <span>{user.accuracy || 0}% accuracy</span>
                          </div>
                        </div>
                        <div className="text-gray-400 transition-all duration-300 hover:scale-110">
                          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="mt-6 pt-6 border-t border-gray-700 animate-fade-in">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-gray-700 rounded-xl p-4 text-center transition-all duration-300 hover:scale-105 hover:bg-gray-600">
                              <BookOpen className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                              <div className="text-xl font-black text-white">{user.totalChallenges || 0}</div>
                              <div className="text-xs text-gray-400 font-semibold">Challenges</div>
                            </div>
                            <div className="bg-gray-700 rounded-xl p-4 text-center transition-all duration-300 hover:scale-105 hover:bg-gray-600">
                              <Zap className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                              <div className="text-xl font-black text-white">{user.level}</div>
                              <div className="text-xs text-gray-400 font-semibold">Level</div>
                            </div>
                            <div className="bg-gray-700 rounded-xl p-4 text-center transition-all duration-300 hover:scale-105 hover:bg-gray-600">
                              <Heart className="w-6 h-6 text-red-400 mx-auto mb-2" />
                              <div className="text-xl font-black text-white">{user.accuracy || 0}%</div>
                              <div className="text-xs text-gray-400 font-semibold">Accuracy</div>
                            </div>
                            <div className="bg-gray-700 rounded-xl p-4 text-center transition-all duration-300 hover:scale-105 hover:bg-gray-600">
                              <Gem className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                              <div className="text-xl font-black text-white">{user.badges?.length || 0}</div>
                              <div className="text-xs text-gray-400 font-semibold">Badges</div>
                            </div>
                          </div>
                          {user.badges && user.badges.length > 0 && (
                            <div className="mt-4 animate-fade-in">
                              <div className="text-sm text-gray-400 mb-2 font-semibold">Badges Earned:</div>
                              <div className="flex flex-wrap gap-2">
                                {user.badges.map((badge, i) => (
                                  <span key={i} className="text-2xl transition-all duration-300 hover:scale-125">
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
        @keyframes slideUpBounce {
          0% { transform: translateY(100px); opacity: 0; }
          50% { transform: translateY(-20px); opacity: 0.8; }
          100% { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes slideInLeft {
          from { transform: translateX(-100px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fadeInUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes shine {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
        
        @keyframes float1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(180deg); }
        }
        
        @keyframes float2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(-180deg); }
        }
        
        @keyframes float3 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(90deg); }
        }
        
        .animate-fade-in { animation: fadeIn 1s ease-out; }
        .animate-fade-in-up { animation: fadeInUp 0.8s ease-out; }
        .animate-slide-up { animation: slideUp 0.6s ease-out; }
        .animate-shine { animation: shine 2s ease-in-out infinite; }
        .animate-float-1 { animation: float1 3s ease-in-out infinite; }
        .animate-float-2 { animation: float2 3s ease-in-out infinite 0.5s; }
        .animate-float-3 { animation: float3 3s ease-in-out infinite 1s; }
      `}</style>
    </div>
  );
};

export default Leaderboard;