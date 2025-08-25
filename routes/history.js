import express from 'express';
import History from '../models/History.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to all history routes
router.use(auth);

// GET /history/   -> get authenticated user's history
router.get('/', async (req, res) => {
  try {
    const userId = req.user.userId;
    const items = await History.find({ user: userId }).sort({ updatedAt: -1 });
    res.json(items);
  } catch (err) {
    console.error('Get history error', err);
    res.status(500).json({ message: 'Failed to fetch history', error: err.message });
  }
});

// POST /history/  -> create or update watch history (body: { source, slug, episode })
router.post('/', async (req, res) => {
  try {
    const userId = req.user.userId;
    const { source, slug, episode } = req.body;
    if (!source || !slug || typeof episode === 'undefined') {
      return res.status(400).json({ message: 'Missing fields' });
    }

    let item = await History.findOne({ user: userId, source, slug });
    if (item) {
      item.episode = episode;
      item.updatedAt = new Date();
      await item.save();
    } else {
      item = new History({ user: userId, source, slug, episode });
      await item.save();
    }
    res.status(200).json(item);
  } catch (err) {
    console.error('Post history error', err);
    res.status(500).json({ message: 'Failed to update history', error: err.message });
  }
});

export default router;
