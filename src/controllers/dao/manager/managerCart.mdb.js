import { modelCart } from "../models/cart.model.js";
import { modelProducts } from "../models/products.model.js";
import { cartHistorial } from "../models/cart_historial.model.js";
import { modelUsers } from "../models/users.model.js";
import { sendMail } from "../../../services/mail/send.email.js";
import { config } from "../../config/config.js";
import { transport_nodemailer } from "../../../services/utils/nodemailer.js";
import { logger } from "../../../services/log/logger.js";

class ColectionManagerCart {
    static cart = [];
    static data;

    static async getUserCart(_user_id, limit) {
        try {
            if (limit) {
                const products = await modelCart.find({ _user_id: _user_id })
                this.cart = products;
                return limit === 0 ? products : products.slice(0, limit);
            } else {
                const products = await modelCart.find({ _user_id: _user_id })
                return products;
            }
        }
        catch (error) {
            logger.error('Error al leer el archivo', error);
        }
    }
    static async getProducts(_user_id, limit) {
        try {
            if (limit) {
                const products = await modelCart.find({})
                this.cart = products;
                return limit === 0 ? products : products.slice(0, limit);
            } else {
                const products = await modelCart.find()
                return products;
            }
        }
        catch (error) {
            logger.error('Error al leer el archivo', error);
        }
    }
    static async getHistorial(_uid, limit) {
        try {
            if (limit) {
                const products = await cartHistorial.find({ _user_id: _uid });
                this.cart = products;
                return limit === 0 ? products : products.slice(0, limit);
            } else {
                const products = await cartHistorial.find({ _user_id: _uid });
                return products;
            }
        }
        catch (error) {
            logger.error('Error al leer el archivo', error);
        }
    }
    static async endPurchase(_user_id) {
        try {
            const productCart = await modelCart.find({ _user_id: _user_id });
            const user = await modelUsers.findById(_user_id);
            if (productCart.length > 0) {
                const cart = productCart.map(({ _product_id, quantity }) => ({ _product_id, quantity }));
                const products = await Promise.all(cart.map(async (productFind) => {
                    return await modelProducts.findById(productFind._product_id)
                }))
                return await Promise.all(products.map(async ({ stock }) => {
                    cart.map(async ({ _product_id, quantity }) => {
                        if (stock < quantity || quantity > stock) return console.error('El stock es mayor a la cantidad indicada en el carrito, la compra no puede ser procesada');
                        await sendMail(
                            'Confirmacion de compra',
                            user.email,
                            'Confirmacion de compra',
                            `
                                <h1>¡Compra realizada con exito!</h1>
                            `
                        )
                        const newStock = +stock - quantity;
                        await modelProducts.updateOne({ _id: _product_id }, { $set: { stock: `${newStock}` } });
                        await modelCart.findOneAndDelete({ _user_id: _user_id })
                    })
                }));
            } else {
                logger.warn("Usuario no encontrado");
            }
        }
        catch (err) {
            logger.error('Error al intentar terminar con la compra', err.message);
        }
    }
    static async getProductCartById(id) {
        const products = await modelCart.findById(id);
        if (!products) {
            logger.warn('Producto no encontrado');
        }
        return products;
    }
    static async loadCartFromDataBase() {
        try {
            return this.cart = await modelCart.find()
        } catch (error) {
            logger.error('Error al cargar el producto', error);
        }
    }
    static async addToCart(id, _user_id) {
        try {
            const productAdd = await modelProducts.findById(id);
            if (productAdd.owner === _user_id) return logger.warn('No puedes agregar a tu carrito productos que son tuyos')
            const userCartProducts = await modelCart.find({ _user_id: _user_id });
            const productInCart = userCartProducts.find(product => product._product_id.toString() === id);
            if (!productInCart) {
                const { id: productID, title, price, thumbnail, stock } = productAdd;
                const productCart = {
                    _product_id: productID,
                    _user_id: _user_id,
                    title,
                    price,
                    thumbnail,
                    stock,
                    quantity: 1
                }
                this.cart.push(productCart)
                await modelCart.create(productCart);
                await cartHistorial.create(productCart);
            } else {
                const { quantity } = productInCart;
                const newCuantity = quantity + 1;
                await modelCart.updateOne({ _user_id: _user_id, _product_id: id }, { $set: { quantity: newCuantity } });
                await cartHistorial.updateOne({ _user_id: _user_id, _product_id: id }, { $set: { quantity: newCuantity } });
            }
        } catch (err) {
            logger.error('Existe un error al intentar agregar tu producto al carrito', err);
        }
    }
    static async updateProduct(id, update) {
        try {
            const filter = id;
            const updateOne = update;

            const options = { new: true }
            const process = await modelCart.findByIdAndUpdate(filter, updateOne, options)
            return process
        }
        catch (error) {
            logger.error('Existe un error al intentar actualizar el archivo', error);
        }
    }
    static async updateProductQuantity(id, quantity) {
        try {
            const filter = id;
            const update = {
                $set: { 'quantity': quantity }
            };
            const options = { new: true }
            const process = await modelCart.findOneAndUpdate(filter, update, options)
            return process
        }
        catch (error) {
            logger.error('Existe un error al intentar actualizar la cantidad del archivo', error);
        }

    }

    static async deleteProductById(id, cid) {
        try {
            const filter = id;
            const filterProduct = cid;
            const process = await modelCart.findOneAndDelete(filter);
            const processProducts = await modelCart.findByIdAndDelete(filterProduct)
            return process, processProducts
        }
        catch (error) {
            logger.error('Existe un error al intentar eliminar el elemento del archivo', error);
        }
    }
    static async deleteAll() {
        try {
            const process = await modelCart.deleteMany({});
            return process
        }
        catch (error) {
            logger.error('Existe un error al intentar eliminar todos los elementos del carrito', error);
            throw error;
        }
    }

    static async sortProducts(sort) {
        try {
            if (sort === 0) {
                const products = await modelCart.aggregate([
                    { $sort: { _id: -1 } }
                ])
                return products
            } else if (sort === 1) {
                const products = await modelCart.aggregate([
                    { $sort: { _id: 1 } }
                ])
                return products
            }
        }
        catch (err) {
            logger.error('Error en el servidor', err);
        }
    }


}




export { ColectionManagerCart }

