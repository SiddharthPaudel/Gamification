import React, { useState, useEffect } from "react";
import { Play, Sparkles, ArrowRight, Brain, Puzzle, CreditCard } from "lucide-react";
import OwlMascot from "../OwlMascot/OwlMascot"; // adjust the path
const games = [
  {
    title: "Quiz",
    icon: Brain,
    color: "from-purple-500 to-pink-500",
    emoji: "🧠",
    desc: "Test your knowledge across exciting topics and unlock badges!"
  },
  {
    title: "Puzzle",
    icon: Puzzle,
    color: "from-green-500 to-emerald-500",
    emoji: "🧩",
    desc: "Challenge your brain with tricky logic puzzles and patterns."
  },
  {
    title: "Flashcard",
    icon: CreditCard,
    color: "from-blue-500 to-cyan-500",
    emoji: "📚",
    desc: "Master any topic using our spaced repetition flashcards."
  },
];

const HeroSection = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const change = setInterval(() => {
      setIndex((prev) => (prev + 1) % games.length);
    }, 4000);
    return () => clearInterval(change);
  }, []);

  const game = games[index];

  return (
    <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Glowing Circles */}
       <OwlMascot 
        // message="Welcome to Quiz " 
        position="absolute"
        positionProps={{ top: 95, left: 30 }}
      />
      <div className="absolute top-0 -left-40 w-80 h-80 bg-pink-500/20 blur-3xl rounded-full animate-pulse" />
      <div className="absolute bottom-0 -right-40 w-80 h-80 bg-purple-500/20 blur-3xl rounded-full animate-pulse delay-1000" />

      <div className="z-10 max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-2 gap-12 items-center">
        {/* Text Content */}
        <div>
          <div className="inline-flex items-center bg-white/10 border border-white/20 text-white px-4 py-2 rounded-full backdrop-blur">
            <Sparkles className="h-4 w-4 text-yellow-300 mr-2" />
            <span className="text-sm">Gamified Learning Platform</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-white mt-6 leading-tight">
            Play. Learn. <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Level Up.
            </span>
          </h1>

          <p className="text-gray-300 text-lg mt-6 max-w-xl">
            Engage with interactive games designed to boost your brainpower. Compete, earn rewards,
            and master topics with fun!
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-medium flex items-center hover:scale-105 transition-transform duration-300">
              <Play className="h-5 w-5 mr-2" />
              Start Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
            <button className="border border-white/20 text-white px-6 py-3 rounded-xl hover:bg-white/10 transition">
              Learn More
            </button>
          </div>
        </div>

        {/* Game Showcase Card */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 text-white shadow-xl backdrop-blur-md hover:scale-[1.01] transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className={`p-4 rounded-xl bg-gradient-to-r ${game.color}`}>
              <game.icon className="h-8 w-8 text-white" />
            </div>
            <span className="text-3xl">{game.emoji}</span>
          </div>
          <h3 className="text-2xl font-bold mt-4">{game.title}</h3>
          <p className="text-gray-300 mt-2 text-sm">{game.desc}</p>

          <button className={`mt-6 w-full bg-gradient-to-r ${game.color} text-white py-2 rounded-xl hover:scale-105 transition`}>
            Play {game.title}
          </button>

          {/* Dots */}
          <div className="flex justify-center mt-4 space-x-2">
            {games.map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i === index ? "bg-white" : "bg-white/20"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
