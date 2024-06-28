import { modelProducts } from "../models/products.model.js";


class CollectionManager {

    static products = [];

    static async getProducts(limit) {
        try {
            if (limit) {
                const products = await modelProducts.find();
                this.products = products;
                return limit === 0 ? products : products.slice(0, limit);
            } else {
                const products = await modelProducts.find()
                return products;
            }
        }
        catch (error) {
            console.error('Error al leer el archivo', error)
        }
    }
    static async addProduct(title, description, price, category, thumbnail, code, stock) {
        try {
            if (this.products.some(product => product.code === code)) {
                console.error(`El codigo de tu producto se encuentra en uso`)
            }
            const product = {
                title,
                description,
                price,
                status: true,
                category,
                thumbnail,
                code,
                stock
            };
            this.products.push(product);
            let data = this.products
            await modelProducts.create(data)
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
            return process
        }
        catch (error) {
            console.error('Existe un error al intentar actualizar el archivo', error)
        }
    }

    static async deleteProductById(id) {
        try {
            const filter = id;
            const process = await modelProducts.findOneAndDelete(filter);
            return process
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