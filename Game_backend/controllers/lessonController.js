import Lesson from '../models/Lesson.js';
import Module from '../models/Module.js';

export const createLesson = async (req, res) => {
  const { moduleId } = req.params;
  const { title, order, sections } = req.body; // Expecting sections array from frontend

  try {
    // Check if module exists
    const module = await Module.findById(moduleId);
    if (!module) {
      return res.status(404).json({ msg: 'Module not found' });
    }

    // Create new lesson with sections
    const newLesson = new Lesson({
      title,
      order,
      sections,
      module: moduleId,
    });

    await newLesson.save();

    // Add lesson reference to module
    module.lessons.push(newLesson._id);
    await module.save();

    res.status(201).json({
      msg: 'Lesson added successfully',
      lesson: newLesson,
      module,
    });
  } catch (err) {
    console.error('Error creating lesson:', err);
    res.status(500).json({ msg: 'Failed to add lesson' });
  }
};

export const getLessonsByModule = async (req, res) => {
  const { moduleId } = req.params;

  try {
    // Get lessons linked to module, sorted by order
    const lessons = await Lesson.find({ module: moduleId }).sort({ order: 1 });
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch lessons' });
  }
};
