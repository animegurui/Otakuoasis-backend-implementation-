import express from 'express';
import { getAllUsers, getAllHistory } from '../controllers/admin.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();
router.use(auth);

router.get('/users', getAllUsers);
router.get('/history', getAllHistory);

export default router;
