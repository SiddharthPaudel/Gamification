import User from "../models/User.js";
import Module from "../models/Module.js";
import Quiz from "../models/Quiz.js";
import Flashcard from "../models/FlashCard.js"

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalModules = await Module.countDocuments();
    const totalQuizzes = await Quiz.countDocuments();
    const totalFlashcards = await Flashcard.countDocuments();

    res.status(200).json({
      totalUsers,
      totalModules,
      totalQuizzes,
      totalFlashcards,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch dashboard stats", error });
  }
};
