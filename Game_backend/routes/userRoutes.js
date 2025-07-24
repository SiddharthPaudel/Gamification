import express from 'express';
import { updateUser } from '../controllers/userController.js';
import { verifyToken } from '../middleware/verifyToken.js';
const router = express.Router();


router.put('/update/:id',verifyToken, updateUser);
export default router;