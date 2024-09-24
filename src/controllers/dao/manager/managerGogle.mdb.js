// import { modelUsers } from "../models/users.model.js";
import { modelUsersGoogle } from "../models/user.google.js";
import { logger } from "../../../services/log/logger.js";
import { createHash, isValidPassword } from "../../../services/utils/bycript.js";
import { dateTime } from "../../../services/utils/dateTime.js";
const modelUsers = modelUsersGoogle
class ManagerLoginGoogle {

    static adminAuth = (req, res, next) => {

        if (req.session.user?.role !== 'admin')
            return res.status(401).send({ origin: config.SERVER, payload: 'Acceso no autorizado: se requiere autenticación y nivel de admin' });

        next();
    }
    static async getUsers() {
        try {
            const users = await modelUsers.find();
            const user_filter = users.map(user => {
                return {
                    _id: user._id,
                    name: user.name,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role
                }
            })
            return user_filter;
        }
        catch (error) {
            logger.error('Error al leer el archivo', error)
        }
    }
    static async getOne(fiter) {
        try {
            const user = await modelUsers.findOne(fiter);
            return user;
        }
        catch (err) {
            logger.error('Error al obtener el usuario', err)
        }
    }
    static async addUser(name, lastName, email) {
        const last_conection = dateTime();
        const conection = new Date()
        try {
            const users = {
                name,
                lastName,
                email,
                last_conection,
                conection
            };
            await modelUsers.create(users)
        }
        catch (error) {
            logger.error('Error al intentar escribir el archivo', error)
        }

    }
    static async updatePassword(email, password, verifyPassword) {
        try {
            const user = await modelUsers.find({ email: email });
            const userPassword = user.map(user => user.password);
            isValidPassword(password, userPassword[0])
            if (!isValidPassword) {
                const passwordHash = createHash(password);
                await modelUsers.updateOne({ email: email }, { $set: { password: passwordHash } });
                logger.info('Contraseña cambiada con exito');
            } else {
                logger.warn('Las contraseñas no son iguales o es igual a la anterior');
            }
        } catch (err) {
            logger.error('Existe un error al intentar cambiar la contraseña')
        }
    }
    static async updateUsers(_id, role, uploadedFiles) {
        try {
            if (role === 'premium') {
                uploadedFiles.map(async files => {
                    if (files.originalName !== 'Identificacion.pdf' && files.originalName !== 'Comprobante de domicilio.pdf' && files.originalName !== 'Comprobante de estado de cuenta.pdf') {
                        logger.error(`El nombre del archivo ${files.originalName} es incorrecto, por favor corrigelo`);
                        const user = await modelUsers.updateOne({ _id: _id }, { $set: { role: role } });
                        return user;
                    }
                });
                const updateResult = await modelUsers.updateOne(
                    { _id: _id },
                    {
                        $set: { role: role }, // Actualiza el rol
                        $push: {
                            documents: {
                                $each: uploadedFiles.map(({ originalName, cloudinaryPath }) => ({
                                    name: originalName,
                                    reference: cloudinaryPath
                                }))
                            }
                        }
                    }
                );
                return updateResult;
            } else {
                const user = await modelUsers.updateOne({ _id: _id }, { $set: { role: role } });
                return user;
            }
        } catch (err) {
            logger.error('Existe un error al actualizar el role del usuario')
        }
    }

}
export { ManagerLoginGoogle }