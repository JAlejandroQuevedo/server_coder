import passport from "passport";
import { config } from "../../controllers/config/config.js";
import { Router } from "express";
import { verifyRequiredBody, adminAuth } from "../../controllers/middleWars/middleSession.js";
import { initAuthStrategies } from "../../auth/passport.strategies.js";
import { ManagerLogin } from "../../controllers/dao/manager/managerLogin.mdb.js";
const sesionPassport = Router()
initAuthStrategies()
sesionPassport.get('/users', async (req, res) => {
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
sesionPassport.post('/pplogin', verifyRequiredBody(['email', 'password']), passport.authenticate('login', { failureRedirect: `/login?error=${encodeURI('Usuario o clave no válidos')}` }), async (req, res) => {
    try {
        req.session.user = req.user;
        req.session.save(err => {
            if (err) return res.status(500).send({ origin: config.PORT, payload: null, error: err.message });

            res.redirect('/profile');
        });
    } catch (err) {
        res.status(500).send({ origin: config.PORT, payload: null, error: err.message });
    }
});
sesionPassport.post('/ppregister', verifyRequiredBody(['name', 'lastName', 'email', 'password']), passport.authenticate('register', { failureRedirect: `/register?error=${encodeURI('Error al crear el usuario')}` }), async (req, res) => {
    try {
        req.session.user = req.user;
        req.session.save(err => {
            if (err) return res.status(500).send({ origin: config.PORT, payload: null, error: err.message });
            res.status(200).send({
                origin: config.PORT,
                payload: 'Usuario creado de manera exitosa'
            })
        });
    } catch (err) {
        res.status(500).send({ origin: config.PORT, payload: null, error: err.message });
    }
});

sesionPassport.get('/ghlogin', passport.authenticate('ghlogin', { scope: ['user'] }), async (req, res) => {
});

sesionPassport.get('/ghlogincallback', passport.authenticate('ghlogin', { failureRedirect: `/login?error=${encodeURI('Error al identificar con Github')}` }), async (req, res) => {
    try {
        req.session.user = req.user;
        req.session.save(err => {
            if (err) return res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });

            res.redirect('/profile');
        });
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
});
sesionPassport.get('/private', adminAuth, async (req, res) => {
    try {
        res.status(200).send({ origin: config.PORT, payload: 'Bienvenido ADMIN!' });
    } catch (err) {
        res.status(500).send({ origin: config.PORT, payload: null, error: err.message });
    }
});

sesionPassport.get('/logout', async (req, res) => {
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

export { sesionPassport }