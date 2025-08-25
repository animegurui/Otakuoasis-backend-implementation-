import anigo from 'anigo-anime-api';

// Wrapper around Anigo API (scrapes Gogoanime/Animixplay)
export const getPopularAnime = async () => {
  return await anigo.getPopular(1); // type 1: weekly trending
};

export const searchAnime = async (query) => {
  return await anigo.searchGogo(query);
};
