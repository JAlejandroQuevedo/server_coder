import { config } from "../../controllers/config/config.js";
import { errorsDictionary } from "../../controllers/config/errorsDictionary.js";
import CustomError from "../error/CustomError.class.js";

export const verifyMongoDBId = (id) => {
    return (req, res, next) => {
        const _id = req.params.id;
        if (!config.MONGODB_ID_REGEX.test(_id)) throw new CustomError(errorsDictionary.INVALID_MONGOID_FORMAT);
        next();
    }
}