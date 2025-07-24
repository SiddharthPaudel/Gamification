import Quiz from '../models/Quiz.js';
import Module from '../models/Module.js';
import User from '../models/User.js';


// Create Quiz with module title as quiz title
export const createQuiz = async (req, res) => {
  const { moduleId } = req.params;
  const { title, questions } = req.body;

  try {
    const module = await Module.findById(moduleId);
    if (!module) return res.status(404).json({ msg: 'Module not found' });

    const newQuiz = new Quiz({
      module: moduleId,
      title,
      questions
    });

    await newQuiz.save();

    res.status(201).json({
      msg: 'Quiz created successfully',
      quiz: newQuiz
    });
  } catch (err) {
    console.error('Error creating quiz:', err);
    res.status(500).json({ msg: 'Failed to create quiz' });
  }
};


// Get all quizzes for a module
export const getQuizzesByModule = async (req, res) => {
  const { moduleId } = req.params;
  try {
    const quizzes = await Quiz.find({ module: moduleId });
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch quizzes' });
  }
};

// Delete a quiz
export const deleteQuiz = async (req, res) => {
  const { quizId } = req.params;
  try {
    const deleted = await Quiz.findByIdAndDelete(quizId);
    if (!deleted) {
      return res.status(404).json({ msg: 'Quiz not found' });
    }
    res.json({ msg: 'Quiz deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to delete quiz' });
  }
};

// Update a quiz
export const updateQuiz = async (req, res) => {
  const { quizId } = req.params;
  const { questions } = req.body;

  try {
    const updated = await Quiz.findByIdAndUpdate(
      quizId,
      { questions },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ msg: 'Quiz not found' });
    }
    res.json({ msg: 'Quiz updated successfully', quiz: updated });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to update quiz' });
  }
};


// export const attemptQuiz = async (req, res) => {
//   const { quizId, userId } = req.params;
//   const { answers } = req.body;

//   try {
//     const quiz = await Quiz.findById(quizId);
//     if (!quiz) return res.status(404).json({ msg: 'Quiz not found' });

//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ msg: 'User not found' });

//     // Calculate score
//     let score = 0;
//     for (let i = 0; i < quiz.questions.length; i++) {
//       if (answers[i] === quiz.questions[i].correctAnswer) {
//         score++;
//       }
//     }

//     // XP earned (e.g., 10 XP per correct answer)
//     const xpEarned = score * 10;
//     let newXP = user.xp + xpEarned;
//     let newLevel = user.level;

//     // Handle level up (example: 100 XP per level)
//     while (newXP >= 100) {
//       newLevel++;
//       newXP -= 100;
//     }

//     // Update gameProgress fields
//     user.gameProgress.quiz.totalPlayed += 1;
//     user.gameProgress.quiz.totalCorrect += score;

//     // Update highScore if this score is greater
//     if (score > user.gameProgress.quiz.highScore) {
//       user.gameProgress.quiz.highScore = score;
//     }

//     if (
//   user.gameProgress.quiz.totalCorrect >= 7 &&
//   !user.badges.includes('quizspammer')
// ) {
//   user.badges.push('quizspammer');
// }

//     // Update user XP, level, and completedTasks
//     user.xp = newXP;
//     user.level = newLevel;
//     user.completedTasks.push(quiz._id);

//     await user.save();

//     res.status(200).json({
//   msg: 'Quiz attempted successfully',
//   score,
//   xpEarned,
//   newLevel,
//   currentXP: newXP,
//   badges: user.badges,
//   completedTasks: user.completedTasks,
//   gameProgress: user.gameProgress.quiz,
// });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: 'Server error' });
//   }
// };

const XP_PER_LEVEL = 100;

// export const attemptQuiz = async (req, res) => {
//   const { quizId, userId } = req.params;
//   const { answers } = req.body;

//   try {
//     const quiz = await Quiz.findById(quizId);
//     if (!quiz) return res.status(404).json({ msg: 'Quiz not found' });

//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ msg: 'User not found' });

//     // Calculate score
//     let score = 0;
//     for (let i = 0; i < quiz.questions.length; i++) {
//       if (answers[i] === quiz.questions[i].correctAnswer) {
//         score++;
//       }
//     }

//     // XP earned (e.g., 10 XP per correct answer)
//     const earnedXp = score * 10;

//     // Update total XP and level consistently
//     user.xp = (user.xp || 0) + earnedXp;
//     user.level = Math.floor(user.xp / XP_PER_LEVEL) + 1;

//     // Update gameProgress fields for quiz
//     user.gameProgress.quiz.totalPlayed += 1;
//     user.gameProgress.quiz.totalCorrect += score;

//     // Update highScore if this score is greater
//     if (score > user.gameProgress.quiz.highScore) {
//       user.gameProgress.quiz.highScore = score;
//     }

//     // Badge example
//     if (
//       user.gameProgress.quiz.totalCorrect >= 7 &&
//       !user.badges.includes('quizspammer')
//     ) {
//       user.badges.push('quizspammer');
//     }

//     // Track completed quizzes (optional)
//     user.completedTasks.push(quiz._id);

//     await user.save();

//     res.status(200).json({
//       msg: 'Quiz attempted successfully',
//       score,
//       xpEarned: earnedXp,
//       newLevel: user.level,
//       currentXP: user.xp,
//       badges: user.badges,
//       completedTasks: user.completedTasks,
//       gameProgress: user.gameProgress.quiz,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: 'Server error' });
//   }
// };


export const attemptQuiz = async (req, res) => {
  const { quizId, userId } = req.params;
  const { answers } = req.body;

  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ msg: 'Quiz not found' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Calculate score
    let score = 0;
    for (let i = 0; i < quiz.questions.length; i++) {
      if (answers[i] === quiz.questions[i].correctAnswer) {
        score++;
      }
    }

    const totalQuestions = quiz.questions.length;
    const incorrectAnswers = totalQuestions - score;

    // Decrease hearts for wrong answers
    user.hearts = Math.max(0, (user.hearts || 0) - incorrectAnswers);

    // XP earned
    const earnedXp = score * 10;
    user.xp = (user.xp || 0) + earnedXp;
    user.level = Math.floor(user.xp / XP_PER_LEVEL) + 1;

    // Update quiz progress
    user.gameProgress.quiz.totalPlayed += 1;
    user.gameProgress.quiz.totalCorrect += score;

    if (score > user.gameProgress.quiz.highScore) {
      user.gameProgress.quiz.highScore = score;
    }

    if (
      user.gameProgress.quiz.totalCorrect >= 7 &&
      !user.badges.includes('quizspammer')
    ) {
      user.badges.push('quizspammer');
    }

    user.completedTasks.push(quiz._id);

    await user.save();

    res.status(200).json({
      msg: 'Quiz attempted successfully',
      score,
      xpEarned: earnedXp,
      newLevel: user.level,
      currentXP: user.xp,
      heartsLeft: user.hearts, // ✅ Return hearts for frontend
      badges: user.badges,
      completedTasks: user.completedTasks,
      gameProgress: user.gameProgress.quiz,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};
