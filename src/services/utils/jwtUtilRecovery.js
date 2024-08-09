import { config } from '../../controllers/config/config.js';
import jwt from 'jsonwebtoken';

export const verifyTokenRecovery = (req, res, next) => {
    const headerToken = req.headers.authorization ? req.headers.authorization.split(' ')[1] : undefined;
    const cookieToken = req.cookies && req.cookies[`${config.APP_NAME}_cookie`] ? req.cookies[`${config.APP_NAME}_cookie`] : undefined;
    const queryToken = req.query.access_token ? req.query.access_token : undefined;
    const receivedToken = headerToken || cookieToken || queryToken;
    if (!receivedToken) {
        // return res.redirect('/forgotYourPassword');
        return res.status(401).send({ origin: config.PORT, payload: 'Se requiere un token de autenticación' });
    }
    jwt.verify(receivedToken, config.SECRET, (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.redirect('/forgotYourPassword');
            } else {
                return res.status(403).send({ origin: config.PORT, payload: 'Token no válido' });
            }
        }
        req.user = decoded;
        next();
    });
};




// import { config } from '../../controllers/config/config.js';
// import jwt from 'jsonwebtoken';


// export const createToken = (payload, duration) => jwt.sign(payload, config.SECRET, { expiresIn: duration });
// export const verifyToken = (req, res, next) => {
//     // Header Authorization: Bearer <token>
//     const headerToken = req.headers.authorization ? req.headers.authorization.split(' ')[1] : undefined;
//     const cookieToken = req.cookies && req.cookies[`${config.APP_NAME}_cookie`] ? req.cookies[`${config.APP_NAME}_cookie`] : undefined;
//     const queryToken = req.query.access_token ? req.query.access_token : undefined;
//     const receivedToken = headerToken || cookieToken || queryToken;

//     if (!receivedToken) return res.status(401).send({ origin: config.PORT, payload: 'Se requiere token' });

//     jwt.verify(receivedToken, config.SECRET, (err, payload) => {
//         if (err) return res.status(403).send({ origin: config.PORT, payload: 'Token no válido' });
//         req.user = payload;
//         next();
//     });
// }