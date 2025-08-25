import express from 'express';
import { getEpisodeSources } from '../controllers/episodeSources.js';
const router = express.Router();

router.get('/:source/:slug/:episodeNumber', getEpisodeSources);

export default router;
