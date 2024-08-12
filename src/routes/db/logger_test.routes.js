import { Router } from "express";
import { exec } from 'child_process';
import { config } from "../../controllers/config/config.js";
import fs from 'fs'
import { generateCode } from "../../services/utils/code.js";
// import { generateCode } from "../services/utils/code.js";

const loggerTest = Router();

// artillery run ${scriptPath} -o ${config.DIRNAME_LOG}/artillery_test_${generateCode()}.json`

loggerTest.get('/loggerTest', async (req, res) => {
    try {
        const scriptPath = './config.yml';
        const outputPath = `${config.DIRNAME_LOG}/artillery_test_output_${generateCode()}.json`
        exec(`artillery run ${scriptPath} -o ${outputPath}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing Artillery: ${error.message}`);
                return res.status(500).send(`Error executing Artillery: ${error.message}`);
            }

            if (stderr) {
                console.error(`Artillery stderr: ${stderr}`);
            }

            console.log(`Artillery stdout: ${stdout}`);
            fs.readFile(outputPath, 'utf-8', (readError, data) => {
                if (readError) {
                    console.error(`Error leyendo el archivo de salida: ${readError.message}`);
                    return res.status(500).send(`Error leyendo el archivo de salida: ${readError.message}`);
                }
                res.setHeader('Content-Type', 'application/json');
                res.status(200).send({ status: `Test realizado con exito y almacenado en ${outputPath}`, payload: data })
            })
            // res.send({ output: 'Hi', error: '' });
        });

    }
    catch (err) {

    }
})

export { loggerTest }