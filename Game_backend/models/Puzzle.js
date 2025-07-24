// models/CodePuzzleSet.js
import mongoose from 'mongoose';

const codePuzzleSetSchema = new mongoose.Schema({
  module: { type: mongoose.Schema.Types.ObjectId, ref: 'Module' },
  title: { type: String, required: true },
  puzzles: [
    {
      question: { type: String, required: true },
      expectedAnswer: { type: String, required: true },
      hint: { type: String }
    }
  ]
});

const CodePuzzleSet = mongoose.model('CodePuzzleSet', codePuzzleSetSchema);
export default CodePuzzleSet;
