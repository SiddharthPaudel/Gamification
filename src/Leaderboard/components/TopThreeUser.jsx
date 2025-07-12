import React from 'react';
import { Crown, Medal, Award } from 'lucide-react';

const rankStyles = {
  1: {
    icon: <Crown className="w-8 h-8 text-yellow-100" />,
    bg: 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500',
    glow: 'shadow-yellow-400/60 shadow-2xl',
    border: 'border-4 border-yellow-300/50',
    barBg: 'bg-gradient-to-t from-yellow-600 via-yellow-500 to-yellow-400',
    baseBg: 'bg-gradient-to-b from-yellow-500 to-yellow-700',
  },
  2: {
    icon: <Medal className="w-8 h-8 text-gray-100" />,
    bg: 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500',
    glow: 'shadow-gray-400/60 shadow-2xl',
    border: 'border-4 border-gray-300/50',
    barBg: 'bg-gradient-to-t from-gray-600 via-gray-500 to-gray-400',
    baseBg: 'bg-gradient-to-b from-gray-500 to-gray-700',
  },
  3: {
    icon: <Award className="w-8 h-8 text-orange-100" />,
    bg: 'bg-gradient-to-br from-orange-400 via-red-400 to-pink-500',
    glow: 'shadow-orange-400/60 shadow-2xl',
    border: 'border-4 border-orange-300/50',
    barBg: 'bg-gradient-to-t from-orange-600 via-orange-500 to-orange-400',
    baseBg: 'bg-gradient-to-b from-orange-500 to-orange-700',
  },
};

const TopThreeUser = ({ user, position, maxXP, showBar, toggleExpanded }) => {
  const baseHeight = 150;
  const maxHeight = 300;
  const percentage = user.xp / maxXP;
  const barHeight = baseHeight + (maxHeight - baseHeight) * percentage;

  const style = rankStyles[position];

  return (
    <div className="text-center group cursor-pointer" onClick={() => toggleExpanded(user._id)}>
      <div className="mb-4 transform group-hover:scale-110 transition-all duration-300">
        <div className={`${style.bg} ${style.glow} ${style.border} w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-3`}>
          {style.icon}
        </div>
        <div className="text-white font-bold text-xl mb-1">{user.name}</div>
        <div className={`text-sm font-bold text-white px-3 py-1 rounded-full inline-block bg-gradient-to-r from-indigo-500 to-purple-700 shadow-lg`}>
          Level {user.level}
        </div>
      </div>

      <div className="relative">
        <div
          className={`w-32 mx-auto rounded-t-2xl transition-all duration-2000 ease-out ${style.barBg} shadow-2xl relative overflow-hidden`}
          style={{
            height: showBar ? `${barHeight}px` : '0px',
            transform: showBar ? 'scaleY(1)' : 'scaleY(0)',
            transformOrigin: 'bottom',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 animate-shimmer"></div>
          <div className="absolute top-4 left-0 right-0 text-center">
            <div className="text-white font-bold text-lg drop-shadow-lg">
              {user.xp.toLocaleString()}
            </div>
            <div className="text-white/80 text-sm drop-shadow-lg">XP</div>
          </div>
          <div className="absolute bottom-4 left-0 right-0 text-center">
            <div className="text-white font-black text-3xl drop-shadow-lg">#{position}</div>
          </div>
        </div>
        <div className={`${style.baseBg} w-36 h-8 mx-auto rounded-b-xl shadow-xl border-4 border-gray-800/50`}>
          <div className="text-white text-xs font-bold pt-1 text-center">
            {user.accuracy || 0}% • {user.streak || 0} streak
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(TopThreeUser);
