// controllers/dailyWordFinderController.js
import DailyWordFinder from "../models/DailyWordFinder.js";
import User from "../models/User.js";

// Create a new daily puzzle
// export const createDailyPuzzle = async (req, res) => {
//   const { date, words, grid } = req.body;

//   try {
//     const exists = await DailyWordFinder.findOne({ date });
//     if (exists) {
//       return res.status(400).json({ message: "Puzzle for this date already exists." });
//     }

//     const puzzle = new DailyWordFinder({ date, words, grid });
//     await puzzle.save();
//     res.status(201).json({ message: "Daily puzzle created", puzzle });
//   } catch (err) {
//     res.status(500).json({ message: "Error creating puzzle", error: err.message });
//   }
// };
function generateGrid(size, words) {
  const grid = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => "")
  );

  const directions = [
    [0, 1],  // → horizontal
    [1, 0],  // ↓ vertical
  ];

  const placeWord = (word) => {
    word = word.toUpperCase();
    let placed = false;
    let attempts = 0;

    while (!placed && attempts < 100) {
      attempts++;
      const dir = directions[Math.floor(Math.random() * directions.length)];
      const row = Math.floor(Math.random() * size);
      const col = Math.floor(Math.random() * size);

      const endRow = row + dir[0] * (word.length - 1);
      const endCol = col + dir[1] * (word.length - 1);

      if (endRow < size && endCol < size) {
        let canPlace = true;

        for (let i = 0; i < word.length; i++) {
          const r = row + dir[0] * i;
          const c = col + dir[1] * i;
          const cell = grid[r][c];
          if (cell && cell !== word[i]) {
            canPlace = false;
            break;
          }
        }

        if (canPlace) {
          for (let i = 0; i < word.length; i++) {
            const r = row + dir[0] * i;
            const c = col + dir[1] * i;
            grid[r][c] = word[i];
          }
          placed = true;
        }
      }
    }
  };

  // Place all input words
  words.forEach(placeWord);

  // Fill empty spots with random letters
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!grid[r][c]) {
        grid[r][c] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      }
    }
  }

  return grid;
}


