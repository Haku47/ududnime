/**
 * UDUDNIME API SERVICE - PRO EDITION
 * Powered by Jikan API (MyAnimeList)
 * Optimized with Smart Caching & Error Handling gais!
 */

// Ambil Base URL dari .env gais!
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// --- 🧠 SMART CACHE SYSTEM ---
// Kita simpan data di memory supaya gak bombardir API pas refresh gais.
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // Data disimpan 5 menit ya gais!

/**
 * FUNGSI FETCHER DENGAN CACHING & SMART ERROR HANDLING GAIS!
 */
async function fetcher(endpoint) {
  // 1. Cek apakah data ada di cache gais
  if (cache.has(endpoint)) {
    const { data, timestamp } = cache.get(endpoint);
    if (Date.now() - timestamp < CACHE_DURATION) {
      return data;
    }
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    
    if (!response.ok) {
      if (response.status === 429) {
        // Kasih jeda 15 detik kalau kena limit gais!
        throw new Error("RATE LIMIT: Jikan API lagi narik napas gais, tunggu 15 detik ya!");
      }
      if (response.status === 404) {
        throw new Error("NOT FOUND: Data anime-nya gaib gais, gak ketemu.");
      }
      if (response.status >= 500) {
        throw new Error("SERVER ERROR: Jikan API lagi tumbang, coba lagi nanti gais.");
      }
      throw new Error(`API ERROR: Status ${response.status}`);
    }

    const result = await response.json();
    
    // 2. Simpan hasil ke cache gais
    cache.set(endpoint, { data: result, timestamp: Date.now() });
    
    return result;
  } catch (error) {
    console.error("SERVICE_FATAL_ERROR:", error.message);
    throw error;
  }
}

export const animeService = {
  // Ambil data Top Anime dengan filter dinamis gais!
  async getTopAnime(page = 1, limit = 15, filter = 'bypopularity') {
    return fetcher(`/top/anime?filter=${filter}&page=${page}&limit=${limit}`);
  },

  // AMBIL TOP 10 SEASONAL TRENDING GAIS!
  async getTop10() {
    return fetcher(`/top/anime?filter=airing&limit=10`);
  },

  // Pencarian Anime berdasarkan teks
  async searchAnime(query, page = 1, limit = 15) {
    if (!query) return null;
    return fetcher(`/anime?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
  },

  // Ambil Anime berdasarkan Genre
  async getAnimeByGenre(genreId, page = 1, limit = 15) {
    return fetcher(`/anime?genres=${genreId}&order_by=popularity&sort=desc&page=${page}&limit=${limit}`);
  },

  /**
   * 📅 ESTIMATED SCHEDULE FETCHER GAIS!
   * Berdasarkan waktu lokal Malang gais!
   */
  async getSchedule(day = '') {
    const filter = day || new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    return fetcher(`/schedules?filter=${filter}&limit=20&kids=false&sfw=true`);
  },

  // Ambil data Explorer dengan Sorting gais
  async getExplorer(type, value, orderBy = 'popularity', sort = 'desc', limit = 16) {
    if (type === 'genre') {
      return fetcher(`/anime?genres=${value}&order_by=${orderBy}&sort=${sort}&limit=${limit}`);
    } else {
      // Dinamis mengikuti tahun 2026 gais!
      return fetcher(`/anime?season=${value}&year=2026&order_by=${orderBy}&sort=${sort}&limit=${limit}`);
    }
  },

  // Ambil data tahunan Anime
  async getAnimeByYear(year, orderBy = 'popularity', sort = 'desc', limit = 16) {
    return fetcher(`/anime?start_date=${year}-01-01&end_date=${year}-12-31&order_by=${orderBy}&sort=${sort}&limit=${limit}`);
  },

  // Ambil Random Anime
  async getRandomAnime() {
    return fetcher('/random/anime');
  },

  // Ambil data Hero Carousel gais
  async getHeroAnime() {
    return fetcher(`/top/anime?filter=airing&limit=5`);
  },

  // Ambil Detail Lengkap Anime berdasarkan ID
  async getAnimeDetail(id) {
    return fetcher(`/anime/${id}/full`);
  }
};