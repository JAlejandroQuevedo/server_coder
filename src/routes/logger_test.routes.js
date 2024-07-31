import { Router } from "express";
import { loggers } from "../controllers/config/message.logger.js";

const loggerTest = Router();

const message = loggers;

loggerTest.get('/loggerTest', async (req, res) => {
    try {
        res.status(200).send({ status: 'OK', payload: message });

    }
    catch (err) {

    }
})

export { loggerTest }