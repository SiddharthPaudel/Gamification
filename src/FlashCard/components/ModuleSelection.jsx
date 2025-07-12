import React from "react";
import { Brain, Sparkles, Target } from "lucide-react";

const ModuleSelection = ({ modules, onSelect }) => {
  return (
    <div className="w-full max-w-7xl px-6 py-12 mx-auto">
      <div className="text-center mb-16">
        <div className="flex items-center justify-center gap-4 mb-6">
          <Brain className="w-16 h-16 text-purple-400 animate-pulse" />
          <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            FlashCard Master
          </h1>
          <Sparkles className="w-16 h-16 text-yellow-400 animate-spin" />
        </div>
        <p className="text-2xl text-white/80 mb-4">Choose your learning adventure</p>
        <p className="text-lg text-white/60">Master new concepts with interactive flashcards</p>
      </div>

      <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Object.entries(modules).map(([mod, data]) => (
          <div
            key={mod}
            onClick={() => onSelect(mod)}
            className="group cursor-pointer transform hover:scale-105 transition-all duration-500 hover:rotate-1"
          >
            <div className={`relative bg-gradient-to-br ${data.color} rounded-3xl p-8 shadow-2xl hover:shadow-3xl border border-white/20`}>
              <div className="relative z-10 text-center">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300 animate-bounce">
                  {data.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{mod}</h3>
                <p className="text-white/80 text-sm mb-4">{data.description}</p>

                <div className="flex justify-between items-center mb-4">
                  <div className="bg-white/20 rounded-full px-3 py-1 text-white/90 text-sm">
                    {data.cards.length} cards
                  </div>
                  <div className="bg-white/20 rounded-full px-3 py-1 text-white/90 text-sm">
                    {data.difficulty}
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 text-white/60 text-sm">
                  <Target className="w-4 h-4" />
                  <span>Start Learning</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModuleSelection;
