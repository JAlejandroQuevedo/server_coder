import fs from 'fs';
import { data } from '../../../../public/data/dataProductManager.js';
import { logger } from '../../../../services/log/logger.js';


class ProductCart {
    static cart = [];
    static pathCart = '../../../../public/data/productCart.json';
    static dataCart = data;

    static async getProducts(limit) {
        try {
            if (this.dataCart.length === 0) {
                await fs.promises.writeFile(this.pathCart, '[]');
                const recovered = await fs.promises.readFile(this.path, 'utf8');
                const dataParse = JSON.parse(recovered)
                return dataParse;
            } else if (limit) {
                const products = await fs.promises.readFile(this.pathCart, 'utf-8');
                const parsedProducts = await JSON.parse(products);
                this.dataCart = parsedProducts;
                return limit === 0 ? parsedProducts : parsedProducts.slice(0, limit);
            } else {
                const recovered = await fs.promises.readFile(this.pathCart, 'utf8')
                const parseData = JSON.parse(recovered)
                return parseData;
            }
        }
        catch (error) {
            logger.error('Error al leer el archivo', error);
        }
    }
    static async getProductCartById(id) {
        try {

            const recovered = await fs.promises.readFile(this.pathCart, 'utf8');
            const dataParse = JSON.parse(recovered)
            const product = dataParse.find(product => product.id === id);
            if (!product) {
                logger.warn('Producto no encontrado');
            }
            return product;
        }
        catch (error) {
            logger.error('Error al intentar obtener el producto del carrito por ID', error);
        }
    }
    static async addToCart(id) {
        try {
            const findProduct = this.dataCart.findIndex(productCart => productCart.id === id);
            if (findProduct !== -1) {
                const productAdd = this.dataCart[findProduct];
                const foundProduct = this.cart.findIndex(product => product.id === id);
                if (foundProduct !== -1) {
                    this.cart[foundProduct].quantity++;
                } else {
                    const { id, title, price, thumbnail, stock } = productAdd;
                    const productCart = {
                        id,
                        title,
                        price,
                        thumbnail,
                        stock,
                        quantity: 1

                    }
                    this.cart.push(productCart)
                }
                const data = JSON.stringify(this.cart);
                await fs.promises.writeFile(this.pathCart, data);
            } else {
                logger.info('El producto que deseas agregar no existe');
            }
        } catch (err) {
            logger.error('Existe un error al intentar agregar tu producto al carrito', err)
        }
    }
}
export { ProductCart }