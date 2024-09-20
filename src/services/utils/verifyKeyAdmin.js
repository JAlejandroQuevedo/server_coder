import { config } from '../../controllers/config/config.js';
import { errorsDictionary } from '../../controllers/config/errorsDictionary.js';
import CustomError from '../error/CustomError.class.js';

export const verifyKeyAdmin = (req, res, next) => {
    if (req.params.key !== config.KEY_ROLE) throw new CustomError(errorsDictionary.INVALID_KEY_ROLE)
    next()
}