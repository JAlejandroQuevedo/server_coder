import { Router } from "express";
import { modelCart } from "../controllers/dao/models/cart.model.js";
import { ColectionManagerCart } from "../controllers/dao/manager/managerCart.mdb.js";
import { socketServer } from "../index.js";
import { handlePolicies } from "../services/utils/policies.js";


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
            socketServer.emit('productsCart', publicCart)
        } else {
            res.status(400).json('Lo siento, no contamos con la cantidad de productos solicitada');
        }
    } catch (err) {
        console.error('Error al obtener los productos', err);
        res.status(500).send('Error interno del servidor')
    }
})
routerCart.get('/historial', handlePolicies(['admin']), async (req, res) => {
    try {
        const limit = +req.query.limit || 0;
        if (limit <= modelCart.length) {
            const historial = await ColectionManagerCart.getHistorial(limit);
            res.send({
                status: 1,
                historial
            })
            const historialCart = await ColectionManagerCart.getHistorial();
            socketServer.emit('historialCart', historialCart);
        } else {
            res.status(400).json('Lo siento, no contamos con la cantidad de productos solicitada');
        }
    } catch (err) {
        console.error('Error al obtener los productos', err);
        res.status(500).send('Error interno del servidor')
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
    }
    catch (err) {
        console.error('Error al obtener el carrito en la pagina solicitada', err);
        res.status(500).json('Error interno del servidor')
    }
})
routerCart.get('/carts/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await ColectionManagerCart.getProductCartById(id);
        if (!product) {
            res.status(404).json('Lo siento, el producto no existe en el carrito')
            return;
        }
        res.status(200).send({
            origin: 'server1',
            cart: product
        })
    }
    catch (err) {
        console.error('Error al obtener el producto carrito por _id', err);
        res.status(500).json('Error interno del servidor')
    }
})
routerCart.get('/purchase', async (req, res) => {
    try {
        const _user_id = req.session.user._id;
        await ColectionManagerCart.endPurchase(_user_id);
        res.status(200).send('Compra finalizada con exito');
        const productsCart = await ColectionManagerCart.getProducts();
        socketServer.emit('productsCart', productsCart)
    }
    catch (err) {
        console.error('Error al ingresar el producto, favor de que exista en el total de productoss', err);
        res.status(500).json('Error interno en el servidor')
    }
})
routerCart.post('/carts/:id', handlePolicies(['user']), async (req, res) => {
    try {
        const { id } = req.params
        const _user_id = req.session.user._id;
        await ColectionManagerCart.addToCart(id, _user_id)
        res.status(200).send('Producto agregado con exito al carrito');
        const productsCart = await ColectionManagerCart.getProducts();
        socketServer.emit('productsCart', productsCart)
    } catch (err) {
        console.error('Error al ingresar el producto, favor de que exista en el total de productoss', err);
        res.status(500).json('Error interno en el servidor')
    }
})
routerCart.put('/carts/:id', handlePolicies(['user']), async (req, res) => {
    try {
        const { id } = req.params
        await ColectionManagerCart.addToCart(id)
        res.status(200).send('Producto agregado con exito al carrito');
        const productsCart = await ColectionManagerCart.getProducts();
        socketServer.emit('productsCart', productsCart)
    } catch (err) {
        console.error('Error al ingresar el producto, favor de que exista en el total de productoss', err);
        res.status(500).json('Error interno en el servidor')
    }
})
routerCart.put('/carts/:id', handlePolicies(['user']), async (req, res) => {
    try {
        const filter = { _id: req.params.id }
        const update = req.body;
        await ColectionManagerCart.updateProduct(filter, update);
        res.status(200).send('Producto actualizado con exito');
        const productsCart = await ColectionManagerCart.getProducts();
        socketServer.emit('productsCart', productsCart)
    } catch (err) {
        console.error('Error al actualizar el producto por _id, favor de revisar', err);
        res.status(500).send('Error al interno en el servidor');
    }
})
routerCart.put('/carts/:id/products/:cid', handlePolicies(['user']), async (req, res) => {
    try {
        const filter = { _id: req.params.id }
        const quantity = +req.params.cid;
        await ColectionManagerCart.updateProductQuantity(filter, quantity);
        res.status(200).send('Cantidad del producto actualizada con exito');
        const productsCart = await ColectionManagerCart.getProducts();
        socketServer.emit('productsCart', productsCart)
    } catch (err) {
        console.error('Error al actualizar la cantidad del producto, favor de revisar la solicitud', err);
        res.status(500).send('Error al interno en el servidor');
    }
}
)

routerCart.delete('/carts/:id/products/:cid', async (req, res) => {
    try {
        const filter = { _id: req.params.id };
        const filterProducts = { _product_id: req.params.cid }
        await ColectionManagerCart.deleteProductById(filter, filterProducts);
        res.status(200).send('Producto eliminado correctamente');
        const productsCart = await ColectionManagerCart.getProducts();
        socketServer.emit('productsCart', productsCart)
    }
    catch (err) {
        console.error('Lo siento no se pudo eliminar el producto, favor de revisar _id');
        res.status(500).send('Error interno del servidor')
    }
})
routerCart.delete('/carts/:cid', async (req, res) => {
    try {
        if (req.params.cid) {
            await ColectionManagerCart.deleteAll();
            res.status(200).send('Productos eliminado correctamente, el carrito esta vacio');
            const productsCart = await ColectionManagerCart.getProducts();
            socketServer.emit('productsCart', productsCart)
        } else {
            console.error('Por favor ingresa un valor valido')
        }
    }
    catch (err) {
        console.error('Lo siento no se pudo eliminar el producto, favor de revisar la solicitud');
        res.status(500).send('Error interno del servidor');
        const productsCart = await ColectionManagerCart.getProducts();
        socketServer.emit('productsCart', productsCart)
    }
})
export { routerCart }