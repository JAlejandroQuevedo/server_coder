import fs from 'fs';
import { logger } from '../../../../services/log/logger.js';

class ProctManager {
    static counter = 0;

    static products = [];


    static path = '../../../../public/data/products.json'

    static async getProducts(limit) {
        try {
            if (this.products.length === 0) {
                await fs.promises.writeFile(this.path, '[]');
                const recovered = await fs.promises.readFile(this.path, 'utf8');
                const dataParse = JSON.parse(recovered)
                return dataParse;
            } else if (limit) {
                const products = await fs.promises.readFile(this.path, 'utf-8');
                const parsedProducts = await JSON.parse(products);
                this.products = parsedProducts;
                return limit === 0 ? parsedProducts : parsedProducts.slice(0, limit);
            } else {
                const recovered = await fs.promises.readFile(this.path, 'utf8')
                const parseData = JSON.parse(recovered)
                return parseData;
            }
        }
        catch (error) {
            logger.error('Error al leer el archivo', error);
        }
    }
    static async addProduct(title, description, price, category, thumbnail, code, stock) {
        try {
            if (this.products.some(product => product.code === code)) {
                logger.warn('El codigo de tu producto se encuentra en uso');
                return;
            }
            ProctManager.counter = this.products.length + 1;
            const id = ProctManager.counter;
            const product = {
                id,
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
            let data = JSON.stringify(this.products)
            await fs.promises.writeFile(this.path, data);
            if (this.products.length === 0) {
                await fs.promises.writeFile(this.path, '[]');
            }
        }
        catch (error) {
            logger.error('Error al intentar escribir el archivo', error);
        }

    }
    static async getProductById(id) {
        try {
            const recovered = await fs.promises.readFile(this.path, 'utf8');
            const dataParse = JSON.parse(recovered)
            const product = dataParse.find(product => product.id === id);
            if (!product) {
                logger.warn('Producto no encontrado');
                return null;
            }
            return product;
        }
        catch (error) {
            logger.error('Error al intentar leer el producto por ID', error);
        }
    }

    static async updateProduct(id, update) {
        try {
            const foundProduct = this.products.find(product => product.id === id)
            const index = this.products.indexOf(foundProduct)
            if (index !== -1) {
                if (update.id) {
                    this.products.forEach(products => {
                        update.id = products.id;
                    })
                    logger.warn('No puedes modificar el id, por favor intenta de nuevo');
                    return;
                }
                this.products[index] = { ...this.products[index], ...update }
                logger.info('Archivo modificado con exito');
            } else {
                logger.warn('El producto no existe');
            }
            const data = JSON.stringify(this.products)
            await fs.promises.writeFile(this.path, data)
        }
        catch (error) {
            logger.error('Existe un error al intentar actualizar el archivo', error);
        }
    }

    static async deleteProductById(id) {
        try {
            const foundProduct = this.products.find(product => product.id === id)
            if (foundProduct) {
                const index = this.products.indexOf(foundProduct)
                this.products.splice(index, 1)
                let counter = 0;
                this.products.forEach(product => {
                    counter++
                    product.id = counter;
                })
                let data = JSON.stringify(this.products);
                await fs.promises.writeFile(this.path, data);
                logger.info('Producto eliminado correctamente');
            } else {
                logger.warn('El producto que deseas eliminar no existe');
            }
        }
        catch (error) {
            logger.error('Existe un error al intentar eliminar el elemento del archivo', error);
        }
    }


}
// ProctManager.getProducts()

export { ProctManager }

