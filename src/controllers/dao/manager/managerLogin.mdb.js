import { modelUsers } from "../models/users.model.js";
import { logger } from "../../../services/log/logger.js";
import { createHash, isValidPassword } from "../../../services/utils/bycript.js";

class ManagerLogin {

    static adminAuth = (req, res, next) => {

        if (req.session.user?.role !== 'admin')
            return res.status(401).send({ origin: config.SERVER, payload: 'Acceso no autorizado: se requiere autenticación y nivel de admin' });

        next();
    }
    static async getUsers() {
        try {
            const users = await modelUsers.find()
            return users;
        }
        catch (error) {
            console.error('Error al leer el archivo', error)
        }
    }
    static async getOne(fiter) {
        try {
            const user = await modelUsers.findOne(fiter);
            return user;
        }
        catch (err) {
            console.error('Error al obtener el usuario', err)
        }
    }
    static async addUser(name, lastName, email, gender, password) {
        try {
            const users = {
                name,
                lastName,
                email,
                gender,
                password
            };
            await modelUsers.create(users)
        }
        catch (error) {
            console.error('Error al intentar escribir el archivo', error)
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

}
export { ManagerLogin }