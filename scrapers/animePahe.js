import axios from 'axios';
import cheerio from 'cheerio';

const PAHE_BASE = 'https://animepahe.com';

export const getEpisodes = async (slug) => {
  try {
    const url = `${PAHE_BASE}/anime/${slug}`;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const episodes = [];
    $('li.ep-item a').each((i, elem) => {
      const epNum = $(elem).text().trim();
      const epLink = $(elem).attr('href');
      episodes.push({ number: epNum, url: PAHE_BASE + epLink });
    });
    return episodes;
  } catch (error) {
    throw new Error('Failed to fetch episodes from AnimePahe');
  }
};

export const getEpisodeSources = async (slug, episodeNumber) => {
  try {
    const res = await axios.get(`${PAHE_BASE}/play/${slug}-${episodeNumber}`);
    const $ = cheerio.load(res.data);
    const sources = [];
    $('video > source').each((i, elem) => {
      sources.push($(elem).attr('src'));
    });
    return { sources };
  } catch (error) {
    throw new Error('Failed to fetch episode sources from AnimePahe');
  }
};
