import { config } from "../../controllers/config/config.js";

export const handlePolicies = policies => {
    return async (req, res, next) => {
        if (!req.session.user) return res.status(401).send({ origin: config.PORT, payload: 'Usuario no autentificado' })
        if (policies.includes(req.session.user.role)) {
            return next()
        }
        res.status(403).send({ origin: config.PORT, payload: 'No tiene permisos para acceder' })
    }
}

/* Manera de uso: handlePolicies(['admin']) */