import { modelUsersCurrent } from '../models/user_current.model.js';
import { ColectionManagerCart } from './managerCart.mdb.js';

class ManagerCurrent {

    static adminAuth = (req, res, next) => {

        if (req.session.user?.role !== 'admin')
            return res.status(401).send({ origin: config.SERVER, payload: 'Acceso no autorizado: se requiere autenticación y nivel de admin' });

        next();
    }
    static async getUsers() {
        try {
            const users = await modelUsersCurrent.find()
            return users;
        }
        catch (error) {
            console.error('Error al leer el archivo', error)
        }
    }
    static async getOne(fiter) {
        try {
            const user = await modelUsersCurrent.findOne(fiter);
            return user;
        }
        catch (err) {
            console.error('Error al obtener el usuario', err)
        }
    }
    static async addUser(first_name, last_name, email, password, age) {
        try {
            const cartId = await ColectionManagerCart.getProductCartById('665a7e6486561373ea05348c');
            console.log('Ejecutadndo')
            const users = {
                first_name,
                last_name,
                email,
                age,
                password,
                cartId
            };
            await modelUsersCurrent.create(users)
        }
        catch (error) {
            console.error('Error al intentar escribir el archivo', error)
        }

    }
}


export { ManagerCurrent }