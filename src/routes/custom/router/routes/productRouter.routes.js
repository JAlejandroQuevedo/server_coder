import { CustomRouter } from "../routesClass/custom.router.js";
import { CollectionManager } from '../../../../controllers/dao/manager/manager.mdb.js';
export class ProductRouter extends CustomRouter {
    init() {
        this.get('/productRouter', async (req, res) => {
            try {    //NOTA: Si agregas el query despues del /products sin query, te arroja todos los productos aunque el codigo este correcto
                const limit = +req.query.limit || 0;
                const allProducts = await CollectionManager.getProducts();
                if (limit <= allProducts.length) {
                    const products = await CollectionManager.getProducts(limit);
                    res.sendSuccess({
                        status: 1,
                        payload: products
                    })
                    const product = await CollectionManager.getProducts();
                    socketServer.emit('products', product);
                } else {
                    res.sendUserError('Lo siento, no contamos con la cantidad de productos solicitada');
                }
            }
            catch (err) {
                if (!res.headersSent) {
                    res.sendServerError(err);
                }
            }
        })
    }
}