// controllers/codePuzzleSetController.js
import CodePuzzleSet from "../models/Puzzle.js";
import User from "../models/User.js";
import Module from "../models/Module.js";

export const createPuzzleSet = async (req, res) => {
  try {
    const { module: moduleId, puzzles } = req.body;

    // Fetch module name
    const module = await Module.findById(moduleId);
    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }

    // Use module title or name as title of puzzle set if you want:
    const title = `${module.name || module.title} - Code Puzzles`;

    const set = new CodePuzzleSet({
      module: moduleId,
      title,
      puzzles,
    });

    await set.save();
    res.status(201).json({ message: "Puzzle set created", set });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating puzzle set", error: err.message });
  }
};

// Attempt a puzzle in the set
// export const attemptPuzzleSet = async (req, res) => {
//   const { setId } = req.params;
//   const { userId, answers } = req.body;

//   try {
//     const set = await CodePuzzleSet.findById(setId);
//     if (!set) return res.status(404).json({ message: "Puzzle set not found" });

//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     let totalCorrect = 0;

//     // Evaluate answers
//     set.puzzles.forEach((puzzle, index) => {
//       const userAnswer = answers[index];

//       if (
//   typeof answers[index] === 'string' &&
//   typeof puzzle.expectedAnswer === 'string' &&
//   answers[index].trim().toLowerCase() === puzzle.expectedAnswer.trim().toLowerCase()
// ) {
//   totalCorrect++;
// }
//     });

//     const xpEarned = totalCorrect * 5;
//     user.xp += xpEarned;

//     // Leveling system
//     while (user.xp >= user.level * 100) {
//       user.xp -= user.level * 100;
//       user.level++;
//     }

//     // Update code puzzle progress
//     user.gameProgress.codePuzzles.totalCompleted += set.puzzles.length;
//     if (totalCorrect === set.puzzles.length) {
//       user.gameProgress.codePuzzles.correctFirstTry += 1;
//     }

//     // Award badge
//     if (
//       user.gameProgress.codePuzzles.correctFirstTry >= 3 &&
//       !user.badges.includes("PuzzleMaster")
//     ) {
//       user.badges.push("PuzzleMaster");
//     }

//     await user.save();

//     res.json({
//       message: "Puzzle set attempted",
//       totalCorrect,
//       xpEarned,
//       updatedXP: user.xp,
//       updatedLevel: user.level,
//       badges: user.badges,
//     });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Error attempting puzzle", error: error.message });
//   }
// };


const XP_PER_LEVEL = 100;

export const attemptPuzzleSet = async (req, res) => {
  const { setId } = req.params;
  const { userId, answers } = req.body;

  try {
    const set = await CodePuzzleSet.findById(setId);
    if (!set) return res.status(404).json({ message: "Puzzle set not found" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    let totalCorrect = 0;

    // Evaluate answers
    set.puzzles.forEach((puzzle, index) => {
      const userAnswer = answers[index];
      if (
        typeof userAnswer === 'string' &&
        typeof puzzle.expectedAnswer === 'string' &&
        userAnswer.trim().toLowerCase() === puzzle.expectedAnswer.trim().toLowerCase()
      ) {
        totalCorrect++;
      }
    });

    const xpEarned = totalCorrect * 5;
    user.xp += xpEarned;

    // Update level consistently
    user.level = Math.floor(user.xp / XP_PER_LEVEL) + 1;

    // Update code puzzle progress
    user.gameProgress.codePuzzles.totalCompleted += set.puzzles.length;
    if (totalCorrect === set.puzzles.length) {
      user.gameProgress.codePuzzles.correctFirstTry += 1;
    }

    // Award badge
    if (
      user.gameProgress.codePuzzles.correctFirstTry >= 3 &&
      !user.badges.includes("PuzzleMaster")
    ) {
      user.badges.push("PuzzleMaster");
    }

    await user.save();

    res.json({
      message: "Puzzle set attempted",
      totalCorrect,
      xpEarned,
      updatedXP: user.xp,
      updatedLevel: user.level,
      badges: user.badges,
      gameProgress: {
        codePuzzles: user.gameProgress.codePuzzles
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error attempting puzzle", error: error.message });
  }
};



export const updatePuzzleSet = async (req, res) => {
  const { id } = req.params;
  const { title, puzzles } = req.body;

  try {
    const updatedSet = await CodePuzzleSet.findByIdAndUpdate(
      id,
      {
        ...(title && { title }),
        ...(puzzles && { puzzles })
      },
      { new: true }
    );

    if (!updatedSet) {
      return res.status(404).json({ message: 'Puzzle set not found' });
    }

    res.json({ message: 'Puzzle set updated', puzzleSet: updatedSet });
  } catch (err) {
    res.status(500).json({ message: 'Error updating puzzle set', error: err.message });
  }
};


export const deletePuzzleSet = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedSet = await CodePuzzleSet.findByIdAndDelete(id);

    if (!deletedSet) {
      return res.status(404).json({ message: 'Puzzle set not found' });
    }

    res.json({ message: 'Puzzle set deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting puzzle set', error: err.message });
  }
};

export const addPuzzleToSet = async (req, res) => {
  const { setId } = req.params;
  const { question, expectedAnswer, hint } = req.body;

  try {
    const set = await CodePuzzleSet.findById(setId);
    if (!set) return res.status(404).json({ message: 'Puzzle set not found' });

    const newPuzzle = {
      question,
      expectedAnswer,
      hint,
    };

    set.puzzles.push(newPuzzle);

    await set.save();

    res.status(201).json({
      message: 'Puzzle added successfully',
      puzzle: newPuzzle,
      set,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add puzzle', error: err.message });
  }
};
