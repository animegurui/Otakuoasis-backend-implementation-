import { redisClient } from '../server.js';
import { getPopularAnime } from '../utils/animeUtils.js';

export const getTrending = async (req, res) => {
  try {
    // Check cache
    const cached = await redisClient.get('trending');
    if (cached) {
      return res.json(JSON.parse(cached));
    }
    // Fetch trending anime (Anigo API)
    const trending = await getPopularAnime();
    // Cache for 10 minutes
    await redisClient.setex('trending', 600, JSON.stringify(trending));
    res.json(trending);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching trending anime', error });
  }
};
