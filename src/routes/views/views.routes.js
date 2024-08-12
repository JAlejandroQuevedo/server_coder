import { Router } from "express";
import { handlePolicies } from "../../services/utils/policies.js";


const routerHandle = Router();

routerHandle.get('/product', (req, res) => {
    const user = { firstName: 'Carla' };
    res.render('index', user)
})
routerHandle.get('/cart', (req, res) => {
    res.render('cart.handlebars', {})
})
routerHandle.get('/chat', handlePolicies(['user']), (req, res) => {
    res.render('chat.handlebars', {})
})
routerHandle.get('/register', (req, res) => {
    res.render('register', {});
});

routerHandle.get('/login', (req, res) => {
    if (req.session.user) return res.redirect('/profile');
    res.render('login', { showError: req.query.error ? true : false, errorMessage: req.query.error });
});

routerHandle.get('/profile', (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    res.render('profile', { user: req.session.user });
});

//Entrega current
routerHandle.get('/registerCurrent', (req, res) => {
    res.render('registerCurrent', {});
});
routerHandle.get('/forgotYourPassword', (req, res) => {
    res.render('forgotYourPassword', {});
});
routerHandle.get('/reset_password', (req, res) => {
    res.render('reset_password', {});
});

routerHandle.get('/loginCurrent', (req, res) => {
    if (req.session.user) return res.redirect('/profile');
    res.render('loginCurrent', { showError: req.query.error ? true : false, errorMessage: req.query.error });
});

routerHandle.get('/profileCurrent', (req, res) => {
    if (!req.session.user) return res.redirect('/loginCurrent');
    res.render('profileCurrent', { user: req.session.user });
});


export { routerHandle }