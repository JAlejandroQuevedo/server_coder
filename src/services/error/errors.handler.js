import { errorsDictionary } from '../../controllers/config/errorsDictionary.js';
import { config } from "../../controllers/config/config.js"



const errorsHandler = (error, req, res, next) => {
    let customErr = errorsDictionary.UNHANDLED_ERROR;
    if (error && error.type && error.type.code) {
        const matchedError = Object.values(errorsDictionary).find(err => err.code === error.type.code);
        if (matchedError) {
            customErr = matchedError;
        }
    }
    return res.status(customErr.status).send({
        status: customErr.status,
        origin: config.PORT,
        error: customErr.message,
        requiredFields: error?.payload || null
    });
};
export default errorsHandler;

// const errorsHandler = (error, req, res, next) => {

//     let customErr = errorsDictionary.UNHANDLED_ERROR;
//     for (const key in errorsDictionary) {
//         if (errorsDictionary[key].code === error.type.code) customErr = errorsDictionary[key];
//     }

//     return res.send({ status: customErr.status, origin: config.PORT, error: customErr.message, requiredFields: error.payload });
// };
