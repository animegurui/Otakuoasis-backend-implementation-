import express from 'express';
import User from '../models/User.js';
import History from '../models/History.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();
router.use(auth);

// Helper: require admin role
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// GET /admin/users  -> list users (no passwords)
router.get('/users', requireAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password').lean();
    res.json(users);
  } catch (err) {
    console.error('Admin get users error', err);
    res.status(500).json({ message: 'Failed to get users', error: err.message });
  }
});

// GET /admin/history -> list all history (admin only)
router.get('/history', requireAdmin, async (req, res) => {
  try {
    const history = await History.find().populate('user', 'email').sort({ updatedAt: -1 }).lean();
    res.json(history);
  } catch (err) {
    console.error('Admin get history error', err);
    res.status(500).json({ message: 'Failed to get history', error: err.message });
  }
});

export default router;
