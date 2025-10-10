import axios from 'axios';

// URL absolue vers Django
const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Intercepteur pour ajouter le token aux requêtes
api.interceptors.request.use(
  (config) => {
    const tokens = JSON.parse(localStorage.getItem('tokens') || '{}');
    if (tokens.access) {
      config.headers.Authorization = `Bearer ${tokens.access}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les tokens expirés
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    console.log('INTERCEPTEUR - Erreur capturée');
    console.log('URL:', originalRequest?.url);
    console.log('Status:', error.response?.status);
    console.log('_retry:', originalRequest?._retry);

    // NE PAS intercepter les erreurs de la route /login/
    if (originalRequest?.url?.includes('/login/')) {
      console.log('INTERCEPTEUR - Route /login/ détectée, on laisse passer l\'erreur');
      return Promise.reject(error);
    }

    // Gérer uniquement le refresh token pour les autres routes
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const tokens = JSON.parse(localStorage.getItem('tokens') || '{}');
        
        if (!tokens.refresh) {
          console.log('INTERCEPTEUR - Pas de refresh token, redirection login');
          localStorage.removeItem('tokens');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return Promise.reject(error);
        }

        console.log('INTERCEPTEUR - Tentative de refresh du token');
        const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
          refresh: tokens.refresh
        });

        const newTokens = response.data;
        localStorage.setItem('tokens', JSON.stringify(newTokens));
        
        originalRequest.headers.Authorization = `Bearer ${newTokens.access}`;
        console.log('INTERCEPTEUR - Token refreshed, retry de la requête');
        return api(originalRequest);
      } catch (refreshError) {
        console.log('INTERCEPTEUR - Échec du refresh, redirection login');
        localStorage.removeItem('tokens');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    console.log('INTERCEPTEUR - Erreur propagée normalement');
    return Promise.reject(error);
  }
);

export default api;