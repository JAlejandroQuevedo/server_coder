import passport from "passport";
import { Router } from "express";
import { config } from "../../controllers/config/config.js";
import { createToken, verifyToken } from "../../services/utils/jwtUtil.js";
import { verifyRequiredBody, adminAuth } from "../../controllers/middleWars/middleSession.js";
import { ManagerCurrent } from "../../controllers/dao/manager/currentManager.mdb.js";
import { createHash, isValidPassword } from "../../services/utils/bycript.js";
import { initAuthStrategiesCurrent } from "../../auth/current/passportCurrent.strategies.js";
const current = Router()
initAuthStrategiesCurrent()
current.get('/usersCurrent', async (req, res) => {
    try {
        const users = await ManagerCurrent.getUsers();
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
current.post('/registerCurrent', verifyRequiredBody(['first_name', 'last_name', 'email', 'password', 'age']), async (req, res) => {
    try {
        const { first_name, last_name, email, password, age } = req.body;
        const foundUser = await ManagerCurrent.getOne({ email: email })
        if (!foundUser) {
            const passwordHash = createHash(password);
            await ManagerCurrent.addUser(first_name, last_name, email, passwordHash, age);
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
current.post('/jwtloginCurrent', verifyRequiredBody(['email', 'password']), passport.authenticate('loginCurrent', { failureRedirect: `/login?error=${encodeURI('Usuario o clave no válidos')}` }), async (req, res) => {
    try {
        const token = createToken(req.user, '1h');
        res.cookie(`${config.APP_NAME}_cookie`, token, { maxAge: 60 * 60 * 1000, httpOnly: true });
        const { email, password } = req.body;
        const foundUser = await ManagerCurrent.getOne({ email: email });
        if (foundUser && isValidPassword(password, foundUser.password)) {
            res.redirect('/api/sessions/current/jwtAuthCurrent');
        } else {
            res.status(401).send({ origin: config.PORT, payload: 'Datos de acceso no válidos' });
        }

    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
});
current.get('/jwtAuthCurrent', verifyToken, passport.authenticate('jwtloginCurrent', { failureRedirect: `/login?error=${encodeURI('Usuario o clave no válidos')}` }), async (req, res) => {
    try {
        req.session.user = req.user;
        req.session.save(err => {
            if (err) return res.status(500).send({ origin: config.PORT, payload: null, error: err.message });

            res.redirect('/profileCurrent');
        });
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
});
current.get('/private', adminAuth, async (req, res) => {
    try {
        res.status(200).send({ origin: config.PORT, payload: 'Bienvenido ADMIN!' });
    } catch (err) {
        res.status(500).send({ origin: config.PORT, payload: null, error: err.message });
    }
});

current.get('/logout', async (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) return res.status(500).send({ origin: config.SERVER, payload: 'Error al ejecutar logout', error: err });
            // res.status(200).send({ origin: config.SERVER, payload: 'Usuario desconectado' });
            res.redirect('/loginCurrent');
        });
    } catch (err) {
        res.status(500).send({ origin: config.PORT, payload: null, error: err.message });
    }
});

export { current }