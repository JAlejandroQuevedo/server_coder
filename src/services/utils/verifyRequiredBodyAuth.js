import { errorsDictionary } from "../../controllers/config/errorsDictionary.js";
import CustomError from "../error/CustomError.class.js";
export const verifyRequiredBodyAuth = (requiredFields) => {
    return (req, res, next) => {
        const allOk = requiredFields.every(field =>
            req.body.hasOwnProperty(field) && req.body[field] !== '' && req.body[field] !== null && req.body[field] !== undefined
        );
        if (!allOk) throw new CustomError(errorsDictionary.FEW_PARAMETERS, errorsDictionary.FEW_PARAMETERS.message, requiredFields);

        next();
    };
};