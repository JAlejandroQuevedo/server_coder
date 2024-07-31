import { Router } from "express";
import { ColectionManagerTicket } from "../controllers/dao/manager/ticketManager.mdb.js";
import { config } from "../controllers/config/config.js";
import { socketServer } from "../index.js";


const routerTicket = Router();
routerTicket.get('/tickets', async (req, res) => {
    try {
        const tickets = await ColectionManagerTicket.getTickets();
        res.status(200).send({
            origin: config.PORT,
            tickets: tickets
        })
        req.logger.info('Tickets obtenidos de manera exitosa');
    }
    catch (err) {
        req.logger.error('Hubo un error al obtener los tickes:', err);
        res.status(500).json('Error interno del servidor')
    }
})

routerTicket.post('/tickets', async (req, res) => {
    try {
        const _user_id = req.session.user._id;
        await ColectionManagerTicket.createTicket(_user_id);
        res.status(200).send('Ticket creado con exito');
        const tickets = await ColectionManagerTicket.getTickets();
        socketServer.emit('tickets', tickets);
        req.logger.info('Ticket creado con exito');
    }
    catch (err) {
        req.logger.error('Error al ingresar el ticket del producto:', err);
        res.status(500).json('Error interno en el servidor');
    }
})



export { routerTicket }