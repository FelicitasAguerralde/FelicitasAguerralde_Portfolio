// app.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();

/* =====================================================
   🔐 CONFIGURACIÓN CORS CORRECTA
===================================================== */

const allowedOrigins = [
  'https://felicitasaguerralde.netlify.app/',
  'http://localhost:3001',
  'http://localhost:5173',
  'http://localhost:5174'
];

// Permitir frontend desde variable de entorno (opcional)
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

function isOriginAllowed(origin) {
  if (!origin) return true; // server-to-server

  // Exact match
  if (allowedOrigins.includes(origin)) return true;

  // Netlify deploys (*.netlify.app)
  if (origin.startsWith('https://') && origin.includes('.netlify.app')) {
    return true;
  }

  // Subdominios de mamabike.ar
  if (/^https:\/\/([\w-]+\.)?mamabike\.ar$/.test(origin)) {
    return true;
  }

  // Localhost en desarrollo
  if (
    process.env.NODE_ENV !== 'production' &&
    /^http:\/\/localhost:\d+$/.test(origin)
  ) {
    return true;
  }

  return false;
}

// Middleware CORS (ANTES de rutas)
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (!isOriginAllowed(origin)) {
    console.error(`❌ CORS bloqueado: ${origin}`);
    return res.status(403).json({
      error: 'CORS bloqueado',
      origin
    });
  }

  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  );
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400');

  // Preflight
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

/* =====================================================
   🧩 MIDDLEWARES
===================================================== */

app.use(express.json());

/* =====================================================
   📦 RUTAS
===================================================== */

// ⚠️ IMPORTANTE:
// Dentro de contactRoutes debe usarse router.post('/')
const contactRoutes = require('./routes/contactRoutes');

app.use('/api/contact', contactRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'Mamabike API',
    environment: process.env.NODE_ENV || 'development',
    database:
      mongoose.connection.readyState === 1
        ? 'Conectada'
        : 'No conectada',
    timestamp: new Date().toISOString()
  });
});

// Raíz
app.get('/', (req, res) => {
  res.json({
    message: 'API Mamabike funcionando',
    version: '1.0.0'
  });
});

/* =====================================================
   🟢 MONGODB
===================================================== */

const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

if (mongoUri) {
  mongoose
    .connect(mongoUri)
    .then(() => console.log('✅ MongoDB conectado'))
    .catch(err =>
      console.error('❌ Error MongoDB:', err.message)
    );
} else {
  console.warn(
    '⚠️ MONGO_URI no definido – API sin base de datos'
  );
}

/* =====================================================
   🚀 SERVIDOR
===================================================== */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 API FelicitasAguerralde corriendo en puerto ${PORT}`);
  console.log(`🌐 Entorno: ${process.env.NODE_ENV || 'development'}`);
});
