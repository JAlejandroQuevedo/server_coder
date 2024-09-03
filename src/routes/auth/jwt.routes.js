import passport from "passport";
import { Router } from "express";
import { config } from "../../controllers/config/config.js";
import { createToken, verifyToken } from "../../services/utils/jwtUtil.js";
import { verifyTokenRecovery } from "../../services/utils/jwtUtilRecovery.js";
import { verifyRequiredBodyAuth } from "../../services/utils/verifyRequiredBodyAuth.js";
import { adminAuth } from "../../services/utils/adminAuth.js";
import { ManagerLogin } from "../../controllers/dao/manager/managerLogin.mdb.js";
import { ManagerLoginGoogle } from "../../controllers/dao/manager/managerGogle.mdb.js";
import { createHash, isValidPassword } from "../../services/utils/bycript.js";
import { initAuthStrategies } from "../../auth/passport.strategies.js";
import { sendMail } from "../../services/mail/send.email.js";
const jwtRouter = Router()
initAuthStrategies()
jwtRouter.get('/users', async (req, res) => {
    try {
        const users = await ManagerLogin.getUsers();
        res.status(200).send({
            origin: config.PORT,
            users: users
        })
        req.logger.info('Usuarios obtenidos de manera exitosa');
    }
    catch (err) {
        req.logger.error('Existe un error al obtener los usuarios', err);
    }
})
jwtRouter.post('/register', verifyRequiredBodyAuth(['name', 'lastName', 'email', 'password']), async (req, res) => {
    try {
        const { name, lastName, email, gender, password } = req.body;
        const foundUser = await ManagerLogin.getOne({ email: email });
        const foundUserGoogle = await ManagerLoginGoogle.getOne({ email: email })
        if (!foundUser && !foundUserGoogle) {
            const passwordHash = createHash(password);
            await ManagerLogin.addUser(name, lastName, email, gender, passwordHash);
            res.status(200).send({
                origin: config.PORT,
                payload: 'Usuario creado de manera exitosa'
            })
            req.logger.info('Usuario creado de manera exitosa');
        }
        res.status(500).send({
            origin: config.PORT,
            payload: 'El email ya está registrado'
        })
        req.logger.warn('El email ya está registrado');
    }
    catch (err) {
        req.logger.error('Existe un error al crear el usuario', err);
        res.status(500).send('Error interno del servidor')

    }

});
jwtRouter.post('/jwtlogin', verifyRequiredBodyAuth(['email', 'password']), passport.authenticate('login', { failureRedirect: `/login?error=${encodeURI('Usuario o clave no válidos')}` }), async (req, res) => {
    try {
        const { email, password } = req.body;
        const foundUser = await ManagerLogin.getOne({ email: email });
        if (!foundUser && !isValidPassword(password, foundUser.password)) return res.status(401).send({ origin: config.PORT, payload: 'Datos de acceso no válidos' });
        const token = createToken(req.user, '1h');
        res.cookie(`${config.APP_NAME}_cookie`, token, { maxAge: 60 * 60 * 1000, httpOnly: true });
        res.redirect('/api/auth/jwtAuth');
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
        req.logger.error({ origin: config.SERVER, payload: null, error: err.message });
    }
});

jwtRouter.get('/jwtAuth', verifyToken, passport.authenticate('jwtlogin', { failureRedirect: `/login?error=${encodeURI('Usuario o clave no válidos')}` }), async (req, res) => {
    try {
        req.session.user = req.user;
        req.session.save(err => {
            if (err) return res.status(500).send({ origin: config.PORT, payload: null, error: err.message });
            res.redirect('/profile');
        });
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
        req.logger.error({ origin: config.SERVER, payload: null, error: err.message });
    }
});
jwtRouter.get('/private', adminAuth, async (req, res) => {
    try {
        res.status(200).send({ origin: config.PORT, payload: 'Bienvenido ADMIN!' });
    } catch (err) {
        res.status(500).send({ origin: config.PORT, payload: null, error: err.message });
        req.logger.error({ origin: config.SERVER, payload: null, error: err.message });
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
        req.logger.error({ origin: config.SERVER, payload: null, error: err.message });
    }
});
jwtRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
jwtRouter.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        req.session.user = req.user;
        req.session.save(err => {
            if (err) {
                return res.status(500).send({ origin: config.PORT, payload: null, error: err.message })
            }
            res.redirect('/profile');
        });
    }

);
jwtRouter.post('/recovery', verifyRequiredBodyAuth(['email']), async (req, res) => {
    try {
        const { email } = req.body;
        const foundUser = await ManagerLogin.getOne({ email: email });
        if (!foundUser) {
            return res.status(401).send({ origin: config.PORT, payload: 'El usuario no está registrado' });
        }
        const userPayload = foundUser.toObject ? foundUser.toObject() : foundUser;
        const token = createToken({ email: userPayload.email }, '1h');
        const recoveryLink = `${config.BASE_URL}/api/auth/emailAuth?access_token=${token}`;
        await sendMail(
            'Recuperación de contraseña',
            email,
            'Por favor haz click en el siguiente enlace para recuperar tu contraseña',
            `<h3>Haz click para recuperar la contraseña</h3>
            <a href="${recoveryLink}">Haz click aquí para recuperar tu contraseña</a>`
        );

        req.logger.info('Email de recuperación enviado');
        res.status(200).send({ origin: config.PORT, payload: 'El email de recuperación ha sido enviado' });

    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
        req.logger.error({ origin: config.SERVER, payload: null, error: err.message });
    }
});

jwtRouter.get('/emailAuth', verifyTokenRecovery, async (req, res) => {
    try {
        req.session.email = req.user.email;
        req.session.save(err => {
            if (err) return res.status(500).send({ origin: config.PORT, payload: null, error: err.message });
            res.redirect('/reset_password');
        });
        req.logger.info('Token de recuperación verificado');
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
        req.logger.error({ origin: config.SERVER, payload: null, error: err.message });
    }
});

jwtRouter.post('/resetPassword', verifyRequiredBodyAuth(['password', 'confirmPassword']), async (req, res) => {
    try {
        const { password, confirmPassword } = req.body;
        if (password === confirmPassword) {
            const email = req.session.email;
            const foundUser = await ManagerLogin.getOne({ email: email });
            isValidPassword(password, foundUser.password)
            if (!isValidPassword) {
                ManagerLogin.updatePassword(email, password, confirmPassword);
                req.logger.info('Contraseña cambiada con exito');
                res.status(200).send({ origin: config.PORT, payload: 'Contraseña cambiada con exito' });
            } else {
                req.logger.warn('La contraseña es igual a la anterior');
                res.status(200).send({ origin: config.PORT, payload: 'La contraseña es igual a la anterior' });
            }
        } else {
            req.logger.warn('Las contraseñas no son iguales');
            res.status(200).send({ origin: config.PORT, payload: 'Las contraseñas no son iguales' });
        }

    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
        req.logger.error({ origin: config.SERVER, payload: null, error: err.message });
    }
});


export { jwtRouter }