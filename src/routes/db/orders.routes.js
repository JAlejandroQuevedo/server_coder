import { Router } from 'express';
import { transport_nodemailer } from '../../services/utils/nodemailer.js';
import { config } from '../../controllers/config/config.js';
import compression from 'express-compression';
const routereMAIL = Router();


routereMAIL.get('/mail', async (req, res) => {
    try {
        const confirmation = await transport_nodemailer.sendMail({
            from: `Sistema Coder <${config.GMAIL_APP_USER}>`, // email origen
            to: 'alejandrocabrera245@hotmail.com',
            subject: 'Confirmacion de registro de usuario',
            html: '<h1>Usuario registrado con exito</h1>'
        });
        res.status(200).send({ status: 'OK', data: confirmation });
    } catch (err) {
        res.status(500).send({ status: 'ERR', data: err.message });
    }
});
// compression({brotli: {enabled: true, zlib: {}}});
// compression();
routereMAIL.get('/longtext', compression({ brotli: { enabled: true, zlib: {} } }), async (req, res) => {
    try {
        const base = "Prueba de modulo de compresion";
        let string = '';
        for (let i = 0; i < 10e4; i++) string += base;
        res.status(200).send({ status: 'OK', data: base });
    } catch (err) {
        res.status(500).send({ status: 'ERR', data: err.message });
    }
});

routereMAIL.get('/sms', async (req, res) => {
    try {
        const confirmation = await twilioClient.messages.create({
            body: 'Mensaje enviado con servicio Twilio',
            from: config.TWILIO_PHONE,
            to: '+526871135148'
        });
        res.status(200).send({ status: 'OK', data: confirmation });
    } catch (err) {
        res.status(500).send({ status: 'ERR', data: err.message });
    }
});


export { routereMAIL };
