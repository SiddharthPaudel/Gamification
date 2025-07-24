// routes/quizRoutes.js
import express from 'express';
import { createQuiz, getQuizzesByModule, deleteQuiz,updateQuiz,attemptQuiz } from '../controllers/quizController.js';

const router = express.Router();

router.post('/:moduleId', createQuiz);
router.get('/:moduleId', getQuizzesByModule);
router.delete('/delete/:quizId', deleteQuiz); // Delete a quiz
router.put('/update/:quizId', updateQuiz); // Update a quiz
router.post('/attempt/:quizId/:userId', attemptQuiz);

export default router;
