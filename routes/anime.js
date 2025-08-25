import express from 'express';
import anigo from 'anigo-anime-api'; 
import Anime from '../models/Anime.js'; // ✅ MongoDB model

const router = express.Router();

/**
 * ================================
 * ANIGO (Scraper-based) ROUTES
 * ================================
 */

/**
 * GET /anime/trending
 */
router.get('/trending', async (req, res) => {
  try {
    const trending = await anigo.getPopular(1);
    res.json(trending);
  } catch (err) {
    console.error('Trending error', err);
    res.status(500).json({ message: 'Failed to fetch trending', error: err.message });
  }
});

/**
 * GET /anime/search?q=...
 * Search both Anigo + MongoDB
 */
router.get('/search', async (req, res) => {
  try {
    const q = req.query.q || '';
    if (!q) return res.status(400).json({ message: 'Missing q parameter' });

    // ✅ Parallel search
    const [gogo, dbResults] = await Promise.all([
      anigo.searchGogo(q),
      Anime.find({ title: { $regex: q, $options: 'i' } })
    ]);

    res.json({
      db: dbResults,
      gogo
    });
  } catch (err) {
    console.error('Search error', err);
    res.status(500).json({ message: 'Search failed', error: err.message });
  }
});

/**
 * GET /anime/episodes/:source/:slug
 */
router.get('/episodes/:source/:slug', async (req, res) => {
  try {
    const { source, slug } = req.params;

    if (!slug) return res.status(400).json({ message: 'Missing slug' });

    if (source === 'gogo' || source === 'gogoanime') {
      const info = await anigo.getGogoAnimeInfo(slug);
      return res.json(info.episodes || []);
    }

    return res.status(400).json({ message: 'Unsupported source' });
  } catch (err) {
    console.error('Get episodes error', err);
    res.status(500).json({ message: 'Failed to fetch episodes', error: err.message });
  }
});

/**
 * GET /anime/episode-sources/:source/:slug/:episodeNumber
 */
router.get('/episode-sources/:source/:slug/:episodeNumber', async (req, res) => {
  try {
    const { source, slug, episodeNumber } = req.params;

    if (!slug || !episodeNumber) return res.status(400).json({ message: 'Missing parameters' });

    if (source === 'gogo' || source === 'gogoanime') {
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


/**
 * ================================
 * DATABASE (MongoDB) ROUTES
 * ================================
 */

/**
 * GET /anime/db
 * Fetch all anime from MongoDB
 */
router.get('/db', async (req, res) => {
  try {
    const animeList = await Anime.find();
    res.json(animeList);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch anime from DB', error: err.message });
  }
});

/**
 * GET /anime/db/trending
 */
router.get('/db/trending', async (req, res) => {
  try {
    const trending = await Anime.find().sort({ popularity: -1 }).limit(10);
    res.json(trending);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch trending anime from DB', error: err.message });
  }
});

/**
 * GET /anime/db/search?q=...
 */
router.get('/db/search', async (req, res) => {
  try {
    const q = req.query.q || '';
    if (!q) return res.status(400).json({ message: 'Missing q parameter' });

    const results = await Anime.find({ title: { $regex: q, $options: 'i' } });
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: 'DB search failed', error: err.message });
  }
});

/**
 * POST /anime/db/add
 */
router.post('/db/add', async (req, res) => {
  try {
    const anime = new Anime(req.body);
    await anime.save();
    res.status(201).json(anime);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add anime', error: err.message });
  }
});

export default router;
