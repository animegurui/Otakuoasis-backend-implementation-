import User from '../models/User.js';
import History from '../models/History.js';

export const getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
};

export const getAllHistory = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const history = await History.find().populate('user', 'email');
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching history', error });
  }
};
