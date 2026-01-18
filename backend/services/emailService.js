const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendContactNotification({ firstName, lastName, email, subject, message }) {
  try {
    console.log('📧 [RESEND] Enviando email...');

    await resend.emails.send({
      from: 'Mamabike <onboarding@resend.dev>',
      to: ['felicitas.aguerralde@gmail.com'],
      replyTo: email,
      subject: `📩 Nuevo contacto Mamabike: ${subject}`,
      html: `
        <h2>Nuevo mensaje de contacto</h2>
        <p><b>Nombre:</b> ${firstName} ${lastName}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Mensaje:</b></p>
        <p>${message}</p>
      `,
    });

    console.log('✅ [RESEND] Email enviado correctamente');
    return true;
  } catch (error) {
    console.error('❌ [RESEND] Error al enviar email:', error);
    return false;
  }
}

module.exports = { sendContactNotification };
