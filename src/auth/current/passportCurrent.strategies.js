import passport from 'passport';
import local from 'passport-local';
import jwt from 'passport-jwt';

import { ManagerCurrent } from '../../dao/manager/currentManager.mdb.js';
import { isValidPassword, createHash } from '../../utils/bycript.js';
import { config } from '../../config/config.js';

const localStrategy = local.Strategy;
const jwtStrategy = jwt.Strategy;
const jwtExtractor = jwt.ExtractJwt;
const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) token = req.cookies[`${config.APP_NAME}_cookie`];

    return token;
}

const initAuthStrategiesCurrent = () => {
    passport.use('loginCurrent', new localStrategy(
        { passReqToCallback: true, usernameField: 'email' },
        async (req, username, password, done) => {
            try {
                const foundUser = await ManagerCurrent.getOne({ email: username });

                if (foundUser && isValidPassword(password, foundUser.password)) {
                    const { first_name, last_name, email, age } = foundUser;
                    const savedRol = "admin";
                    const userDoneCurrent = req.session.user = { first_name: first_name, last_name: last_name, email: email, age: age, role: savedRol };
                    return done(null, userDoneCurrent);
                } else {
                    return done(null, false);
                }
            } catch (err) {
                return done(err, false);
            }
        }
    ));

    passport.use('registerCurrent', new localStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        async (req, username, password, done) => {
            try {
                const foundUser = await ManagerCurrent.getOne({ email: username });
                const { name, lastName, email, gender, age } = req.body;
                if (foundUser) {
                    return done(null, false, { message: 'El correo ya está registrado.' });
                }
                const passwordHash = createHash(password);
                const user = await ManagerCurrent.addUser(name, lastName, email, gender, passwordHash, age);

                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }
    ));

    passport.use('jwtloginCurrent', new jwtStrategy(
        {
            // Aquí llamamos al extractor de cookie
            jwtFromRequest: jwtExtractor.fromExtractors([cookieExtractor]),
            secretOrKey: config.SECRET
        },
        async (jwt_payload, done) => {
            try {
                return done(null, jwt_payload);
            } catch (err) {
                return done(err);
            }
        }
    ));

    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((user, done) => {
        done(null, user);
    });

}

export { initAuthStrategiesCurrent }