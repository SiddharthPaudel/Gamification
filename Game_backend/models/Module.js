import mongoose from 'mongoose';

const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  lessons: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson' // This allows population of lesson data
    }
  ],
  category: { type: String, enum: ['Programming', 'Design', 'Marketing', 'Business'], default: 'Programming' },
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Module', moduleSchema);
