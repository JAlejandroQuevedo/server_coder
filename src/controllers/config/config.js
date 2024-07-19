import * as url from 'url';
import path from 'path';
import dotenv from 'dotenv';
import { Command } from 'commander';


//Configuracion de comand Line
const commandLine = new Command();
commandLine
    .option('--mode <SECRET>')
    .option('--port <PORT>')
    .option('--setup <APP_NAME>')
commandLine.parse();
const clOptions = commandLine.opts();

//Configuracion de dot env (variables de entorno)
dotenv.config()
dotenv.config({ path: clOptions.mode === 'prod' ? '.env.prod' : '.env.devel' });


//Config object
const config = {
    APP_NAME: process.env.APP_NAME,
    PORT: process.env.PORT || clOptions.port || 5050,
    // DIRNAME: path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:\/)/, '$1')),
    DIRNAME: url.fileURLToPath(new URL('../../', import.meta.url)),
    get UPLOAD_DIR() { return `${this.DIRNAME}/public/img` },
    MONGODB_ID_REGEX: /^[a-fA-F0-9]{24}$/,
    MONGODB_URI: process.env.MONGODB_URI,
    SECRET: process.env.SECRET,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    GITHUB_CALLBACK_URL: process.env.GITHUB_CALLBACK_URL,
    GMAIL_APP_USER: process.env.GMAIL_APP_USER || process.env.GMAIL_APP_USER_2,
    GMAIL_APP_PASS: process.env.GMAIL_APP_PASS,
    TWILIO_SID: process.env.TWILIO_SID,
    TWILIO_TOKEN: process.env.TWILIO_TOKEN,
    TWILIO_PHONE: process.env.TWILIO_PHONE,
    PERSISTENCE: 'mongo'
}

export { config }