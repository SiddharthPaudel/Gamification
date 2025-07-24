import express from 'express';
import {
  createFlashcardSet,
  getFlashcardsByModule,
  attemptFlashcardSet,
  updateFlashcard,
  deleteFlashcard,
  deleteFlashcardSet,getAllFlashcardSets,getFlashcardSet,updateFlashcardSet
} from '../controllers/flashcardController.js';

const router = express.Router();
router.get('/all', getAllFlashcardSets);          // static route first

router.post('/:moduleId', createFlashcardSet);    // dynamic routes after
router.get('/:moduleId', getFlashcardsByModule);
router.get('/set/:setId', getFlashcardSet);
router.post('/attempt/:userId/:setId', attemptFlashcardSet);
router.put('/set/:setId/card/:cardId', updateFlashcard);
// router.delete('/set/:setId/card/:cardId', deleteFlashcard);
router.delete('/set/:setId', deleteFlashcardSet);
router.put('/set/:setId', updateFlashcardSet);
router.delete('/set/:setId', deleteFlashcardSet);



export default router;
