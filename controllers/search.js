import { redisClient } from '../server.js';
import { searchAnime } from '../utils/animeUtils.js';

export const search = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ message: 'Query parameter is required' });
    }
    // Check cache
    const cacheKey = `search:${query}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }
    // Fetch search results (Anigo API)
    const results = await searchAnime(query);
    // Cache for 10 minutes
    await redisClient.setex(cacheKey, 600, JSON.stringify(results));
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Error searching anime', error });
  }
};
