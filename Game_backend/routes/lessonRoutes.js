import express from 'express';
import { createLesson, getLessonsByModule } from '../controllers/lessonController.js';

const router = express.Router();

router.post('/:moduleId', createLesson); // ✅ Dynamic ID for creating lesson
router.get('/:moduleId', getLessonsByModule);

export default router;
