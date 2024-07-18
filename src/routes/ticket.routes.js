import { Router } from "express";
import { ColectionManagerTicket } from "../controllers/dao/manager/ticketManager.mdb.js";
import { config } from "../controllers/config/config.js";
import { socketServer } from "../index.js";


const routerTicket = Router();
routerTicket.get('/tickets', async (req, res) => {
    console.log('ACCESO')
    try {
        const tickets = await ColectionManagerTicket.getTickets();
        res.status(200).send({
            origin: config.PORT,
            tickets: tickets
        })
    }
    catch (err) {
        console.error('Existe un error al obtener los tickets', err)
        res.status(500).json('Error interno del servidor')
    }
})

routerTicket.post('/tickets', async (req, res) => {
    try {
        const _user_id = req.session.user._id
        await ColectionManagerTicket.createTicket(_user_id);
        res.status(200).send('Ticket creado con exito');
        const tickets = await ColectionManagerTicket.getTickets()
        socketServer.emit('tickets', tickets)
    }
    catch (err) {
        console.error('Error al ingresar el ticket del producto', err);
        res.status(500).json('Error interno en el servidor')
    }
})



export { routerTicket }