// config/database.js - VERSIÓN SIMPLE Y FUNCIONAL
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log('🔗 Conectando a MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB conectado exitosamente');
    } catch (error) {
        console.log('⚡ MongoDB no disponible:', error.message);
    }
};

module.exports = connectDB;