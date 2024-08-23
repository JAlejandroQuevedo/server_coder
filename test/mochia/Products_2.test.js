import Assert from 'assert';
import mongoose from 'mongoose';
import { CollectionManager } from '../../src/controllers/dao/manager/manager.mdb.js';
import { config } from '../../src/controllers/config/config.js';

const connection = await mongoose.connect(config.MONGODB_URI);
let _id;
const dao = CollectionManager
const assert = Assert.strict;
const title = 'This is a title'
const description = 'This is a description'
const price = 'This is a price'
const status = true
const category = 'This is a category'
const thumbnail = 'This.jpg'
const code = 'code'
const stock = 'stock'
const owner = 'Owner'



describe('Test de products elaborado por mi', function () {
    //Se ejecuta antes del test
    before(function () {
        mongoose.connection.collections.products_test.drop();
    })
    //Se ejecuta antes de cada test test

    beforeEach(function () {

    })
    //Se ejecuta despues del test
    after(function () {

    })
    //Se ejecuta despues de cada test
    afterEach(function () {

    })
    //Son los test que se van a realizar
    it('getProducts() debe retornar un array de productos', async function () {
        const result = await dao.getProducts();
        assert.strictEqual(Array.isArray(result), true)
    })
    it('addProduct() debe retornar un objeto de producto', async function () {
        const result = await dao.addProduct(title, description, price, status, category, thumbnail, code, stock, owner); // -> No olvidar cambiar el numero en code
        _id = result._id
        assert.ok(result._id);
        assert.strictEqual(typeof (result), 'object')
    })
    it('getProductById() debe retornar un objeto del producto llamado', async function () {
        const result = await dao.getProductById(_id);
        assert.ok(result._id);
        assert.strictEqual(typeof (result), 'object')
    })
    it('updateProduct() debe retornar un objeto con los datos del producto modificados', async function () {
        const update = {
            title: 'Title 2',
            price: 'Price 2'
        }
        const result = await dao.updateProduct(_id, update);
        assert.ok(result._id);
        assert.strictEqual(typeof (result), 'object')
    })
    it('deleteProductById() debe eliminar un producto', async function () {
        const _userRole = 'admin';
        const _userId = _id;
        const result = await dao.deleteProductById(_id, _userId, _userRole);
        assert.ok(result._id);
        assert.strictEqual(typeof (result), 'object')
    })
    it('sortProducts() debe retorna una objeto de productos', async function () {
        const result = await dao.sortProducts(1);
        assert.strictEqual(typeof (result), 'object')
    })
})