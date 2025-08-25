import * as gogoScraper from '../scrapers/gogoAnime.js';
import * as nineScraper from '../scrapers/nineAnime.js';
import * as paheScraper from '../scrapers/animePahe.js';

export const getEpisodes = async (req, res) => {
  try {
    const { source, slug } = req.params;
    let episodes;
    if (source === 'gogoanime') {
      episodes = await gogoScraper.getEpisodes(slug);
    } else if (source === '9anime') {
      episodes = await nineScraper.getEpisodes(slug);
    } else if (source === 'animepahe') {
      episodes = await paheScraper.getEpisodes(slug);
    } else {
      return res.status(400).json({ message: 'Invalid source' });
    }
    res.json(episodes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching episodes', error });
  }
};
