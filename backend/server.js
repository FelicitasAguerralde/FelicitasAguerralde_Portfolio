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

// Ruta para contacto (enviar email)
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;

  // Aquí implementarías el envío de email
  console.log('Mensaje recibido:', { name, email, message });

  res.json({ success: true, message: 'Mensaje enviado correctamente' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});