import { modelTicket } from "../models/ticket.model.js";
import { modelCart } from "../models/cart.model.js";
import { modelUsers } from "../models/users.model.js";

class ColectionManagerTicket {
    static tickets = [];
    static data;

    static async getTickets(limit) {
        try {
            if (limit) {
                const tickets = await modelTicket.find()
                this.tickets = tickets;
                return limit === 0 ? products : products.slice(0, limit);
            } else {
                const tickets = await modelTicket.find()
                return tickets;
            }
        }
        catch (error) {
            console.error('Error al leer el archivo', error)
        }
    }
    static async createTicket(cart_id) {
        try {
            const productGet = await modelCart.findById(cart_id);
            const { _user_id } = productGet;
            const userGet = await modelUsers.findById(_user_id);

            if (productGet) {
                const { _id, price, quantity } = productGet;
                const { email } = userGet;
                const amount = +price * quantity;
                const date = new Date();
                const fullDate = date.toLocaleDateString();
                const hour = date.getHours();
                const minutes = date.getMinutes();

                const purchase_datetime = `Fecha: ${fullDate} / Hora: ${hour}:${minutes}`;

                const ticket = {
                    _code: _id,
                    amount,
                    purchase_datetime: purchase_datetime,
                    purchaser: email
                }
                this.tickets.push(ticket)
                await modelTicket.create(ticket);
            }
        } catch (err) {
            console.error('Existe un error al intentar agregar tu producto al carrito', err)
        }
    }

}




export { ColectionManagerTicket }

