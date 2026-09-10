// global.jsx

// En Vite se utiliza import.meta.env.MODE en lugar de process.env.NODE_ENV
const MODE = import.meta.env.MODE; // 'development' | 'production'

const normalizeApiUrl = (url) => {
  if (!url) return null;

  url = url.trim().replace(/\/+$/, '');

  if (!url.endsWith('/api')) {
    url = url + '/api';
  }

  return url;
};

const CONFIG = {
  development: {
    API_BASE: 'http://localhost:3001/api',
  },
  production: {
    API_BASE:
      normalizeApiUrl(import.meta.env.VITE_API_URL) ||
      'https://felicitasaguerralde.onrender.com/api',
  },
};

const currentConfig = CONFIG[MODE];

if (!currentConfig || !currentConfig.API_BASE) {
  throw new Error(`❌ API_BASE no definido para el entorno: ${MODE}`);
}

export const API_URL = currentConfig.API_BASE;

// Vite provee un booleano directo import.meta.env.DEV (true en desarrollo)
export const IS_DEV = import.meta.env.DEV;

// console.log(`🌐 API Config: ${MODE} -> ${API_URL}`);