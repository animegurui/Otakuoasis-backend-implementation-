import express from 'express';
import { getEpisodes } from '../controllers/episodes.js';
const router = express.Router();

router.get('/:source/:slug', getEpisodes);

export default router;
