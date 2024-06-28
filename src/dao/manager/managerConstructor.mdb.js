import { modelProducts } from "../models/products.model.js";

class CollectionManagerConstructor {
    constructor() {
        this.products = [];
    }

    async getProducts(limit) {
        try {
            const products = await modelProducts.find();
            this.products = products;
            return limit ? (limit === 0 ? products : products.slice(0, limit)) : products;
        } catch (error) {
            console.error('Error al leer el archivo', error);
        }
    }

    async addProduct(title, description, price, category, thumbnail, code, stock) {
        try {
            if (this.products.some(product => product.code === code)) {
                console.error(`El código de tu producto se encuentra en uso`);
                return;
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
            await modelProducts.create(product);
        } catch (error) {
            console.error('Error al intentar escribir el archivo', error);
        }
    }

    async getProductById(id) {
        try {
            const product = await modelProducts.findById(id);
            if (!product) {
                console.error('Producto no encontrado');
            }
            return product;
        } catch (error) {
            console.error('Error al buscar el producto por ID', error);
        }
    }

    async updateProduct(id, update) {
        try {
            const options = { new: true };
            const process = await modelProducts.findByIdAndUpdate(id, update, options);
            return process;
        } catch (error) {
            console.error('Existe un error al intentar actualizar el archivo', error);
        }
    }

    async deleteProductById(id) {
        try {
            const process = await modelProducts.findByIdAndDelete(id);
            return process;
        } catch (error) {
            console.error('Existe un error al intentar eliminar el elemento del archivo', error);
        }
    }

    async sortProducts(sort) {
        try {
            const order = sort === 0 ? -1 : 1;
            const products = await modelProducts.aggregate([
                { $sort: { _id: order } }
            ]);
            return products;
        } catch (err) {
            console.error('Error en el servidor', err);
        }
    }
}

export { CollectionManager };
