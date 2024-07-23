import { config } from '../../controllers/config/config.js'
export const adminAuth = (req, res, next) => {
    if (req.session.user?.role !== 'admin')
        return res.status(401).send({ origin: config.PORT, payload: 'Acceso no autorizado: se requiere autenticación y nivel de admin' });

    next();
}