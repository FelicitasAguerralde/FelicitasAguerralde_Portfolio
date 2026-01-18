// routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const emailService = require('../services/emailService');

router.post('/', async (req, res) => {
  console.log('=== 📩 NUEVA SOLICITUD DE CONTACTO ===');

  try {
    const { firstName, lastName, email, subject, message } = req.body;

    console.log('Datos recibidos:', {
      firstName,
      lastName,
      email,
      subject
    });

    /* =====================
       VALIDACIONES
    ===================== */

    if (
      !firstName?.trim() ||
      !lastName?.trim() ||
      !email?.trim() ||
      !subject ||
      !message?.trim()
    ) {
      console.log('❌ Validación fallida: campos incompletos');
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son requeridos'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('❌ Email inválido');
      return res.status(400).json({
        success: false,
        message: 'Email inválido'
      });
    }

    console.log('✅ Validaciones OK');

    /* =====================
       GUARDADO EN DB (SI HAY)
    ===================== */

    let savedContact;
    let dbUsed = false;

    if (mongoose.connection.readyState === 1) {
      try {
        const Contact = require('../models/Contact');

        savedContact = await Contact.create({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim().toLowerCase(),
          subject,
          message: message.trim()
        });

        dbUsed = true;
        console.log('💾 Guardado en MongoDB:', savedContact._id);
      } catch (dbError) {
        console.error('❌ Error MongoDB:', dbError.message);
      }
    } else {
      console.log('⚠️ MongoDB no conectado, modo temporal');
    }

    if (!dbUsed) {
      savedContact = {
        id: Date.now(),
        firstName,
        lastName,
        email,
        subject,
        message,
        createdAt: new Date().toISOString(),
        status: 'temporal'
      };
    }

    /* =====================
       ENVÍO DE EMAIL
    ===================== */

    let emailSent = false;

    try {
      emailSent = await emailService.sendContactNotification({
        firstName,
        lastName,
        email,
        subject,
        message
      });

      console.log(emailSent ? '📧 Email enviado' : '⚠️ Email no enviado');
    } catch (mailError) {
      console.error('❌ Error enviando email:', mailError.message);
    }

    /* =====================
       RESPUESTA
    ===================== */

    res.status(201).json({
      success: true,
      message: 'Mensaje recibido correctamente',
      database: dbUsed,
      notificationSent: emailSent
    });

    console.log('=== ✅ FIN CONTACTO ===\n');

  } catch (error) {
    console.error('❌ Error general contacto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al procesar el mensaje'
    });
  }
});

/* =====================
   DEBUG EMAIL (PRODUCCIÓN CONTROLADA)
===================== */

router.post('/debug-email', async (req, res) => {
  console.log('=== 🧪 DEBUG EMAIL ===');

  try {
    console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'OK' : 'FALTANTE');
    console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'OK' : 'FALTANTE');
    console.log('EMAIL_FROM:', process.env.EMAIL_FROM || '(default)');
    console.log('EMAIL_TO:', process.env.EMAIL_TO || '(default)');

    const testData = {
      firstName: 'Test',
      lastName: 'Mamabike',
      email: 'test@test.com',
      subject: 'Prueba sistema Mamabike',
      message: 'Mensaje de prueba'
    };

    const result = await emailService.sendContactNotification(testData);

    if (!result) {
      return res.status(500).json({
        success: false,
        message: 'Falló el envío de email'
      });
    }

    res.json({
      success: true,
      message: 'Email enviado correctamente'
    });

  } catch (error) {
    console.error('❌ Debug email error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
