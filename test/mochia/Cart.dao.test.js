import { expect } from 'chai';
import sinon from 'sinon';
import mongoose from 'mongoose';
import { ColectionManagerCart } from '../../src/controllers/dao/manager/managerCart.mdb.js';
import { modelCart } from '../../src/controllers/dao/models/cart.model.js';
import { modelProducts } from '../../src/controllers/dao/models/products.model.js';
import { cartHistorial } from '../../src/controllers/dao/models/cart_historial.model.js';
import { modelUsers } from '../../src/controllers/dao/models/users.model.js';

describe('Test DAO ColectionManagerCart', () => {
    let findStub, createStub, findByIdStub, findByIdAndUpdateStub, findOneAndDeleteStub, aggregateStub, findOneAndUpdateStub;

    before(async () => {
        // Conectar a la base de datos en memoria o a una base de datos de prueba
        await mongoose.connect('mongodb://127.0.0.1:27017/coder_53160');

        // Crear stubs para los métodos de Mongoose
        findStub = sinon.stub(modelCart, 'find').resolves([]);
        createStub = sinon.stub(modelCart, 'create').resolves({ _id: 'fakeId', ...testCartProduct });
        findByIdStub = sinon.stub(modelCart, 'findById').resolves({ _id: 'fakeId', ...testCartProduct });
        aggregateStub = sinon.stub(modelCart, 'aggregate').resolves([{ title: 'Product 5' }, { title: 'Product 6' }]);

        sinon.stub(modelProducts, 'findById').resolves({ _id: 'productId', title: 'Product 1', price: '100', stock: '10', owner: 'ownerId' });
        sinon.stub(modelUsers, 'findById').resolves({ email: 'user@example.com' });
        sinon.stub(cartHistorial, 'create').resolves();
    });

    after(async () => {
        // Restaurar los stubs y cerrar la conexión con la base de datos
        sinon.restore();
        await mongoose.connection.close();
    });

    const testCartProduct = {
        _product_id: 'productId',
        _user_id: 'userId',
        title: 'Product 1',
        price: '100',
        thumbnail: 'test.jpg',
        stock: 10,
        quantity: 1
    };

    it('getUserCart() debe retornar un array de productos del carrito del usuario', async () => {
        findStub.resolves([testCartProduct]);

        const result = await ColectionManagerCart.getUserCart('userId', 10);
        expect(result).to.be.an('array');
        expect(result[0]._product_id).to.equal('productId');
    });

    it('getProducts() debe retornar un array de todos los productos del carrito', async () => {
        findStub.resolves([testCartProduct]);

        const result = await ColectionManagerCart.getProducts();
        expect(result).to.be.an('array');
        expect(result[0]._product_id).to.equal('productId');
    });



    it('getProductCartById() debe retornar un producto del carrito por su ID', async () => {
        const result = await ColectionManagerCart.getProductCartById('fakeId');
        expect(result).to.be.an('object');
        expect(result._product_id).to.equal('productId');
    });

    it('loadCartFromDataBase() debe cargar todos los productos del carrito', async () => {
        findStub.resolves([testCartProduct]);
        await ColectionManagerCart.loadCartFromDataBase();
        expect(ColectionManagerCart.cart).to.deep.equal([testCartProduct]);
    });

    it('sortProducts() debe retornar productos ordenados según el criterio', async () => {
        const result = await ColectionManagerCart.sortProducts(1);
        expect(result).to.be.an('array');
        expect(result[0].title).to.equal('Product 5');
        expect(result[1].title).to.equal('Product 6');
    });
});
