import express from 'express';
import { getHistory, addOrUpdateHistory } from '../controllers/history.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();
router.use(auth);

router.get('/', getHistory);
router.post('/', addOrUpdateHistory);

export default router;
