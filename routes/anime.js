import express from 'express';
import anigo from 'anigo-anime-api'; // package must be installed
// If anigo exports a default that is a class, you might need: const client = new Anigo(); 
// But this code uses the simple API used earlier: anigo.getPopular, anigo.searchGogo, etc.

const router = express.Router();

/**
 * GET /anime/trending
 * Returns trending anime via Anigo (weekly popular)
 */
router.get('/trending', async (req, res) => {
  try {
    const trending = await anigo.getPopular(1); // type 1 -> weekly most viewed
    res.json(trending);
  } catch (err) {
    console.error('Trending error', err);
    res.status(500).json({ message: 'Failed to fetch trending', error: err.message });
  }
});

/**
 * GET /anime/search?q=...
 * Search anime across Anigo/Gogo
 */
router.get('/search', async (req, res) => {
  try {
    const q = req.query.q || '';
    if (!q) return res.status(400).json({ message: 'Missing q parameter' });

    const gogo = await anigo.searchGogo(q);
    // you can combine results from other sources/scrapers later
    res.json({ gogo });
  } catch (err) {
    console.error('Search error', err);
    res.status(500).json({ message: 'Search failed', error: err.message });
  }
});

/**
 * GET /anime/episodes/:source/:slug
 * Return episode list for anime slug from supported sources.
 * Currently supports 'gogo' (via Anigo). Other sources can be added.
 */
router.get('/episodes/:source/:slug', async (req, res) => {
  try {
    const { source, slug } = req.params;

    if (!slug) return res.status(400).json({ message: 'Missing slug' });

    if (source === 'gogo' || source === 'gogoanime') {
      // Anigo exposes getGogoAnimeInfo (used earlier); adapt if package differs
      const info = await anigo.getGogoAnimeInfo(slug);
      return res.json(info.episodes || []);
    }

    // Add other source handlers (animepahe, 9anime).
    return res.status(400).json({ message: 'Unsupported source' });
  } catch (err) {
    console.error('Get episodes error', err);
    res.status(500).json({ message: 'Failed to fetch episodes', error: err.message });
  }
});

/**
 * GET /anime/episode-sources/:source/:slug/:episodeNumber
 * Return streaming sources for an episode.
 */
router.get('/episode-sources/:source/:slug/:episodeNumber', async (req, res) => {
  try {
    const { source, slug, episodeNumber } = req.params;

    if (!slug || !episodeNumber) return res.status(400).json({ message: 'Missing parameters' });

    if (source === 'gogo' || source === 'gogoanime') {
      // Anigo helper to get episode sources — API may vary; adapt if needed
      const episodeId = `${slug}-episode-${episodeNumber}`;
      const sources = await anigo.getGogoanimeEpisodeSource(episodeId);
      return res.json(sources);
    }

    return res.status(400).json({ message: 'Unsupported source' });
  } catch (err) {
    console.error('Get episode sources error', err);
    res.status(500).json({ message: 'Failed to fetch episode sources', error: err.message });
  }
});

export default router;
