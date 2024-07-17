import fs from 'fs';

class ProctManagerFind {
    static counter = 0;

    static products = [];

    static path = './productsFind.json'

    static getProducts() {
        if (this.products.length === 0) {
            fs.writeFileSync(this.path, '[]')
        }
        const recovered = fs.readFileSync(this.path, 'utf8');
        const dataParse = JSON.parse(recovered)
        return dataParse;
    }
    static addProduct(title, description, price, thumbnail, code, stock) {
        if (this.products.some(product => product.code === code)) {
            console.error(`El codigo de tu producto se encuentra en uso`)
        }
        ProctManagerFind.counter++;
        const id = ProctManagerFind.counter;
        const product = {
            id,
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        };
        this.products.push(product);
        const data = this.products;
        console.log(data)
        const dataStringifly = JSON.stringify(data);
        console.log(dataStringifly)
        fs.writeFileSync(this.path, dataStringifly)

    }
    static getProductById(id) {

        const recovered = fs.readFileSync(this.path, 'utf8');
        const dataParse = JSON.parse(recovered)
        const product = dataParse.find(product => product.id === id);
        if (!product) {
            console.error('Producto no encontrado')
        }
        return product;
    }

    static updateProduct(id, update) {
        const index = this.products.findIndex(product => product.id === id)
        if (index !== -1) {
            if (update.id) {
                this.products.forEach(products => {
                    update.id = products.id;
                    console.log('¡No puedes modificar el id!')
                })
            }
            this.products[index] = { ...this.products[index], ...update }
        } else {
            console.log('El producto no existe, por favor agrega un id existente')
        }
        const data = JSON.stringify(this.products)
        fs.writeFileSync(this.path, data)
    }

    static deleteProductById(id) {
        const foundProduct = this.products.find(product => product.id === id)
        if (foundProduct) {
            const index = this.products.indexOf(foundProduct)
            this.products.splice(index, 1)
            let counter = 0;
            //console.log(ProctManager.counter)
            this.products.forEach(product => {
                counter++
                product.id = counter;
            })
            let data = JSON.stringify(this.products);
            fs.writeFileSync(this.path, data)
            //console.log(this.products)
        } else {
            console.log('El producto que deseas eliminar no existe')
        }
    }
}

// ProctManagerFind.addProduct()

export { ProctManagerFind }

