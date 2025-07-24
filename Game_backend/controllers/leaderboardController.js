import User from '../models/User.js';

// Get top users based on XP (general leaderboard)
export const getLeaderboardByXP = async (req, res) => {
  try {
    const users = await User.find({}, 'name xp level badges')  // only fetch necessary fields
      .sort({ xp: -1, level: -1 }) // sort by XP desc, then level desc
      .limit(20); // Top 20 users

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leaderboard', error });
  }
};
export const getLeaderboardByLevel = async (req, res) => {
  try {
    const users = await User.find({}, 'name xp level badges')  // fetch only necessary fields
      .sort({ level: -1, xp: -1 }) // sort by LEVEL desc first, then XP desc
      .limit(20); // Top 20 users

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leaderboard', error });
  }
};

// Get top users by Quiz High Score
export const getLeaderboardByQuizScore = async (req, res) => {
  try {
    const users = await User.find({}, 'name gameProgress.quiz.highScore xp level')
      .sort({ 'gameProgress.quiz.highScore': -1 })
      .limit(20);

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching quiz leaderboard', error });
  }
};

// Get top users by Completed Tasks
export const getLeaderboardByTasks = async (req, res) => {
  try {
    const users = await User.aggregate([
      {
        $project: {
          name: 1,
          completedTaskCount: { $size: '$completedTasks' },
          xp: 1,
          level: 1
        }
      },
      { $sort: { completedTaskCount: -1 } },
      { $limit: 20 }
    ]);

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching task leaderboard', error });
  }
};
