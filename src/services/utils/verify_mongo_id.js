import { config } from "../../controllers/config/config.js";

export const verifyMongoDBId = (id) => {
    return (req, res, next) => {
        if (!config.MONGODB_ID_REGEX.test(req.params.id)) {
            return res.status(400).send({ origin: config.PORT, payload: null, error: 'Id no válido' });
        }

        next();
    }
}