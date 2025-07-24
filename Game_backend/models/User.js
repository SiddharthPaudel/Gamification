import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },

  // Gamification-related fields
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  badges: [{ type: String }],
  hearts: { type: Number, default: 5 }, 
  gameProgress: {
    quiz: {
      totalPlayed: { type: Number, default: 0 },
      totalCorrect: { type: Number, default: 0 },
      highScore: { type: Number, default: 0 },
    },
    flashcards: {
      totalPlayed: { type: Number, default: 0 },
      totalCorrect: { type: Number, default: 0 },
    },
    codePuzzles: {
      totalCompleted: { type: Number, default: 0 },
      correctFirstTry: { type: Number, default: 0 },
    },
    wordFinder: {
      totalPlayed: { type: Number, default: 0 },
      totalCorrect: { type: Number, default: 0 },
    }
  },

  completedTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
}, {
  timestamps: true,
});

const User = mongoose.model('Student', userSchema);
export default User;
