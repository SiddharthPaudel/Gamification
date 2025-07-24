import express from 'express';
import { buyHearts } from '../controllers/shopController.js';

const router = express.Router();

router.post('/user/buy-hearts', buyHearts);

export default router;
