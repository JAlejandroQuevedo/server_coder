import { Router } from "express";
import { config } from "../../controllers/config/config.js";
import { initAuthStrategies } from "../../auth/passport.strategies.js";
import { ManagerLogin } from "../../controllers/dao/manager/managerLogin.mdb.js";
import { ManagerLoginGoogle } from "../../controllers/dao/manager/managerGogle.mdb.js";
import { uploader } from "../../services/uploader/uploaderCloudinaryDocuments.js";
import { verifyKeyAdmin } from "../../services/utils/verifyKeyAdmin.js";
import { verifyRequiredBodyRole } from "../../services/utils/verifyRequiredBodyRole.js";
import { adminAuth } from "../../services/utils/adminAuth.js";
initAuthStrategies()
const usersRoutes = Router();
usersRoutes.get('/', async (req, res) => {
    try {
        const users = await ManagerLogin.getUsers();
        const usersGoogle = await ManagerLoginGoogle.getUsers()
        res.status(200).send({
            origin: config.PORT,
            users: users,
            usersGoogle: usersGoogle
        })
        req.logger.info('Usuarios obtenidos de manera exitosa');
    }
    catch (err) {
        req.logger.error('Existe un error al obtener los usuarios', err);
    }
})

usersRoutes.put('/role/:key/:uid', verifyKeyAdmin, verifyRequiredBodyRole(['admin', 'premium']), adminAuth, async (req, res) => {
    try {
        const _uid = req.params.uid;
        const role = req.body.role
        ManagerLogin.updateRole(_uid, role);
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
usersRoutes.post('/premium/documents/:uid', uploader.array('thumbnail', 3), async (req, res) => {
    try {
        // console.log('HI')
        const _uid = req.params.uid;
        const uploadedFiles = req.files.map(file => ({
            originalName: file.originalname, // Nombre original del archivo subido
            cloudinaryPath: file.path, // Ruta del archivo en Cloudinary
            publicId: file.filename // Nombre público del archivo en Cloudinary
        }));
        const role = 'premium';
        ManagerLogin.updateUsers(_uid, role, uploadedFiles)
        res.status(200).send({
            origin: config.PORT,
            payload: `Role cambiado de manera exitosa a ${role}`
        })
        req.logger.info('Role cambiado de manera exitosa a ${role}');
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
        req.logger.error({ origin: config.SERVER, payload: null, error: err.message });
    }
})
usersRoutes.delete('/', async (req, res) => {
    try {
        ManagerLogin.deleteUsers()
        res.status(200).send({
            origin: config.PORT,
            payload: 'Tiempo limite solicitado'
        })


    }
    catch (err) {
        req.logger.error({ origin: config.SERVER, payload: null, error: err.message });
    }
})
export { usersRoutes }

