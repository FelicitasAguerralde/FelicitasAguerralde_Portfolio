// models/Contact.js
try {
    const mongoose = require('mongoose');

    const contactSchema = new mongoose.Schema({
        firstName: {
            type: String,
            required: [true, 'El nombre es requerido'],
            trim: true,
            minlength: [2, 'El nombre debe tener al menos 2 caracteres']
        },
        lastName: {
            type: String,
            required: [true, 'El apellido es requerido'],
            trim: true,
            minlength: [2, 'El apellido debe tener al menos 2 caracteres']
        },
        email: {
            type: String,
            required: [true, 'El email es requerido'],
            trim: true,
            lowercase: true
        },
        subject: {
            type: String,
            required: false,
            default: 'Consulta desde portfolio'
        },
        message: {
            type: String,
            required: [true, 'El mensaje es requerido'],
            minlength: [5, 'El mensaje debe tener al menos 5 caracteres']
        }
    }, {
        timestamps: true
    });

    module.exports = mongoose.model('Contact', contactSchema);
} catch (error) {
    // Si mongoose no está disponible, exportar null
    console.log('📋 Modelo Contact no disponible (mongoose requerido)');
    module.exports = null;
}