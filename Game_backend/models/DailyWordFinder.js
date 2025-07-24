// models/DailyWordFinder.js
import mongoose from "mongoose";

const dailyWordFinderSchema = new mongoose.Schema({
  date: {
    type: String, // format: 'YYYY-MM-DD'
    required: true,
    // unique: true,
  },
  words: [{ type: String, required: true }],
  grid: [[{ type: String }]], // 2D letter grid
});

export default mongoose.model("DailyWordFinder", dailyWordFinderSchema);
