const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Rutas básicas
app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenido a la API del Portfolio',
    version: '1.0.0',
    endpoints: {
      projects: '/api/projects',
      contact: '/api/contact'
    }
  });
});

// Ruta para obtener proyectos
app.get('/api/projects', (req, res) => {
  // Aquí podrías conectar a una base de datos
  // Por ahora, devolver datos mock
  const projects = [
    {
      id: 1,
      title: 'Proyecto de Ejemplo',
      description: 'Descripción del proyecto',
      technologies: ['React', 'Node.js']
    }
  ];
  res.json(projects);
});

// Rutas de contacto
const contactRoutes = require('./routes/contactRoutes');
app.use('/api/contact', contactRoutes);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});