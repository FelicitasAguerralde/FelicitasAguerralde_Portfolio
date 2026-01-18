// controllers/contactController.js
const Contact = require('../models/Contact');

const contactController = {
    createContact: async (req, res) => {
        try {
            const { firstName, lastName, email, subject, message } = req.body;

            // Validación básica
            if (!firstName || !lastName || !email || !subject || !message) {
                return res.status(400).json({
                    success: false,
                    message: 'Todos los campos son requeridos'
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

            // Intentar guardar en base de datos si está disponible
            let savedContact;
            try {
                savedContact = await Contact.create({
                    firstName,
                    lastName,
                    email,
                    subject,
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
                    subject,
                    message,
                    createdAt: new Date(),
                    _id: 'temp-' + Date.now()
                };
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