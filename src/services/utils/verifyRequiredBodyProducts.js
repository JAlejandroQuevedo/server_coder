import { errorsDictionary } from "../../controllers/config/errorsDictionary.js";
import CustomError from "../../services/error/CustomError.class.js";
import { config } from "../../controllers/config/config.js"
export const verifyRequiredBodyProducts = (requiredFields) => {
    return (req, res, next) => {
        if (typeof req.body !== 'object' || req.body === null) {
            return res.status(400).send({ origin: config.PORT, payload: 'Invalid request body', requiredFields });
        }

        const missingFields = requiredFields.filter(field =>
            !(field in req.body) || req.body[field] === '' || req.body[field] === null || req.body[field] === undefined
        );
        if (missingFields.length > 0) {
            console.error(`Faltan propiedades: requiredFields: ${missingFields}`);
            throw new CustomError(errorsDictionary.FEW_PARAMETERS, errorsDictionary.FEW_PARAMETERS.message, missingFields);

        }

        next();
    };
};