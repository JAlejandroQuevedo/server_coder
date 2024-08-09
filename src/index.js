import { config } from "./controllers/config/config.js";
import { routerProducts } from "./routes/products.routes.js";
import { routerCart } from "./routes/cart.routes.js";
import { routerHandle } from "./routes/views.routes.js";
import { cookieRoute } from "./routes/cookies.routes.js";
import { chatSocket } from "./services/sockets/chat-socket.js";
import { jwtRouter } from "./routes/auth/jwt.routes.js";
import { ProductRouter } from "./routes/custom/router/routes/productRouter.routes.js";
import { routerTicket } from "./routes/ticket.routes.js";
import { MongoSingleton } from "./services/db/mongo.singleton.js";
import { mockingProducts } from "./routes/mockingProducts.routes.js";
import { loggerTest } from "./routes/logger_test.routes.js";
import { logger } from "./services/log/logger.js";
// import { routereMAIL } from "./routes/orders.routes.js";
import express from 'express'
import handlebars from 'express-handlebars';
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import cors from "cors"
import errorsHandler from "./services/error/errors.handler.js";
import addLogger from "./services/log/logger.js";
//Servidor

const app = express();
let socketServer;
const httpServer = app.listen(config.PORT, async () => {
    // const connObj = {
    //     host: '',
    //     port: 5050,
    //     username: '',
    //     pass: ''
    // }
    MongoSingleton.getInstance();
    socketServer = chatSocket(httpServer);
    app.set('socketServer', socketServer);
    app.use(cors({ origin: '*' }))
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser(config.SECRET));
    app.use(cors({ origin: '*' }))
    app.use(session({
        store: MongoStore.create({ mongoUrl: config.MONGODB_URI, ttl: 600 }),
        secret: config.SECRET,
        resave: true,
        saveUninitialized: true
    }));


    //Configuracion de handlebars

    app.engine('handlebars', handlebars.engine());
    app.set('views', `${config.DIRNAME}/views`);
    app.set('view engine', 'handlebars');

    //General routes
    app.use(addLogger)
    app.use('/api', routerProducts);
    app.use('/api', routerCart);
    app.use('/api', cookieRoute);
    app.use('/api/auth', jwtRouter);
    app.use('/api', routerTicket);
    app.use(mockingProducts);
    app.use(loggerTest);
    // app.use('/api', routereMAIL)

    //Custom routes
    app.use('/api/', new ProductRouter().getRouter());
    //View routes
    app.use('/', routerHandle);
    app.use('/static', express.static('public'))


    app.use('/static', express.static(`${config.DIRNAME}/public`));
    //Manejo de errorers
    app.use(errorsHandler);
    logger.info(`Servidor activo en puerto ${config.PORT} enlazada a bbdd en mode ${config.MODE}`);
})
export { socketServer }

