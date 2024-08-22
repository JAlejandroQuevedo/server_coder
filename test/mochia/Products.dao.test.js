import { expect } from 'chai';
import sinon from 'sinon';
import mongoose from 'mongoose';
import { CollectionManager } from '../../src/controllers/dao/manager/manager.mdb.js';
import { modelProducts } from '../../src/controllers/dao/models/products.model.js';


describe('Test DAO CollectionManager', () => {
    let findStub, createStub, findByIdStub, findByIdAndUpdateStub, findOneAndDeleteStub, aggregateStub;

    before(() => {
        // Stub de los métodos de Mongoose para evitar interacciones reales con la base de datos
        findStub = sinon.stub(modelProducts, 'find').resolves([]);
        createStub = sinon.stub(modelProducts, 'create').resolves({ _id: 'fakeId', ...testProduct });
        findByIdStub = sinon.stub(modelProducts, 'findById').resolves({ _id: 'fakeId', ...testProduct });
        findByIdAndUpdateStub = sinon.stub(modelProducts, 'findByIdAndUpdate').resolves({ _id: 'fakeId', price: '250' });
        findOneAndDeleteStub = sinon.stub(modelProducts, 'findOneAndDelete').resolves({ _id: 'fakeId' });
        aggregateStub = sinon.stub(modelProducts, 'aggregate').resolves([{ title: 'Product 5' }, { title: 'Product 6' }]);
    });

    after(() => {
        // Restaurar los stubs después de todos los tests
        findStub.restore();
        createStub.restore();
        findByIdStub.restore();
        findByIdAndUpdateStub.restore();
        findOneAndDeleteStub.restore();
        aggregateStub.restore();
    });

    const testProduct = {
        title: 'Product 1',
        description: 'Test Description',
        price: '100', // Asegúrate de que los valores sean cadenas
        category: 'Test Category',
        thumbnail: 'test.jpg',
        code: 'test001',
        stock: '10', // Asegúrate de que los valores sean cadenas si los usas como cadenas en el modelo
        owner: 'ownerId'
    };

    it('getProducts() debe retornar un array de productos', async () => {
        const result = await CollectionManager.getProducts(0);
        expect(result).to.be.an('array');
    });

    it('addProduct() debe agregar un nuevo producto y retornar el producto agregado', async () => {
        // Configurar el stub para simular que no hay productos con el mismo código
        findStub.resolves([]);
        createStub.resolves({ _id: 'fakeId', ...testProduct });

        await CollectionManager.addProduct(
            testProduct.title,
            testProduct.description,
            testProduct.price,
            testProduct.category,
            testProduct.thumbnail,
            testProduct.code,
            testProduct.stock,
            testProduct.owner
        );

        // Verificar que el método `create` fue llamado con el producto correcto
        expect(createStub.calledOnce).to.be.true;
        expect(createStub.firstCall.args[0]).to.deep.equal({
            title: testProduct.title,
            description: testProduct.description,
            price: testProduct.price,
            status: true,
            category: testProduct.category,
            thumbnail: testProduct.thumbnail,
            code: testProduct.code,
            stock: testProduct.stock,
            owner: testProduct.owner
        });
    });

    it('getProductById() debe retornar un producto por su ID', async () => {
        const result = await CollectionManager.getProductById('fakeId');
        expect(result._id.toString()).to.be.equal('fakeId');
        expect(result.title).to.be.equal(testProduct.title);
    });

    it('updateProduct() debe retornar un objeto con los datos modificados', async () => {
        const modifiedPrice = '250'; // Asegúrate de que el precio modificado sea una cadena
        const result = await CollectionManager.updateProduct('fakeId', { price: modifiedPrice });

        expect(result).to.be.an('object');
        expect(result._id).to.be.not.null;
        expect(result.price).to.be.equal(modifiedPrice);
    });


    // it('deleteProductById() debe eliminar un producto por su ID y no debería encontrarlo después', async () => {
    //     await CollectionManager.deleteProductById('fakeId', 'ownerId', 'admin');
    //     const deletedProduct = await modelProducts.findById('fakeId');

    //     // Verificar que el producto ha sido eliminado
    //     expect(deletedProduct).to.be.null;
    // });

    it('sortProducts() debe retornar productos ordenados', async () => {
        const result = await CollectionManager.sortProducts(1);
        expect(result[0].title).to.be.equal('Product 5');
        expect(result[1].title).to.be.equal('Product 6');
    });
});

describe('CollectionManager verificacion de no agregar productos con el codigo en uso', function () {
    let findStub;
    let createStub;

    // Configurar la conexión y los stubs antes de comenzar los tests
    before(async function () {
        // Conectar a la base de datos de MongoDB
        await mongoose.connect('mongodb://127.0.0.1:27017/coder_53160')
        // Stubs para los métodos `find` y `create`
        findStub = sinon.stub(modelProducts, 'find');
        createStub = sinon.stub(modelProducts, 'create');
    });

    // Limpiar después de cada test
    afterEach(function () {
        sinon.restore(); // Restaurar los stubs después de cada test
    });

    // Cerrar la conexión después de todos los tests
    after(async function () {
        await mongoose.connection.close();
    });

    it('addProduct() no debería agregar un producto si el código ya está en uso', async () => {
        // Configurar el stub para simular que ya existe un producto con el mismo código
        findStub.resolves([{ code: '1234' }]); // Simula que ya existe un producto con el código '1234'

        // Llamar al método addProduct
        await CollectionManager.addProduct(
            'Test Product',
            'Test Description',
            '100',
            'Test Category',
            'Test Thumbnail',
            '1234', // Código del producto en uso
            10,
            'Test Owner'
        );

        // Verificar que `create` no fue llamado
        expect(createStub.notCalled).to.be.true;
    });
});
