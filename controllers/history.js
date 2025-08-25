import History from '../models/History.js';

export const getHistory = async (req, res) => {
  try {
    const history = await History.find({ user: req.user.userId });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching history', error });
  }
};

export const addOrUpdateHistory = async (req, res) => {
  try {
    const { source, slug, episode } = req.body;
    const userId = req.user.userId;

    let historyItem = await History.findOne({ user: userId, source, slug });
    if (historyItem) {
      // Update existing entry
      historyItem.episode = episode;
      historyItem.updatedAt = Date.now();
    } else {
      // Create new entry
      historyItem = new History({
        user: userId,
        source,
        slug,
        episode,
      });
    }
    await historyItem.save();
    res.status(200).json({ message: 'History updated' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating history', error });
  }
};
