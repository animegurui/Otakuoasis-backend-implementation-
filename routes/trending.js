import express from 'express';
import { getTrending } from '../controllers/trending.js';
const router = express.Router();

router.get('/', getTrending);

export default router;
