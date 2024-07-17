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
    // UPLOAD_DIR: 'public/img'
    get UPLOAD_DIR() { return `${this.DIRNAME}/public/img` },
    MONGODB_ID_REGEX: /^[a-fA-F0-9]{24}$/,
    MONGODB_URI: process.env.MONGODB_URI,
    SECRET: process.env.SECRET,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    GITHUB_CALLBACK_URL: process.env.GITHUB_CALLBACK_URL,
    PERSISTENCE: 'mongo'
    // MONGODB_URI: 'mongodb+srv://coder_53160:coder2024@clustercoder.sxqjiud.mongodb.net/coder_53160',
}

//usuario:clave@mongodb://127.0.0.1:27017/proyecto_coder ==> Manera de acceder a una base con usuario y clave
export { config }
// ed40cc74184194682fd2787da69dc3f410576e96 => Client secret