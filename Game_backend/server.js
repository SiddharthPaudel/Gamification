import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";



// Routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from './routes/userRoutes.js';
import moduleRoutes from './routes/moduleRoutes.js';
import lessonRoutes from './routes/lessonRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import flashcardRoutes from './routes/flashcardRoutes.js';
import puzzleRoutes from './routes/puzzlesRoutes.js';
import dailyWordFinderRoutes from './routes/dailyWordFinderRoutes.js'
import leaderboardRoutes from './routes/leaderboardRoutes.js';
import ShopRoutes from './routes/ShopRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js';
// Config
import connectDB from "./config/db.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());



// Connect to DB
connectDB();

app.use('/api', ShopRoutes); 
// Routes
app.use("/api/auth", authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/modules', moduleRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/flashcards', flashcardRoutes);
app.use('/api/puzzles', puzzleRoutes);
app.use("/api/dailywordfinder", dailyWordFinderRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

app.use('/api/dashboard', dashboardRoutes);


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
