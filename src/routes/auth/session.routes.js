import { Router } from "express";
import { config } from "../../controllers/config/config.js";
import { ManagerLogin } from "../../dao/manager/managerLogin.mdb.js"
import { verifyRequiredBody } from "../../services/utils/verifyRequiredBody.js";
import { adminAuth } from "../../services/utils/adminAuth.js";
import { createHash, isValidPassword } from "../../services/utils/bycript.js";
import { initAuthStrategies } from '../../auth/passport.strategies.js'


const sessionRoute = Router()
initAuthStrategies()
sessionRoute.get('/users', async (req, res) => {
    try {
        const users = await ManagerLogin.getUsers();
        res.status(200).send({
            origin: config.PORT,
            users: users
        })
    }
    catch (err) {
        console.error('Existe un error al obtener los usuarios', err)
        res.status(500).json('Error interno del servidor')
    }
})
sessionRoute.post('/register', verifyRequiredBody(['name', 'lastName', 'email', 'password']), async (req, res) => {
    try {
        const { name, lastName, email, gender, password } = req.body;
        const foundUser = await ManagerLogin.getOne({ email: email })
        if (!foundUser) {
            const passwordHash = createHash(password);
            await ManagerLogin.addUser(name, lastName, email, gender, passwordHash);
            res.status(200).send({
                origin: config.PORT,
                payload: 'Usuario creado de manera exitosa'
            })
        }
    }
    catch (err) {
        console.error('Existe un error al crear el usuario', err)
        res.status(500).json('Error interno del servidor')

    }

});

sessionRoute.post('/login', verifyRequiredBody(['email', 'password']), async (req, res) => {
    try {
        const { email, password } = req.body;
        const foundUser = await ManagerLogin.getOne({ email: email });

        if (foundUser && isValidPassword(password, foundUser.password)) {
            const { name, lastName, email, gender } = foundUser;
            const savedRol = "admin";
            req.session.user = { name: name, lastName: lastName, email: email, gender: gender, role: savedRol };
            req.session.save(err => {
                if (err) return res.status(500).send({ origin: config.PORT, payload: null, error: err.message });
                res.redirect('/profile');
            });
        } else {
            res.status(401).send({ origin: config.PORT, payload: 'Datos de acceso no válidos' });
        }
    } catch (err) {
        res.status(500).send({ origin: config.PORT, payload: null, error: err.message });
    }
});
sessionRoute.get('/private', adminAuth, async (req, res) => {
    try {
        res.status(200).send({ origin: config.PORT, payload: 'Bienvenido ADMIN!' });
    } catch (err) {
        res.status(500).send({ origin: config.PORT, payload: null, error: err.message });
    }
});

sessionRoute.get('/logout', async (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) return res.status(500).send({ origin: config.SERVER, payload: 'Error al ejecutar logout', error: err });
            // res.status(200).send({ origin: config.SERVER, payload: 'Usuario desconectado' });
            res.redirect('/login');
        });
    } catch (err) {
        res.status(500).send({ origin: config.PORT, payload: null, error: err.message });
    }
});


export { sessionRoute }