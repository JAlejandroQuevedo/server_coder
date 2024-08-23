import { expect } from 'chai';
import mongoose from 'mongoose';
import { CollectionManager } from '../../src/controllers/dao/manager/manager.mdb.js';

const connection = await mongoose.connect('mongodb+srv://alejandroya24:6UU6PFUUMVOYtOKe@ecomerce.rdduzzd.mongodb.net/Ecommerce');
const dao = CollectionManager
let _id;
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
        expect(result).to.be.an('array')
    })
    it('addProduct() debe retornar un objeto de producto', async function () {
        const result = await dao.addProduct(title, description, price, status, category, thumbnail, `${code}_26`, stock, owner); // -> No olvidar cambiar el numero en code
        _id = result._id
        expect(result._id).to.be.not.null;
        expect(result).to.be.an('object')
    })
    it('getProductById() debe retornar un objeto del producto llamado', async function () {
        const result = await dao.getProductById(_id);
        expect(result._id).to.be.not.null;
        expect(result).to.be.an('object')
    })
    it('updateProduct() debe retornar un objeto con los datos del producto modificados', async function () {
        const update = {
            title: 'Title 2',
            price: 'Price 2'
        }
        const result = await dao.updateProduct(_id, update);
        expect(result._id).to.be.not.null;
        expect(result).to.be.an('object')
    })
    // it('deleteProductById() debe eliminar un producto', async function () {
    //     const _userRole = 'admin';
    //     const _userId = _id;
    //     const result = await dao.deleteProductById(_id, _userId, _userRole);
    //     expect(result._id).to.be.not.null;
    //     expect(result).to.be.an('object');
    // })
    it('sortProducts() debe retorna un array de productos', async function () {
        const result = await dao.sortProducts(1);
        expect(result).to.be.an('array');
    })
})