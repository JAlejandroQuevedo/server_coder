import { errorsDictionary } from "../../controllers/config/errorsDictionary.js";
import CustomError from "../error/CustomError.class.js";
export const verifyRequiredBodyRole = (allowedRoles) => {
    return (req, res, next) => {
        // Verifica que el campo 'role' exista y tenga un valor válido
        const role = req.body.role;
        if (!role || !allowedRoles.includes(role)) {
            throw new CustomError(
                errorsDictionary.FEW_PARAMETERS,
                `Role must be one of the following: ${allowedRoles.join(', ')}`,
                { allowedRoles }
            );
        }

        next();
    };
};