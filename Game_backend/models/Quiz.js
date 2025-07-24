import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true },
});

const quizSchema = new mongoose.Schema({
  module: { type: mongoose.Schema.Types.ObjectId, ref: 'Module' },
  title: { type: String, required: true },
  questions: [questionSchema],  // Array of questions
});


const Quiz = mongoose.model('Quiz', quizSchema);
export default Quiz;
