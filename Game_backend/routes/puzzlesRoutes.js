// routes/codePuzzleSetRoutes.js
import express from 'express';
import { createPuzzleSet, attemptPuzzleSet ,updatePuzzleSet,deletePuzzleSet,addPuzzleToSet} from '../controllers/puzzleController.js';

const router = express.Router();

router.post('/create', createPuzzleSet);
router.post('/attempt/:setId',attemptPuzzleSet);
router.put('/:id', updatePuzzleSet);
router.delete('/:id', deletePuzzleSet);
router.post('/set/:setId/puzzle', addPuzzleToSet);

export default router;
