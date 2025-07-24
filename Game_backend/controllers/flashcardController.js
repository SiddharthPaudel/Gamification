import FlashcardSet from '../models/FlashCard.js';
import User from '../models/User.js';
import Module from '../models/Module.js';

// Create Flashcard
export const createFlashcardSet = async (req, res) => {
  const { moduleId } = req.params;
  const { cards } = req.body;

  try {
    const module = await Module.findById(moduleId);
    if (!module) return res.status(404).json({ message: 'Module not found' });

    const set = new FlashcardSet({
      module: moduleId,
      title: module.title,
      cards
    });

    await set.save();
    res.status(201).json({ message: 'Flashcard set created', flashcardSet: set });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create flashcard set' });
  }
};

// Get Flashcards by Module
export const getFlashcardsByModule = async (req, res) => {
  try {
    const cards = await FlashcardSet.find({ module: req.params.moduleId });
    res.json(cards);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching flashcards' });
  }
};

// Attempt Flashcards
// export const attemptFlashcardSet = async (req, res) => {
//   const { userId, setId } = req.params;
//   const { attempts } = req.body; // [{ front, userAnswer }]

//   try {
//     const set = await FlashcardSet.findById(setId);
//     const user = await User.findById(userId);

//     if (!set) return res.status(404).json({ message: 'Flashcard set not found' });
//     if (!user) return res.status(404).json({ message: 'User not found' });

//     let correct = 0;

//     attempts.forEach(attempt => {
//       const card = set.cards.find(c => c.front.trim().toLowerCase() === attempt.front.trim().toLowerCase());
//       if (card && card.back.trim().toLowerCase() === attempt.userAnswer.trim().toLowerCase()) {
//         correct++;
//       }
//     });

//     // Update user progress
//     user.gameProgress.flashcards.totalPlayed += attempts.length;
//     user.gameProgress.flashcards.totalCorrect += correct;

//     // XP & level update
//     const earnedXp = correct * 5;
//     user.xp += earnedXp;
//     user.level = Math.floor(user.xp / 100) + 1;

//     // Badge (example)
//     if (user.gameProgress.flashcards.totalCorrect >= 7 && !user.badges.includes('Flash Learner')) {
//       user.badges.push('Flash Learner');
//     }

//     await user.save();

//    res.status(200).json({
//   message: 'Flashcard game completed',
//   correctAnswers: correct,
//   totalQuestions: attempts.length,
//   xpEarned: earnedXp,
//   newLevel: user.level,
//   badges: user.badges,
//   gameProgress: {
//     flashcards: user.gameProgress.flashcards,
//     // optionally add others if needed
//   }
// })
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Error attempting flashcard set', error: err.message });
//   }
// };

const XP_PER_LEVEL = 100;

export const attemptFlashcardSet = async (req, res) => {
  const { userId, setId } = req.params;
  const { attempts } = req.body; // [{ front, userAnswer }]

  try {
    const set = await FlashcardSet.findById(setId);
    const user = await User.findById(userId);

    if (!set) return res.status(404).json({ message: 'Flashcard set not found' });
    if (!user) return res.status(404).json({ message: 'User not found' });

    let correct = 0;

    attempts.forEach(attempt => {
      const card = set.cards.find(c => c.front.trim().toLowerCase() === attempt.front.trim().toLowerCase());
      if (card && card.back.trim().toLowerCase() === attempt.userAnswer.trim().toLowerCase()) {
        correct++;
      }
    });

    // Update user progress for flashcards
    user.gameProgress.flashcards.totalPlayed += attempts.length;
    user.gameProgress.flashcards.totalCorrect += correct;

    // XP & level update - unified approach
    const earnedXp = correct * 5;
    user.xp = (user.xp || 0) + earnedXp;
    user.level = Math.floor(user.xp / XP_PER_LEVEL) + 1;

    // Badge (example)
    if (user.gameProgress.flashcards.totalCorrect >= 7 && !user.badges.includes('Flash Learner')) {
      user.badges.push('Flash Learner');
    }

    await user.save();

    res.status(200).json({
      message: 'Flashcard game completed',
      correctAnswers: correct,
      totalQuestions: attempts.length,
      xpEarned: earnedXp,
      newLevel: user.level,
      badges: user.badges,
      gameProgress: {
        flashcards: user.gameProgress.flashcards,
        // optionally add others if needed
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error attempting flashcard set', error: err.message });
  }
};


export const getFlashcardSet = async (req, res) => {
  const { setId } = req.params;
  try {
    const set = await FlashcardSet.findById(setId);
    if (!set) return res.status(404).json({ message: 'Flashcard set not found' });
    res.status(200).json(set);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch flashcard set' });
  }
};

export const updateFlashcard = async (req, res) => {
  const { setId, cardId } = req.params;
  const { front, back } = req.body;

  try {
    const flashcardSet = await FlashcardSet.findById(setId);
    if (!flashcardSet) {
      return res.status(404).json({ message: 'Flashcard set not found' });
    }

    const card = flashcardSet.cards.id(cardId);
    if (!card) {
      return res.status(404).json({ message: 'Flashcard not found in the set' });
    }

    if (front) card.front = front;
    if (back) card.back = back;

    await flashcardSet.save();

    res.status(200).json({ message: 'Flashcard updated successfully', updatedCard: card });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update flashcard' });
  }
};


export const deleteFlashcard = async (req, res) => {
  const { setId, cardId } = req.params;

  try {
    const flashcardSet = await FlashcardSet.findById(setId);
    if (!flashcardSet) {
      return res.status(404).json({ message: 'Flashcard set not found' });
    }

    const card = flashcardSet.cards.id(cardId);
    if (!card) {
      return res.status(404).json({ message: 'Flashcard not found in the set' });
    }

    card.remove();
    await flashcardSet.save();

    res.status(200).json({ message: 'Flashcard deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete flashcard' });
  }
};



// export const deleteFlashcardSet = async (req, res) => {
//   const { setId } = req.params;

//   try {
//     const deletedSet = await FlashcardSet.findByIdAndDelete(setId);
//     if (!deletedSet) {
//       return res.status(404).json({ message: 'Flashcard set not found' });
//     }

//     res.status(200).json({ message: 'Flashcard set deleted successfully', deletedSet });
//   } catch (error) {
//     res.status(500).json({ message: 'Error deleting flashcard set', error: error.message });
//   }
// };


export const getAllFlashcardSets = async (req, res) => {
  try {
    const sets = await FlashcardSet.find().populate('module', 'title');
    res.status(200).json(sets);
  } catch (err) {
    console.error("Error in getAllFlashcardSets:", err);
    res.status(500).json({ message: 'Failed to fetch flashcards', error: err.message });
  }
};


export const deleteFlashcardSet = async (req, res) => {
  const { setId } = req.params;

  try {
    const deleted = await FlashcardSet.findByIdAndDelete(setId);
    if (!deleted) {
      return res.status(404).json({ msg: 'Flashcard set not found' });
    }
    res.json({ msg: 'Flashcard set deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to delete flashcard set' });
  }
};

export const updateFlashcardSet = async (req, res) => {
  const { setId } = req.params;
  const { cards } = req.body; // Array of flashcards: [{ front, back }, ...]

  try {
    const updated = await FlashcardSet.findByIdAndUpdate(
      setId,
      { cards },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ msg: 'Flashcard set not found' });
    }

    res.json({ msg: 'Flashcard set updated successfully', flashcardSet: updated });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to update flashcard set' });
  }
};
