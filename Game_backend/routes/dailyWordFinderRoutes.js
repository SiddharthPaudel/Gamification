// routes/dailyWordFinderRoutes.js
import express from "express";
import {
  createDailyPuzzle,
  getTodayPuzzle,
  attemptDailyPuzzle,getNextPuzzle
} from "../controllers/dailyWordFinderController.js";

const router = express.Router();

router.post("/create", createDailyPuzzle);
router.post("/attempt/:userId", attemptDailyPuzzle);
router.get("/today", getTodayPuzzle);
router.get("/next/:currentPuzzleId", getNextPuzzle);
export default router;