export const createDailyPuzzle = async (req, res) => {
  const { words } = req.body;
  const today = new Date().toISOString().split("T")[0];

  if (!words || !Array.isArray(words) || words.length === 0) {
    return res.status(400).json({ message: "Words array required" });
  }

  try {
    const exists = await DailyWordFinder.findOne({ date: today });
    if (exists) {
      return res.status(400).json({ message: "Puzzle already exists for today" });
    }

    const maxWordLength = Math.max(...words.map((w) => w.length));
    const gridSize = Math.max(10, maxWordLength + 2); // auto-resize based on longest word
    const upperWords = words.map((w) => w.trim().toUpperCase());

    const grid = generateGrid(gridSize, upperWords);

    const newPuzzle = new DailyWordFinder({
      date: today,
      words: upperWords,
      grid,
    });

    await newPuzzle.save();

    res.status(201).json({ message: "Daily puzzle created", grid, words: upperWords });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


// Get today's puzzle
// export const getTodayPuzzle = async (req, res) => {
//   const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

//   try {
//     const puzzle = await DailyWordFinder.findOne({ date: today });
//     if (!puzzle) return res.status(404).json({ message: "No puzzle for today." });
//     res.json(puzzle);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching puzzle", error: err.message });
//   }
// };

export const getTodayPuzzle = async (req, res) => {
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  try {
    // Try to fetch today's puzzle
    let puzzle = await DailyWordFinder.findOne({ date: today });

    if (!puzzle) {
      // If not found, return the most recent available puzzle in DB
      puzzle = await DailyWordFinder.findOne().sort({ date: -1 }); // latest puzzle regardless of date
      if (!puzzle) {
        return res.status(404).json({ message: "No puzzles available in the database." });
      }
    }

    res.json(puzzle);
  } catch (err) {
    res.status(500).json({ message: "Error fetching puzzle", error: err.message });
  }
};


// Attempt daily puzzle
// export const attemptDailyPuzzle = async (req, res) => {
//   const { userId } = req.params;
//   const { foundWords } = req.body;
//   const today = new Date().toISOString().split("T")[0];

//   try {
//     const puzzle = await DailyWordFinder.findOne({ date: today });
//     const user = await User.findById(userId);

//     if (!puzzle) return res.status(404).json({ message: "Puzzle not found" });
//     if (!user) return res.status(404).json({ message: "User not found" });

//     const correctWords = foundWords.filter(word =>
//       puzzle.words.includes(word.trim().toLowerCase())
//     );

//     const xpEarned = correctWords.length * 5;
//     user.xp += xpEarned;

//     while (user.xp >= user.level * 100) {
//       user.xp -= user.level * 100;
//       user.level++;
//     }

//     // Badge example
//     if (correctWords.length >= 5 && !user.badges.includes("Daily Solver")) {
//       user.badges.push("Daily Solver");
//     }

//     await user.save();

//     res.json({
//       message: "Daily puzzle completed",
//       correctCount: correctWords.length,
//       xpEarned,
//       level: user.level,
//       xp: user.xp,
//       badges: user.badges,
//     });
//   } catch (err) {
//     res.status(500).json({ message: "Error attempting puzzle", error: err.message });
//   }
// };


// const XP_PER_LEVEL = 100;

// export const attemptDailyPuzzle = async (req, res) => {
//   const { userId } = req.params;
//   const { foundWords } = req.body;
//   const today = new Date().toISOString().split("T")[0];

//   try {
//     const puzzle = await DailyWordFinder.findOne({ date: today });
//     const user = await User.findById(userId);

//     if (!puzzle) return res.status(404).json({ message: "Puzzle not found for today" });
//     if (!user) return res.status(404).json({ message: "User not found" });

//     const correctWords = foundWords.filter(word =>
//       puzzle.words.includes(word.trim().toUpperCase())
//     );

//     // Update user's game progress
//     user.gameProgress.wordFinder.totalPlayed += foundWords.length;
//     user.gameProgress.wordFinder.totalCorrect += correctWords.length;

//     // XP & Level logic
//     const earnedXp = correctWords.length * 10; // 10 XP per correct word
//     user.xp = (user.xp || 0) + earnedXp;
//     user.level = Math.floor(user.xp / XP_PER_LEVEL) + 1;

//     // Badge awarding
//     if (
//       user.gameProgress.wordFinder.totalCorrect >= 10 &&
//       !user.badges.includes("Word Wizard")
//     ) {
//       user.badges.push("Word Wizard");
//     }

//     await user.save();
// res.status(200).json({
//   message: "Puzzle submitted",
//   correctWords,
//   totalFound: foundWords.length,
//   xpEarned: earnedXp,
//   currentXP: user.xp, // ✅ This line is missing in your version
//   newLevel: user.level,
//   badges: user.badges,
//   gameProgress: {
//     wordFinder: user.gameProgress.wordFinder,
//   },
// });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({
//       message: "Error attempting daily puzzle",
//       error: err.message,
//     });
//   }
// };


const XP_PER_LEVEL = 100;

export const attemptDailyPuzzle = async (req, res) => {
  const { userId } = req.params;
  const { foundWords } = req.body;
  const today = new Date().toISOString().split("T")[0];

  try {
    // Try today's puzzle, or fallback to latest available
    const puzzle =
      await DailyWordFinder.findOne({ date: today }) ||
      await DailyWordFinder.findOne().sort({ date: -1 });

    const user = await User.findById(userId);

    if (!puzzle) return res.status(404).json({ message: "No puzzle found." });
    if (!user) return res.status(404).json({ message: "User not found" });

    const correctWords = foundWords.filter(word =>
      puzzle.words.includes(word.trim().toUpperCase())
    );

    // Update game progress
    user.gameProgress.wordFinder.totalPlayed += foundWords.length;
    user.gameProgress.wordFinder.totalCorrect += correctWords.length;

    // XP and Level
    const earnedXp = correctWords.length * 10;
    user.xp = (user.xp || 0) + earnedXp;
    user.level = Math.floor(user.xp / XP_PER_LEVEL) + 1;

    // Award badge
    if (
      user.gameProgress.wordFinder.totalCorrect >= 10 &&
      !user.badges.includes("Word Wizard")
    ) {
      user.badges.push("Word Wizard");
    }

    await user.save();

    res.status(200).json({
      message: "Puzzle submitted",
      correctWords,
      totalFound: foundWords.length,
      xpEarned: earnedXp,
      currentXP: user.xp,
      newLevel: user.level,
      badges: user.badges,
      gameProgress: {
        wordFinder: user.gameProgress.wordFinder,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error attempting daily puzzle",
      error: err.message,
    });
  }
};


export const getNextPuzzle = async (req, res) => {
  try {
    const { currentPuzzleId } = req.params;

    // Find the current puzzle by id
    const currentPuzzle = await DailyWordFinder.findById(currentPuzzleId);
    if (!currentPuzzle) {
      return res.status(404).json({ message: "Current puzzle not found" });
    }

    // Find the next puzzle created *after* currentPuzzle.createdAt
    const nextPuzzle = await DailyWordFinder.findOne({
      createdAt: { $gt: currentPuzzle.createdAt }
    }).sort({ createdAt: 1 });

    if (!nextPuzzle) {
      return res.status(404).json({ message: "No next puzzle available" });
    }

    res.status(200).json({
      message: "Next puzzle found",
      puzzle: nextPuzzle,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};