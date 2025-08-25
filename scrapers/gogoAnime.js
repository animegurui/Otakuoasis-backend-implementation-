import axios from 'axios';
import cheerio from 'cheerio';

const GOGO_BASE = 'https://gogoanime.ai'; // Example domain

export const getEpisodes = async (slug) => {
  try {
    const url = `${GOGO_BASE}/category/${slug}`;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const episodes = [];
    $('#episode_page li a').each((i, elem) => {
      const epNum = $(elem).text().trim();
      const epLink = $(elem).attr('href');
      episodes.push({ number: epNum, url: GOGO_BASE + epLink });
    });
    return episodes;
  } catch (error) {
    throw new Error('Failed to fetch episodes');
  }
};

export const getEpisodeSources = async (slug, episodeNumber) => {
  try {
    // Simplified example: fetch iframe src from watch page
    const res = await axios.get(`${GOGO_BASE}/watch/${slug}-episode-${episodeNumber}`);
    const $ = cheerio.load(res.data);
    const iframeSrc = $('div.play-video iframe').attr('src');
    return { sources: [iframeSrc] };
  } catch (error) {
    throw new Error('Failed to fetch episode sources');
  }
};
