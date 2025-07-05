import React, { useState, useEffect, useCallback } from 'react';
import { Search, RefreshCw, Trophy, Clock, Eye, EyeOff } from 'lucide-react';

const WordSearchGame = () => {
  const [grid, setGrid] = useState([]);
  const [words, setWords] = useState([]);
  const [foundWords, setFoundWords] = useState(new Set());
  const [selectedCells, setSelectedCells] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [startCell, setStartCell] = useState(null);
  const [currentWord, setCurrentWord] = useState('');
  const [score, setScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [showWords, setShowWords] = useState(true);
  const [difficulty, setDifficulty] = useState('medium');
  const [theme, setTheme] = useState('animals');

  const themes = {
    animals: ['CAT', 'DOG', 'BIRD', 'FISH', 'LION', 'BEAR', 'WOLF', 'DEER'],
    colors: ['RED', 'BLUE', 'GREEN', 'YELLOW', 'PURPLE', 'ORANGE', 'PINK', 'BLACK'],
    food: ['PIZZA', 'BURGER', 'PASTA', 'SALAD', 'BREAD', 'CHEESE', 'APPLE', 'GRAPE'],
    nature: ['TREE', 'FLOWER', 'RIVER', 'MOUNTAIN', 'FOREST', 'OCEAN', 'DESERT', 'VALLEY']
  };

  const difficulties = {
    easy: { size: 10, wordCount: 5 },
    medium: { size: 12, wordCount: 6 },
    hard: { size: 15, wordCount: 8 }
  };

  // Timer effect
  useEffect(() => {
    let timer;
    if (gameStarted && foundWords.size < words.length) {
      timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameStarted, foundWords.size, words.length]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const directions = [
    [0, 1], [1, 0], [1, 1], [1, -1], [0, -1], [-1, 0], [-1, -1], [-1, 1]
  ];

  const generateGrid = useCallback(() => {
    const { size, wordCount } = difficulties[difficulty];
    const selectedWords = themes[theme].slice(0, wordCount);
    const newGrid = Array(size).fill().map(() => Array(size).fill(''));
    const placedWords = [];

    // Place words in grid
    selectedWords.forEach(word => {
      let placed = false;
      let attempts = 0;
      
      while (!placed && attempts < 100) {
        const direction = directions[Math.floor(Math.random() * directions.length)];
        const startRow = Math.floor(Math.random() * size);
        const startCol = Math.floor(Math.random() * size);
        
        if (canPlaceWord(newGrid, word, startRow, startCol, direction, size)) {
          placeWord(newGrid, word, startRow, startCol, direction);
          placedWords.push({
            word,
            cells: getWordCells(startRow, startCol, direction, word.length)
          });
          placed = true;
        }
        attempts++;
      }
    });

    // Fill empty cells with random letters
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (newGrid[i][j] === '') {
          newGrid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        }
      }
    }

    setGrid(newGrid);
    setWords(placedWords);
    setFoundWords(new Set());
    setScore(0);
    setTimeElapsed(0);
    setGameStarted(true);
  }, [difficulty, theme]);

  const canPlaceWord = (grid, word, row, col, direction, size) => {
    for (let i = 0; i < word.length; i++) {
      const newRow = row + direction[0] * i;
      const newCol = col + direction[1] * i;
      
      if (newRow < 0 || newRow >= size || newCol < 0 || newCol >= size) {
        return false;
      }
      
      if (grid[newRow][newCol] !== '' && grid[newRow][newCol] !== word[i]) {
        return false;
      }
    }
    return true;
  };

  const placeWord = (grid, word, row, col, direction) => {
    for (let i = 0; i < word.length; i++) {
      const newRow = row + direction[0] * i;
      const newCol = col + direction[1] * i;
      grid[newRow][newCol] = word[i];
    }
  };

  const getWordCells = (row, col, direction, length) => {
    const cells = [];
    for (let i = 0; i < length; i++) {
      cells.push(`${row + direction[0] * i}-${col + direction[1] * i}`);
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
      setCurrentWord(cells.map(cell => {
        const [r, c] = cell.split('-').map(Number);
        return grid[r][c];
      }).join(''));
    }
  };

  const handleMouseUp = () => {
    if (isSelecting) {
      checkWord();
      setIsSelecting(false);
      setStartCell(null);
      setSelectedCells([]);
      setCurrentWord('');
    }
  };

  const getLineCells = (startRow, startCol, endRow, endCol) => {
    const cells = [];
    const deltaRow = endRow - startRow;
    const deltaCol = endCol - startCol;
    
    // Check if it's a valid line (horizontal, vertical, or diagonal)
    if (deltaRow === 0 || deltaCol === 0 || Math.abs(deltaRow) === Math.abs(deltaCol)) {
      const steps = Math.max(Math.abs(deltaRow), Math.abs(deltaCol));
      const stepRow = steps === 0 ? 0 : deltaRow / steps;
      const stepCol = steps === 0 ? 0 : deltaCol / steps;
      
      for (let i = 0; i <= steps; i++) {
        const row = startRow + Math.round(stepRow * i);
        const col = startCol + Math.round(stepCol * i);
        cells.push(`${row}-${col}`);
      }
    }
    
    return cells;
  };

  const checkWord = () => {
    const selectedWord = currentWord;
    const reversedWord = selectedWord.split('').reverse().join('');
    
    words.forEach(wordObj => {
      if ((wordObj.word === selectedWord || wordObj.word === reversedWord) && 
          !foundWords.has(wordObj.word)) {
        setFoundWords(prev => new Set([...prev, wordObj.word]));
        setScore(prev => prev + wordObj.word.length * 10);
      }
    });
  };

  const getFoundWordCells = () => {
    const cells = new Set();
    words.forEach(wordObj => {
      if (foundWords.has(wordObj.word)) {
        wordObj.cells.forEach(cell => cells.add(cell));
      }
    });
    return cells;
  };

  const resetGame = () => {
    generateGrid();
  };

  const isGameComplete = foundWords.size === words.length;

  // Initialize game
  useEffect(() => {
    generateGrid();
  }, [generateGrid]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Search className="w-8 h-8" />
            Word Search Adventure
          </h1>
          <p className="text-blue-200">Find all hidden words in the grid!</p>
        </div>

        {/* Game Controls */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 mb-6 border border-white/20">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-4 items-center">
              <div>
                <label className="block text-white text-sm mb-1">Theme</label>
                <select 
                  value={theme} 
                  onChange={(e) => setTheme(e.target.value)}
                  className="px-3 py-2 bg-white/20 text-white rounded-lg border border-white/30"
                >
                  <option value="animals">Animals</option>
                  <option value="colors">Colors</option>
                  <option value="food">Food</option>
                  <option value="nature">Nature</option>
                </select>
              </div>
              <div>
                <label className="block text-white text-sm mb-1">Difficulty</label>
                <select 
                  value={difficulty} 
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="px-3 py-2 bg-white/20 text-white rounded-lg border border-white/30"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-4 items-center">
              <button
                onClick={() => setShowWords(!showWords)}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors"
              >
                {showWords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showWords ? 'Hide Words' : 'Show Words'}
              </button>
              
              <button
                onClick={resetGame}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                New Game
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Game Grid */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-white">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    <span className="font-bold">Score: {score}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white">
                    <Clock className="w-5 h-5 text-blue-400" />
                    <span className="font-bold">{formatTime(timeElapsed)}</span>
                  </div>
                </div>
                <div className="text-white">
                  <span className="font-bold">{foundWords.size}/{words.length}</span> Words Found
                </div>
              </div>

              <div 
                className="grid gap-1 w-fit mx-auto select-none"
                style={{ gridTemplateColumns: `repeat(${grid.length}, 1fr)` }}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                {grid.map((row, rowIndex) =>
                  row.map((cell, colIndex) => {
                    const cellKey = `${rowIndex}-${colIndex}`;
                    const isSelected = selectedCells.includes(cellKey);
                    const isFound = getFoundWordCells().has(cellKey);
                    
                    return (
                      <div
                        key={cellKey}
                        className={`
                          w-10 h-10 flex items-center justify-center text-lg font-bold cursor-pointer
                          border-2 transition-all duration-200
                          ${isSelected 
                            ? 'bg-yellow-400 text-black border-yellow-600 scale-110' 
                            : isFound 
                              ? 'bg-green-400 text-black border-green-600' 
                              : 'bg-white/20 text-white border-white/30 hover:bg-white/30'
                          }
                        `}
                        onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                        onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                      >
                        {cell}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Words List */}
          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">Words to Find</h3>
              {showWords && (
                <div className="space-y-2">
                  {words.map((wordObj, index) => (
                    <div
                      key={index}
                      className={`
                        px-4 py-2 rounded-lg transition-all duration-300
                        ${foundWords.has(wordObj.word)
                          ? 'bg-green-500 text-white line-through'
                          : 'bg-white/20 text-white hover:bg-white/30'
                        }
                      `}
                    >
                      {wordObj.word}
                    </div>
                  ))}
                </div>
              )}
              {!showWords && (
                <div className="text-center py-8 text-white/70">
                  <Eye className="w-8 h-8 mx-auto mb-2" />
                  <p>Words are hidden for extra challenge!</p>
                </div>
              )}
            </div>

            {/* Game Complete */}
            {isGameComplete && (
              <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-xl p-6 text-center text-white">
                <Trophy className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
                <h3 className="text-2xl font-bold mb-2">Congratulations!</h3>
                <p className="mb-2">You found all words!</p>
                <p className="text-lg">
                  Final Score: <span className="font-bold">{score}</span>
                </p>
                <p className="text-sm mb-4">
                  Time: {formatTime(timeElapsed)}
                </p>
                <button
                  onClick={resetGame}
                  className="px-6 py-3 bg-white text-blue-600 rounded-lg font-bold hover:bg-gray-100 transition-colors"
                >
                  Play Again
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordSearchGame;