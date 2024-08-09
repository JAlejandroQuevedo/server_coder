// import modelProducts from "../factory/dao.factory.js";
import { modelProducts } from "../models/products.model.js";
import { logger } from "../../../services/log/logger.js";

// const modelProducts = new ProductsService()

class CollectionManager {

    static products = [];

    static async getProducts(limit) {
        try {
            if (limit) {
                const products = await modelProducts.find();
                this.products = products;
                return limit === 0 ? products : products.slice(0, limit);
            } else {
                const products = await modelProducts.find();
                // req
                return products;

            }
        }
        catch (error) {
            console.error('Error al leer el archivo', error)
        }
    }
    static async addProduct(title, description, price, category, thumbnail, code, stock, owner) {
        try {
            const products = await modelProducts.find()
            if (products.some(product => product.code === code)) return console.error(`El codigo de tu producto se encuentra en uso`)
            const product = {
                title: title,
                description: description,
                price: price,
                status: true,
                category: category,
                thumbnail: thumbnail,
                code: code,
                stock: stock,
                owner: `${owner}`
            };
            await modelProducts.create(product)
        }
        catch (error) {
            console.error('Error al intentar escribir el archivo', error)
        }

    }
    static async getProductById(id) {
        const products = await modelProducts.findById(id);
        if (!products) {
            console.error('Producto no encontrado')
        }
        return products;
    }

    static async updateProduct(id, update) {
        try {
            const filter = id;
            const updateOne = update;
            const options = { new: true }
            const process = await modelProducts.findByIdAndUpdate(filter, updateOne, options)
            return process;
        }
        catch (error) {
            console.error('Existe un error al intentar actualizar el archivo', error)
        }
    }

    static async deleteProductById(id, _userId, _userRole) {
        try {
            if (_userRole === 'admin') {
                const filter = id;
                const process = await modelProducts.findOneAndDelete(filter);
                return process;
            } else if (_userRole === 'premium') {
                const filter = { _id: id, owner: _userId };
                const process = await modelProducts.findOneAndDelete(filter);
                return process;
            } else {
                logger.warn("No cuentas con permisos para eliminar este producto")
            }
        }
        catch (error) {
            console.error('Existe un error al intentar eliminar el elemento del archivo', error(error))
        }
    }
    static async sortProducts(sort) {
        try {
            if (sort === 0) {
                const products = await modelProducts.aggregate([
                    { $sort: { _id: -1 } }
                ])
                return products
            } else if (sort === 1) {
                const products = await modelProducts.aggregate([
                    { $sort: { _id: 1 } }
                ])
                return products
            }
        }
        catch (err) {
            console.error('Error en el servidor', err)
        }
    }


}

export { CollectionManager };