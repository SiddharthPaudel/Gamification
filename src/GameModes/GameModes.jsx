import React from 'react';
import { motion } from 'framer-motion';
import { Puzzle, Brain, StickyNote } from 'lucide-react';

const games = [
  {
    title: 'Puzzle Challenge',
    description: 'Test your logic skills with brain-bending puzzles.',
    icon: <Puzzle className="w-10 h-10 text-indigo-600" />,
  },
  {
    title: 'Quiz Battle',
    description: 'Answer timed quizzes and climb the leaderboard!',
    icon: <Brain className="w-10 h-10 text-purple-600" />,
  },
  {
    title: 'Flashcard Frenzy',
    description: 'Boost your memory with fast-paced flashcards.',
    icon: <StickyNote className="w-10 h-10 text-pink-600" />,
  },
];

const GameModes = () => {
  return (
    <section className="bg-white py-16 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-10 text-gray-800">🎮 Choose Your Challenge</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {games.map((game, index) => (
            <motion.div
              key={index}
              className="bg-gray-100 rounded-xl p-6 shadow-md hover:shadow-lg transition cursor-pointer"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              whileHover={{ scale: 1.05 }}
              viewport={{ once: true }}
            >
              <div className="flex justify-center mb-4">
                {game.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">{game.title}</h3>
              <p className="text-sm text-gray-600">{game.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GameModes;
