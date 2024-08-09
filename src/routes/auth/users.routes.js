import { Router } from "express";
import { config } from "../../controllers/config/config.js";
import { initAuthStrategies } from "../../auth/passport.strategies.js";
import { ManagerLogin } from "../../controllers/dao/manager/managerLogin.mdb.js";
initAuthStrategies()
const usersRoutes = Router();


usersRoutes.put('/premium/:uid', async (req, res) => {
    try {
        const _uid = req.params.uid
        const role = 'user'
        ManagerLogin.updateUsers(_uid, role)
        res.status(200).send({
            origin: config.PORT,
            payload: `Role cambiado de manera exitosa a ${role}`
        })
        req.logger.info('Usuario creado de manera exitosa');
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
        req.logger.error({ origin: config.SERVER, payload: null, error: err.message });
    }
})
export { usersRoutes }

