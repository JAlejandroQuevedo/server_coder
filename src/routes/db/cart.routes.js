import { Router } from "express";
import { modelCart } from "../../controllers/dao/models/cart.model.js";
import { ColectionManagerCart } from "../../controllers/dao/manager/managerCart.mdb.js";
import { socketServer } from "../../index.js";
import { handlePolicies } from "../../services/utils/policies.js";
import { verifyMongoDBId } from "../../services/utils/verify_mongo_id.js";


const routerCart = Router()
routerCart.get('/carts/sort/:sort', async (req, res) => {
    try {
        const { sort } = req.params;
        const numberSort = +sort
        const products = await ColectionManagerCart.sortProducts(numberSort)
        res.send({
            status: 1,
            products
        })
    }
    catch (err) {
        res.status(500).send('Error en el servidor', err)
    }
})
routerCart.get('/carts', async (req, res) => {
    try {
        const limit = +req.query.limit || 0;
        if (limit <= modelCart.length) {
            const _user_id = req.session.user._id;
            const cart = await ColectionManagerCart.getUserCart(_user_id, limit);
            res.send({
                status: 1,
                cart
            })
            const publicCart = await ColectionManagerCart.getUserCart()
            socketServer.emit('productsCart', publicCart);
            req.logger.info('Productos del carrito obtenidos de manera exitosa');
        } else {
            req.logger.error('Lo siento, no contamos con la cantidad de productos solicitada');
            res.status(400).json('Lo siento, no contamos con la cantidad de productos solicitada');
        }
    } catch (err) {
        req.logger.error('Hubo un error al obtener los pruductos:', err);
        res.status(500).send('Error interno del servidor')
    }
})
routerCart.get('/historial/:_uid', handlePolicies(['admin']), async (req, res) => {
    try {
        const limit = +req.query.limit || 0;
        const { _uid } = req.params;

        if (limit <= modelCart.length) {
            const historial = await ColectionManagerCart.getHistorial(_uid, limit);
            res.send({
                status: 1,
                historial
            })
            const historialCart = await ColectionManagerCart.getHistorial();
            socketServer.emit('historialCart', historialCart);
            req.logger.info('Historial obtenido de manera exitosa');
        } else {
            res.status(400).json({
                status: 0,
                message: 'Lo siento, favor de ingresar la cantidad correcta de datos que se necesitan'
            });
        }
    } catch (err) {
        req.logger.error('Error al obtener el historial del carrito:', err);
        res.status(500).send('Error interno del servidor');
    }
})
routerCart.get('/carts/page/:page', async (req, res) => {
    try {
        const { page } = req.params;
        const product = await modelCart.paginate({}, { page: page });
        res.status(200).send({
            origin: 'server1',
            cart: product
        })
        req.logger.info('Productos del carrito obtenidos de manera exitosa');
    }
    catch (err) {
        req.logger.error('Error al obtener los datos del carrito de la pagina solicitada', err);
        res.status(500).json('Error interno del servidor')
    }
})
routerCart.get('/carts/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await ColectionManagerCart.getProductCartById(id);
        if (!product) {
            req.logger.error('El producto solicitado no existe');
            res.status(404).json('Lo siento, el producto no existe en el carrito')
            return;
        }
        res.status(200).send({
            origin: 'server1',
            cart: product
        })
        req.logger.info('Producto obtenido de manera exitosa');
    }
    catch (err) {
        req.logger.error('Error al cargar el obtener por ID:', err);
        res.status(500).json('Error interno del servidor')
    }
})
routerCart.get('/purchase', async (req, res) => {
    try {
        const _user_id = req.session.user._id;
        await ColectionManagerCart.endPurchase(_user_id);
        res.status(200).send('Compra finalizada con exito');
        const productsCart = await ColectionManagerCart.getProducts();
        socketServer.emit('productsCart', productsCart);
        req.logger.info('Compra finalizada con exito');
    }
    catch (err) {
        req.logger.error('Error al agregar el producto:', err);
        res.status(500).json('Error interno en el servidor')
    }
})
routerCart.post('/carts/:id', handlePolicies(['user', 'premium']), verifyMongoDBId("id"), async (req, res) => {
    try {
        const { id } = req.params
        const _user_id = req.session.user._id;
        await ColectionManagerCart.addToCart(id, _user_id)
        res.status(200).send('Producto agregado con exito al carrito');
        const productsCart = await ColectionManagerCart.getProducts();
        socketServer.emit('productsCart', productsCart);
        req.logger.info('Producto agregado con exito al carrito');
    } catch (err) {
        req.logger.error('Error al agregar el producto:', err);
        res.status(500).json('Error interno en el servidor')
    }
})

routerCart.put('/carts/:id', handlePolicies(['user']), verifyMongoDBId("id"), async (req, res) => {
    try {
        const filter = { _id: req.params.id }
        const update = req.body;
        await ColectionManagerCart.updateProduct(filter, update);
        res.status(200).send('Producto actualizado con exito');
        const productsCart = await ColectionManagerCart.getProducts();
        socketServer.emit('productsCart', productsCart);
        req.logger.info('Producto actualizado con exito');
    } catch (err) {
        req.logger.error('Error al actualizar el producto por ID', err);
        res.status(500).send('Error al interno en el servidor');
    }
})
routerCart.put('/carts/:id/products/:cid', handlePolicies(['user']), verifyMongoDBId('id'), async (req, res) => {
    try {
        const filter = { _id: req.params.id }
        const quantity = +req.params.cid;
        await ColectionManagerCart.updateProductQuantity(filter, quantity);
        res.status(200).send('Cantidad del producto actualizada con exito');
        const productsCart = await ColectionManagerCart.getProducts();
        socketServer.emit('productsCart', productsCart);
        req.logger.info('Cantidad del producto actualizada con exito');
    } catch (err) {
        req.logger.error('Error al actualizar la cantidad del producto: ', err);
        res.status(500).send('Error al interno en el servidor');
    }
}
)

routerCart.delete('/carts/:id', verifyMongoDBId('id'), async (req, res) => {
    try {
        const filter = { _id: req.params.id };
        const filterProducts = { _product_id: req.params.cid }
        await ColectionManagerCart.deleteProductById(filter, filterProducts);
        res.status(200).send('Producto eliminado correctamente');
        const productsCart = await ColectionManagerCart.getProducts();
        socketServer.emit('productsCart', productsCart);
        req.logger.info('Producto eliminado correctamente');
    }
    catch (err) {
        req.logger.error('Lo siento no se pudo eliminar el producto', err);
        res.status(500).send('Error interno del servidor')
    }
})
routerCart.delete('/carts/delete', async (req, res) => {
    try {
        if (req.params.cid) {
            await ColectionManagerCart.deleteAll();
            res.status(200).send('Productos eliminados correctamente, el carrito esta vacio');
            const productsCart = await ColectionManagerCart.getProducts();
            socketServer.emit('productsCart', productsCart);
            req.logger.info('Productos eliminados correctamente');

        } else {
            req.logger.error('Lo siento no se pudieron eliminar los productos');
        }
    }
    catch (err) {
        req.logger.error('Lo siento no se pudieron eliminar los productos', err);
        res.status(500).send('Error interno del servidor');
    }
})
export { routerCart }