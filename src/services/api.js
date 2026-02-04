/**
 * UDUDNIME API SERVICE - PRO EDITION
 * Powered by Jikan API (MyAnimeList)
 * Optimized with Multilingual Support & Smart Caching gais!
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// --- 🧠 SMART CACHE SYSTEM ---
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; 

// 🚀 ANTI-RATE LIMIT QUEUE
const delay = (ms) => new Promise(res => setTimeout(res, ms));
let lastRequestTime = 0;

/**
 * AMBIL BAHASA DARI DASHBOARD USER GAIS
 * Default: English ('en')
 */
const getActiveLang = () => {
  const session = localStorage.getItem('ududnime_session');
  if (session) {
    try {
      const user = JSON.parse(session);
      return user.lang || 'en';
    } catch (e) { return 'en'; }
  }
  return 'en';
};

/**
 * FUNGSI FETCHER DENGAN DUKUNGAN BAHASA GAIS!
 */
async function fetcher(endpoint) {
  const lang = getActiveLang();

  // 1. Cek Memory Cache gais
  if (cache.has(endpoint)) {
    const { data, timestamp } = cache.get(endpoint);
    if (Date.now() - timestamp < CACHE_DURATION) return data;
  }

  // 2. Queue Protection
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  if (timeSinceLastRequest < 1000) {
    await delay(1000 - timeSinceLastRequest);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    lastRequestTime = Date.now();
    
    if (!response.ok) {
      if (response.status === 429) {
        await delay(2000);
        return fetcher(endpoint); 
      }

      // Pesan Error Multilingual gais
      const errorMsgs = {
        en: { 404: "NOT FOUND: Anime is missing gais.", 500: "SERVER ERROR: Jikan is dizzy gais." },
        id: { 404: "NOT FOUND: Anime-nya gaib gais.", 500: "SERVER ERROR: Jikan lagi pusing gais." },
        jv: { 404: "ORA KETEMU: Anime-ne ilang cak.", 500: "SERVER EROR: Jikan lagi mumet gais." },
        jp: { 404: "見つかりません: アニメがありません gais.", 500: "サーバーエラー: サーバーが混雑しています。" }
      };

      const msg = errorMsgs[lang]?.[response.status] || `API ERROR: Status ${response.status}`;
      throw new Error(msg);
    }

    const result = await response.json();
    cache.set(endpoint, { data: result, timestamp: Date.now() });
    return result;
  } catch (error) {
    console.error("SERVICE_FATAL_ERROR:", error.message);
    throw error;
  }
}

export const animeService = {
  // Ambil data Top Anime gais!
  async getTopAnime(page = 1, limit = 15, filter = 'bypopularity') {
    return fetcher(`/top/anime?filter=${filter}&page=${page}&limit=${limit}`);
  },

  // TOP 10 TRENDING GAIS!
  async getTop10() {
    return fetcher(`/top/anime?filter=airing&limit=10`);
  },

  // Pencarian Anime (Min 3 huruf gais)
  async searchAnime(query, page = 1, limit = 15) {
    const cleanQuery = query?.trim();
    if (!cleanQuery || cleanQuery.length < 3) return null;
    return fetcher(`/anime?q=${encodeURIComponent(cleanQuery)}&page=${page}&limit=${limit}`);
  },

  // Berdasarkan Genre gais
  async getAnimeByGenre(genreId, page = 1, limit = 15) {
    return fetcher(`/anime?genres=${genreId}&order_by=popularity&sort=desc&page=${page}&limit=${limit}`);
  },

  // Jadwal berdasarkan waktu Malang gais!
  async getSchedule(day = '') {
    const filter = day || new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    return fetcher(`/schedules?filter=${filter}&limit=20&kids=false&sfw=true`);
  },

  // Explorer Mode gais
  async getExplorer(type, value, orderBy = 'popularity', sort = 'desc', limit = 16) {
    if (type === 'genre') {
      return fetcher(`/anime?genres=${value}&order_by=${orderBy}&sort=${sort}&limit=${limit}`);
    } else {
      // Dinamis 2026 gais!
      return fetcher(`/anime?season=${value}&year=2026&order_by=${orderBy}&sort=${sort}&limit=${limit}`);
    }
  },

  async getRandomAnime() {
    return fetcher('/random/anime');
  },

  async getAnimeDetail(id) {
    if (!id || isNaN(id)) throw new Error("INVALID_ID");
    return fetcher(`/anime/${id}/full`);
  }
};