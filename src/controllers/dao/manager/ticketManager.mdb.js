import { modelTicket } from "../models/ticket.model.js";
import { modelUsers } from "../models/users.model.js";
import { generateCode } from "../../../services/utils/code.js";

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
    static async createTicket(_user_id) {
        try {
            const userGet = await modelUsers.findById(_user_id);
            const productGet = await modelCart.find({ _user_id: _user_id });
            const cart = productGet.map(({ _id, price, quantity }) => ({ _id, price, quantity }));
            const _product_id = productGet.map(({ _product_id }) => ({ _product_id }))
            if (cart.length > 0) {
                const amount = cart.reduce((total, product) => {
                    return total + (product.quantity * +product.price);
                }, 0);
                const { email } = userGet;
                const date = new Date();
                const fullDate = date.toLocaleDateString();
                const hour = date.getHours();
                const min = date.getMinutes();
                let minutes;
                if (min < 10) {
                    minutes = `0${min}`
                } else {
                    minutes = min
                }
                const purchase_datetime = `Fecha: ${fullDate} / Hora: ${hour}:${minutes}`;
                const ticket = {
                    _product_id,
                    _code: `${generateCode()}`,
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

