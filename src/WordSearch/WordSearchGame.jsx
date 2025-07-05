import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext/AuthContext";
import toast from "react-hot-toast";
import { Search, RefreshCw, Trophy, Eye, EyeOff } from "lucide-react";

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

const WordSearchGame = () => {
  const { user, updateUserProfile } = useAuth();
  const userId = user?.id;

  const [grid, setGrid] = useState([]);
  const [words, setWords] = useState([]);
  const [foundWords, setFoundWords] = useState(new Set());
  const [selectedCells, setSelectedCells] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [startCell, setStartCell] = useState(null);
  const [currentWord, setCurrentWord] = useState("");
  const [xpEarned, setXpEarned] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [attemptSubmitted, setAttemptSubmitted] = useState(false);
  const [showWords, setShowWords] = useState(true);

  const fetchDailyPuzzle = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/dailywordfinder/today");
      setGrid(res.data.grid);
      setWords(res.data.words.map((w) => ({ word: w.toUpperCase(), cells: [] })));
      setFoundWords(new Set());
      setSelectedCells([]);
      setTimeElapsed(0);
      setGameStarted(true);
      setAttemptSubmitted(false);
      setXpEarned(0);
    } catch (error) {
      toast.error("Failed to load daily puzzle.");
    }
  }, []);

  useEffect(() => {
    fetchDailyPuzzle();
  }, [fetchDailyPuzzle]);

  useEffect(() => {
    let timer;
    if (gameStarted && foundWords.size < words.length) {
      timer = setInterval(() => setTimeElapsed((t) => t + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [gameStarted, foundWords, words.length]);

  const getLineCells = (startRow, startCol, endRow, endCol) => {
    const cells = [];
    const dRow = endRow - startRow;
    const dCol = endCol - startCol;
    if (dRow === 0 || dCol === 0 || Math.abs(dRow) === Math.abs(dCol)) {
      const steps = Math.max(Math.abs(dRow), Math.abs(dCol));
      const stepRow = steps === 0 ? 0 : dRow / steps;
      const stepCol = steps === 0 ? 0 : dCol / steps;
      for (let i = 0; i <= steps; i++) {
        const r = startRow + Math.round(stepRow * i);
        const c = startCol + Math.round(stepCol * i);
        cells.push(`${r}-${c}`);
      }
    }
    return cells;
  };

  const handleMouseDown = (row, col) => {
    setIsSelecting(true);
    setStartCell({ row, col });
    setSelectedCells([`${row}-${col}`]);
    setCurrentWord(grid[row][col]);
  };

  const handleMouseEnter = (row, col) => {
    if (isSelecting && startCell) {
      const cells = getLineCells(startCell.row, startCell.col, row, col);
      setSelectedCells(cells);
      setCurrentWord(
        cells
          .map((cell) => {
            const [r, c] = cell.split("-").map(Number);
            return grid[r][c];
          })
          .join("")
      );
    }
  };

  const handleMouseUp = () => {
    if (isSelecting) {
      checkWord();
      setIsSelecting(false);
      setStartCell(null);
      setSelectedCells([]);
      setCurrentWord("");
    }
  };

  const checkWord = () => {
    const selectedWord = currentWord.toUpperCase();
    const reversedWord = selectedWord.split("").reverse().join("");
    words.forEach((wordObj) => {
      if (
        (wordObj.word === selectedWord || wordObj.word === reversedWord) &&
        !foundWords.has(wordObj.word)
      ) {
        wordObj.cells = [...selectedCells];
        setFoundWords((prev) => new Set([...prev, wordObj.word]));
      }
    });
  };

  const submitAttempt = async () => {
    if (!userId || attemptSubmitted) return;
    try {
      const foundWordsArray = Array.from(foundWords);
      const res = await axios.post(
        `http://localhost:5000/api/dailywordfinder/attempt/${userId}`,
        { foundWords: foundWordsArray }
      );
      const data = res.data;
      setXpEarned(data.xpEarned || 0);
      const updatedUser = {
        ...user,
        xp: data.currentXP ?? user.xp,
        level: data.newLevel ?? user.level,
        badges: data.badges ?? user.badges,
      };
      updateUserProfile(updatedUser);
      toast.success(`🎉 Puzzle Complete! XP +${data.xpEarned}, Level ${data.newLevel}`);
      setAttemptSubmitted(true);
    } catch (error) {
      toast.error("Failed to submit puzzle attempt.");
    }
  };

  useEffect(() => {
    if (
      gameStarted &&
      foundWords.size === words.length &&
      !attemptSubmitted
    ) {
      submitAttempt();
    }
  }, [foundWords, words.length, attemptSubmitted, gameStarted]);

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Right Side: Words */}
        <div className="col-span-1 space-y-6">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Search className="w-6 h-6" /> Word Puzzle
          </h1>

          <button
            onClick={() => setShowWords(!showWords)}
            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded"
          >
            {showWords ? <EyeOff /> : <Eye />}
            {showWords ? "Hide Words" : "Show Words"}
          </button>

          {showWords && (
            <div>
              <h2 className="text-xl font-bold mb-2">Words to Find</h2>
              <ul className="grid grid-cols-1 gap-2">
                {words.map(({ word }) => (
                  <li
                    key={word}
                    className={`px-3 py-1 rounded text-center ${
                      foundWords.has(word)
                        ? "bg-green-600 line-through"
                        : "bg-white/20"
                    }`}
                  >
                    {word}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {attemptSubmitted && (
            <div className="bg-green-700 p-4 rounded text-center mt-4">
              <Trophy className="mx-auto text-yellow-300 w-8 h-8" />
              <p className="font-bold text-lg mt-2">XP Earned: +{xpEarned}</p>
            </div>
          )}
        </div>

        {/* Left Side: Puzzle Grid */}
        <div className="col-span-3">
          <div className="mb-4 flex gap-6 flex-wrap items-center">
            <div>
              Time: <strong>{formatTime(timeElapsed)}</strong>
            </div>
            <div>
              Found: <strong>{foundWords.size}</strong> / {words.length}
            </div>
            <button
              onClick={fetchDailyPuzzle}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 px-4 py-2 rounded"
            >
              <RefreshCw /> New Puzzle
            </button>
          </div>

          <div
            className="grid gap-1 w-fit mx-auto select-none"
            style={{ gridTemplateColumns: `repeat(${grid.length || 0}, 1fr)` }}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {grid.map((row, rIdx) =>
              row.map((char, cIdx) => {
                const cellKey = `${rIdx}-${cIdx}`;
                const isSelected = selectedCells.includes(cellKey);
                const isFound = words.some(
                  (w) => foundWords.has(w.word) && w.cells.includes(cellKey)
                );
                return (
                  <div
                    key={cellKey}
                    onMouseDown={() => handleMouseDown(rIdx, cIdx)}
                    onMouseEnter={() => handleMouseEnter(rIdx, cIdx)}
                    className={`w-10 h-10 flex items-center justify-center border-2 cursor-pointer
                      ${
                        isSelected
                          ? "bg-yellow-400 text-black border-yellow-600 scale-110"
                          : isFound
                          ? "bg-green-400 text-black border-green-600"
                          : "bg-white/20 border-white/30 text-white hover:bg-white/30"
                      }`}
                  >
                    {char}
                  </div>
                );
              })
            )}
          </div>

          {attemptSubmitted && (
            <div className="mt-10 text-center bg-green-600 bg-opacity-60 p-6 rounded-lg">
              <Trophy className="mx-auto w-14 h-14 mb-4 text-yellow-400 animate-bounce" />
              <h3 className="text-3xl font-bold mb-2">Congratulations!</h3>
              <p>You found all words!</p>
              <p>XP Earned: +{xpEarned}</p>
              <p>Time Taken: {formatTime(timeElapsed)}</p>
              <button
                onClick={fetchDailyPuzzle}
                className="mt-4 bg-white text-green-700 font-bold px-6 py-3 rounded hover:bg-gray-100"
              >
                Play Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WordSearchGame;
