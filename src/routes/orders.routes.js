import { Router } from 'express';
import nodemailer from 'nodemailer'
import twilio from 'twilio';
import { config } from '../controllers/config/config.js';

const routereMAIL = Router();
const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: config.GMAIL_APP_USER,
        pass: config.GMAIL_APP_PASS
    }
});

const twilioClient = twilio(config.TWILIO_SID, config.TWILIO_TOKEN);

routereMAIL.get('/mail', async (req, res) => {
    try {
        const confirmation = await transport.sendMail({
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
