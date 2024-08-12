import { Router } from "express";

const cookieRoute = Router()

cookieRoute.get('/cookie', async (req, res) => {
    /* Standard cookies
        req.cookies
        console.log(req.cookies) 
        */
    /* Signed cookies
        req.signedCookies
    */
    try {
        const data = JSON.parse(req.signedCookies['Nombre de la cookie'])
        res.send({ status: 1, payload: data })
        // res.send({ status: 1, payload: JSON.parse(req.signedCookies['Nombre de la cookie']) })

    }
    catch (err) {
        console.error('Existe un error', err);
        res.status(500).json('Existe un error del lado del servidor')
    }

})
cookieRoute.get('/setCookie', async (req, res) => {
    try {
        const user = {
            email: 'nombre_usuario@hotmail.com',
            password: '1234'
        }
        res.cookie('Nombre de la cookie', JSON.stringify(user), { maxAge: 30000, signed: true })
        res.send({ status: 1, payload: "Cookies" })
    }
    catch (err) {
        console.error('Existe un error', err)
        res.status(200).json('Existe un error del lado del servidor')
    }
})

cookieRoute.get('/deletecookie', (req, res) => {
    try {
        res.clearCookie('Nombre de la cookie')
        res.send({ status: 1, payload: "Cookies" })
    }
    catch (err) {
        console.error('Existe un error', err);
        res.status(500).json('Existe un error del lado del servidor')
    }

})


export { cookieRoute }