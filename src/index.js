import { config } from "./config/config.js";
import { router } from "./routes/products.routes.js";
import { routerCart } from "./routes/cart.routes.js";
import { routerHandle } from "./routes/views.routes.js";
import { cookieRoute } from "./routes/cookies.routes.js";
import { chatSocket } from "./sockets/chat-socket.js";
import { jwtRouter } from "./routes/auth/jwt.routes.js";
import { current } from "./routes/current/current.routes.js";
import express from 'express'
import handlebars from 'express-handlebars';
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
// import { TestRouter } from "./custom/router/routes/test.routes.js";
import { ProductRouter } from "./custom/router/routes/productRouter.routes.js";
// //Servidor 

const app = express();
let socketServer;
const httpServer = app.listen(config.PORT, async () => {
    // const connObj = {
    //     host: '',
    //     port: 5050,
    //     username: '',
    //     pass: ''
    // }
    await mongoose.connect(config.MONGODB_URI);
    socketServer = chatSocket(httpServer);
    app.set('socketServer', socketServer);

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser(config.SECRET))
    app.use(session({
        store: MongoStore.create({ mongoUrl: config.MONGODB_URI, ttl: 600 }),
        secret: config.SECRET,
        resave: true,
        saveUninitialized: true
    }))


    //Configuracion de handlebars

    app.engine('handlebars', handlebars.engine());
    app.set('views', `${config.DIRNAME}/views`);
    app.set('view engine', 'handlebars');

    //General routes
    app.use('/api', router)
    app.use('/api', routerCart)
    app.use('/api', cookieRoute)
    app.use('/api/auth', jwtRouter)
    app.use('/api/sessions/current', current)

    //Custom routes

    app.use('/api/', new ProductRouter().getRouter())
    //View routes
    app.use('/', routerHandle)
    // app.use('/static', express.static('public'))

    app.use('/static', express.static(`${config.DIRNAME}/public`))
    console.log(`Servidor activo en puerto ${config.PORT} enlazada a bbdd`)
})

export { socketServer }




