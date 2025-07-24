import mongoose from 'mongoose';




const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  // content: { type: String, required: true },
  order: { type: Number, required: true },
  module: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true }, // Link to Module
   sections: [
    {
      heading: { type: String,required:true },
      content: { type: String, required: true },

      example: { type: String } // Optional, for adding code or examples
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

const Lesson = mongoose.model('Lesson', lessonSchema);

export default Lesson;

