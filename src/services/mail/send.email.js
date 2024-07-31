import { transport_nodemailer } from "../utils/nodemailer.js";
import { config } from "../../controllers/config/config.js";

export const sendMail = async (from_message, to_email, subject_message, html_body) => {
    try {
        if (!from_message || !to_email || !subject_message || !html_body) {
            console.error('Todos los parámetros son obligatorios');
            return;
        }
        const confirmation = await transport_nodemailer.sendMail({
            from: `${from_message}<${config.GMAIL_APP_USER}>`,
            to: to_email,
            subject: subject_message,
            html: html_body
        })
        console.log(`Email enviado de manera exitosa a: ${to_email}`);
        return confirmation
    }
    catch (err) {
        console.error('Existe un error al enviar el email:', {
            message: err.message,
            stack: err.stack,
            to: to_email,
            subject: subject_message
        });
    }
}