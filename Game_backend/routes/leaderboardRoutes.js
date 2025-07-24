import express from 'express';
import {
  getLeaderboardByXP,
  getLeaderboardByQuizScore,
  getLeaderboardByTasks,getLeaderboardByLevel
} from '../controllers/leaderboardController.js';

const router = express.Router();

router.get('/xp', getLeaderboardByXP);
router.get('/level', getLeaderboardByLevel);
router.get('/quiz', getLeaderboardByQuizScore);
router.get('/tasks', getLeaderboardByTasks);

export default router;
