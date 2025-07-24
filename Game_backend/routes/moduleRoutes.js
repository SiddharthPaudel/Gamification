import express from 'express';
import { createModule, getModules ,getAllModules,deleteModule } from '../controllers/moduleController.js';
// import verifyToken from '../middleware/verifyToken.js'; // optional middleware

const router = express.Router();

router.post('/', createModule);
router.get('/getmodule', getModules);
router.get('/get-all-module', getAllModules); 
router.delete('/delete-module/:id', deleteModule);
export default router;
