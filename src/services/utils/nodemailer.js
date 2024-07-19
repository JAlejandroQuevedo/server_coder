import nodemailer from 'nodemailer';
import { config } from '../../controllers/config/config.js';

export const transport_nodemailer = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: config.GMAIL_APP_USER,
        pass: config.GMAIL_APP_PASS
    }
});
