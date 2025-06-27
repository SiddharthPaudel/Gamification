import React from "react";

const letters = [
  ["T", "R", "E", "E"],
  ["U", "A", "E", "O"],
  ["P", "Z", "L", "Q"],
  ["X", "F", "L", "A"]
];

const Puzzle = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12">
      <h2 className="text-2xl font-semibold text-indigo-700 mb-6">Puzzle Mode</h2>
      <p className="text-sm text-gray-500 mb-8">Find the hidden word: "TREE"</p>
      <div className="grid grid-cols-4 gap-3">
        {letters.flat().map((char, i) => (
          <div
            key={i}
            className="w-16 h-16 flex items-center justify-center border border-gray-300 bg-white rounded-md text-xl font-bold text-gray-800 shadow-sm hover:bg-indigo-100 transition"
          >
            {char}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Puzzle;
