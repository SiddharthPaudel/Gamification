// models/Flashcard.js
import mongoose from 'mongoose';

const flashcardSetSchema = new mongoose.Schema({
  module: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
  title: { type: String, required: true }, // Usually same as module title
  cards: [
    {
      front: { type: String, required: true },
      back: { type: String, required: true }
    }
  ]
});

const FlashcardSet = mongoose.model('FlashcardSet', flashcardSetSchema);
export default FlashcardSet;