import passport from "passport";
import { Router } from "express";
import { config } from "../../controllers/config/config.js";
import { createToken, verifyToken } from "../../services/utils/jwtUtil.js";
import { verifyRequiredBody, adminAuth } from "../../controllers/middleWars/middleSession.js";
import { ManagerLogin } from "../../controllers/dao/manager/managerLogin.mdb.js";
import { createHash, isValidPassword } from "../../services/utils/bycript.js";
import { initAuthStrategies } from "../../auth/passport.strategies.js";
const jwtRouter = Router()
initAuthStrategies()
jwtRouter.get('/users', async (req, res) => {
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
jwtRouter.post('/register', verifyRequiredBody(['name', 'lastName', 'email', 'password']), async (req, res) => {
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
jwtRouter.post('/jwtlogin', verifyRequiredBody(['email', 'password']), passport.authenticate('login', { failureRedirect: `/login?error=${encodeURI('Usuario o clave no válidos')}` }), async (req, res) => {
    try {
        const token = createToken(req.user, '1h');
        res.cookie(`${config.APP_NAME}_cookie`, token, { maxAge: 60 * 60 * 1000, httpOnly: true });
        const { email, password } = req.body;
        const foundUser = await ManagerLogin.getOne({ email: email });
        if (foundUser && isValidPassword(password, foundUser.password)) {
            res.redirect('/api/auth/jwtAuth');
        } else {
            res.status(401).send({ origin: config.PORT, payload: 'Datos de acceso no válidos' });
        }

    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
});
jwtRouter.get('/jwtAuth', verifyToken, passport.authenticate('jwtlogin', { failureRedirect: `/login?error=${encodeURI('Usuario o clave no válidos')}` }), async (req, res) => {
    try {
        req.session.user = req.user;
        console.log(req.user)
        req.session.save(err => {
            if (err) return res.status(500).send({ origin: config.PORT, payload: null, error: err.message });

            res.redirect('/profile');
        });
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
});
jwtRouter.get('/private', adminAuth, async (req, res) => {
    try {
        res.status(200).send({ origin: config.PORT, payload: 'Bienvenido ADMIN!' });
    } catch (err) {
        res.status(500).send({ origin: config.PORT, payload: null, error: err.message });
    }
});

jwtRouter.get('/logout', async (req, res) => {
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

export { jwtRouter }