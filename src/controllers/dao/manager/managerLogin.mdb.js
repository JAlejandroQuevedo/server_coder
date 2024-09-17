import { modelUsers } from "../models/users.model.js";
import { modelUsersGoogle } from "../models/user.google.js";
import { logger } from "../../../services/log/logger.js";
import { createHash, isValidPassword } from "../../../services/utils/bycript.js";
import { dateTime } from "../../../services/utils/dateTime.js";
import { sendMail } from "../../../services/mail/send.email.js";

class ManagerLogin {

    static adminAuth = (req, res, next) => {

        if (req.session.user?.role !== 'admin')
            return res.status(401).send({ origin: config.SERVER, payload: 'Acceso no autorizado: se requiere autenticación y nivel de admin' });

        next();
    }
    static async getUsers() {
        try {
            const users = await modelUsers.find()
            const user_filter = users.map(user => {
                return {
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
    static async addUser(name, lastName, email, gender, password) {

        const last_conection = dateTime();
        const conection = new Date();
        try {
            const users = {
                name,
                lastName,
                email,
                gender,
                password,
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
            const userFind = await modelUsers.find({ _id: _id });

            if (role === 'premium') {
                if (userFind.length !== 0) {
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
                    uploadedFiles.map(async files => {
                        if (files.originalName !== 'Identificacion.pdf' && files.originalName !== 'Comprobante de domicilio.pdf' && files.originalName !== 'Comprobante de estado de cuenta.pdf') {
                            logger.error(`El nombre del archivo ${files.originalName} es incorrecto, por favor corrigelo`);
                            const user = await modelUsersGoogle.updateOne({ _id: _id }, { $set: { role: role } });
                            return user;
                        }
                    });
                    const updateResult = await modelUsersGoogle.updateOne(
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
                }
            } else {
                const user = await modelUsers.updateOne({ _id: _id }, { $set: { role: role } });
                return user;
            }
        } catch (err) {
            logger.error('Existe un error al actualizar el role del usuario')
        }
    }
    static async deleteUsers() {
        try {
            const twoMinutes = 2 * 60 * 1000;
            const thirtyMinutes = 30 * 60 * 1000;
            const oneHour = 1 * 60 * 60 * 1000;
            const twoDays = 2 * 24 * 60 * 60 * 1000;
            const oneMonth = 30 * 24 * 60 * 60 * 1000;
            const now = new Date();

            const timeLimitGoogle = await modelUsersGoogle.find({
                conection: { $lt: new Date(now - twoMinutes) }
            })
            const timeLimit = await modelUsers.find({
                conection: { $lt: new Date(now - twoMinutes) }
            })
            if (timeLimitGoogle.length > 0) {
                for (const user of timeLimitGoogle) {
                    await sendMail(
                        'Alerta',
                        user.email,
                        'Tiempo inactivo permitido excedido, tu cuenta ha sido eliminada',
                        `<h3>Lo sentimos,tu cuenta fue eliminada</h3>
                        <a href="http://localhost:8080/register">Haz click aquí para crear una nueva</a>`
                    );
                    await modelUsersGoogle.deleteMany({ email: user.email })
                }
                logger.warn('La conexion supera el limite permitido en usuarios registrados con google')
            } else {
                logger.info('Tiempo limite correcto')
            }

            if (timeLimit.length > 0) {
                for (const user of timeLimit) {
                    await sendMail(
                        'Alerta',
                        user.email,
                        'Tiempo inactivo permitido excedido, tu cuenta ha sido eliminada',
                        `
                        <h3>Lo sentimos, tu cuenta fue eliminada</h3>
                        <a href="http://localhost:8080/register">Haz click aquí para crear una nueva</a>
                        `
                    );
                    logger.warn('La conexion supera el limite permitido en usuarios registrados de manera manual')
                    await modelUsers.deleteMany({ email: user.email })
                }
            } else {
                logger.info('Tiempo limite correcto')
            }

        } catch (err) {
            logger.error('Existe un error al intentar eliminar usuarios por tiempo')
        }
    }
}
export { ManagerLogin }