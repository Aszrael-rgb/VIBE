import axios from 'axios';

// Instancia de alto rendimiento para búsqueda y streams
const YOUTUBE_API_URL = 'https://invidious.snopyta.org/api/v1'; 
const PROXY_URL = 'https://corsproxy.io/?';

export const MusicService = {
  searchYouTube: async (query) => {
    try {
      const response = await axios.get(`${YOUTUBE_API_URL}/search`, {
        params: { q: query, type: 'video' }
      });
      
      return (response.data || []).map(item => ({
        id: item.videoId,
        name: item.title,
        artist: item.author,
        image: [{ url: `https://img.youtube.com/vi/${item.videoId}/mqdefault.jpg` }],
        isYouTube: true,
        duration: item.lengthSeconds,
      }));
    } catch (error) {
      console.error('Error en búsqueda:', error);
      return [];
    }
  },

  getTrending: async () => {
    try {
      const response = await axios.get(`${YOUTUBE_API_URL}/trending`, {
        params: { type: 'music' }
      });
      return (response.data || []).slice(0, 20).map(item => ({
        id: item.videoId,
        name: item.title,
        artist: item.author,
        image: [{ url: `https://img.youtube.com/vi/${item.videoId}/mqdefault.jpg` }],
        isYouTube: true,
        duration: item.lengthSeconds,
      }));
    } catch (error) {
      console.error('Error en tendencias:', error);
      return [];
    }
  },

  // Obtención rápida del stream
  getYoutubeStream: async (videoId) => {
    // Intentamos obtener el stream directamente desde la instancia de Invidious
    // Esto es mucho más rápido que usar Cobalt
    return `https://invidious.snopyta.org/latest/latest/${videoId}?quality=dash`;
    // Nota: El navegador gestionará el stream automáticamente
  }
};
