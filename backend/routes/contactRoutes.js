const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// Ruta para crear un nuevo contacto
router.post('/', contactController.createContact);

module.exports = router;
