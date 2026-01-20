// controllers/contactController.js
const Contact = require('../models/Contact');
const { sendContactNotification } = require('../services/emailService');

const contactController = {
    createContact: async (req, res) => {
        try {
            console.log('📥 Datos recibidos en el servidor:', req.body);
            const { firstName, lastName, email, subject, message } = req.body;

            // Validación básica
            if (!firstName || !lastName || !email || !message) {
                return res.status(400).json({
                    success: false,
                    message: 'Los campos nombre, apellido, email y mensaje son requeridos'
                });
            }

            // Validación de longitud del mensaje
            if (message.trim().length < 5) {
                return res.status(400).json({
                    success: false,
                    message: 'El mensaje debe tener al menos 5 caracteres'
                });
            }

            // Validación de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    success: false,
                    message: 'Email inválido'
                });
            }

            // Usar subject por defecto si no se proporciona
            const finalSubject = subject || 'Consulta desde portfolio';

            // Intentar guardar en base de datos si está disponible
            let savedContact;
            try {
                savedContact = await Contact.create({
                    firstName,
                    lastName,
                    email,
                    subject: finalSubject,
                    message
                });
                console.log('Contacto guardado en base de datos:', savedContact._id);
            } catch (dbError) {
                console.log('Base de datos no disponible, guardando en memoria:', dbError.message);
                // Crear objeto temporal si no hay BD
                savedContact = {
                    firstName,
                    lastName,
                    email,
                    subject: finalSubject,
                    message,
                    createdAt: new Date(),
                    _id: 'temp-' + Date.now()
                };
            }

            // Enviar notificación por email
            try {
                await sendContactNotification({
                    firstName,
                    lastName,
                    email,
                    subject: finalSubject,
                    message
                });
            } catch (emailError) {
                console.error('Error al enviar email (pero el contacto se guardó):', emailError);
                // No fallar la petición si el email falla
            }

            res.status(201).json({
                success: true,
                message: 'Mensaje enviado correctamente',
                data: {
                    id: savedContact._id,
                    firstName: savedContact.firstName,
                    lastName: savedContact.lastName,
                    email: savedContact.email,
                    subject: savedContact.subject,
                    createdAt: savedContact.createdAt
                }
            });

        } catch (error) {
            console.error('Error en createContact:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
};

module.exports = contactController;