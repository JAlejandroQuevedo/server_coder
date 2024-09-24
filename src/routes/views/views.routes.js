import { Router } from "express";
import { handlePolicies } from "../../services/utils/policies.js";
import { CollectionManager } from "../../controllers/dao/manager/manager.mdb.js";
import { ColectionManagerCart } from "../../controllers/dao/manager/managerCart.mdb.js";
import { ManagerLogin } from "../../controllers/dao/manager/managerLogin.mdb.js";
import { ManagerLoginGoogle } from "../../controllers/dao/manager/managerGogle.mdb.js";
import { config } from "../../controllers/config/config.js"


const routerHandle = Router();

routerHandle.get('/product', (req, res) => {
    const user = { firstName: 'Carla' };
    res.render('index', user)
})
routerHandle.get('/cart', async (req, res) => {
    const _user_id = req.session.user._id;
    const cart = await ColectionManagerCart.getUserCart(_user_id);
    res.render('cart.handlebars', { cart })
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
routerHandle.get('/role', async (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    const users = await ManagerLogin.getUsers();
    const usersGoogle = await ManagerLoginGoogle.getUsers();
    res.render('role', { users, usersGoogle, KEY: config.KEY_ROLE });
});
routerHandle.get('/roles', async (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    const users = await ManagerLogin.getUsers();
    const usersGoogle = await ManagerLoginGoogle.getUsers();
    res.render('log', { users, usersGoogle, KEY: config.KEY_ROLE });
});
routerHandle.get('/payments', async (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    const products = await CollectionManager.getProducts();
    res.render('payments', { products });
});


export { routerHandle }