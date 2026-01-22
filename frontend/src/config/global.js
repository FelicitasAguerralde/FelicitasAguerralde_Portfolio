const ENV = process.env.NODE_ENV; // development | production

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
      normalizeApiUrl(process.env.REACT_APP_API_URL) ||
      'https://felicitasaguerralde.onrender.com/api',
  },
};

const currentConfig = CONFIG[ENV];

if (!currentConfig || !currentConfig.API_BASE) {
  throw new Error(`❌ API_BASE no definido para el entorno: ${ENV}`);
}

export const API_URL = currentConfig.API_BASE;
export const IS_DEV = ENV === 'development';

console.log(`🌐 API Config: ${ENV} -> ${API_URL}`);
