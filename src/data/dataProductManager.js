import { ProctManager } from "../productManager/productManager.js";

let product1 = await ProctManager.addProduct('Mi producto', 'Este es un ejemplo de un producto', 129, 'Category', 'IMG Prueba', 12234, 3);
let product3 = await ProctManager.addProduct('Mi producto', 'Este es un ejemplo de un producto', 129, 'Category', 'IMG Prueba', 1223456, 3);
let product4 = await ProctManager.addProduct('Mi producto', 'Este es un ejemplo de un producto', 129, 'Category', 'IMG Prueba', 12234568, 3);
let product5 = await ProctManager.addProduct('Mi producto', 'Este es un ejemplo de un producto', 129, 'Category', 'IMG Prueba', 1223456899, 3);
let product6 = await ProctManager.addProduct('Mi producto', 'Este es un ejemplo de un producto', 129, 'Category', 'IMG Prueba', 12234568991, 3);
let product7 = await ProctManager.addProduct('Mi producto', 'Este es un ejemplo de un producto', 129, 'Category', 'IMG Prueba', 122345689913, 3);
let product8 = await ProctManager.addProduct('Mi producto', 'Este es un ejemplo de un producto', 129, 'Category', 'IMG Prueba', 122345689915, 3);
let product9 = await ProctManager.addProduct('Mi producto', 'Este es un ejemplo de un producto', 129, 'Category', 'IMG Prueba', 122345689912, 3);
let product10 = await ProctManager.addProduct('Mi producto', 'Este es un ejemplo de un producto', 129, 'Category', 'IMG Prueba', 122345689911, 3);
let product11 = await ProctManager.addProduct('Mi producto', 'Este es un ejemplo de un producto', 129, 'Category', 'IMG Prueba', 12234568992123, 3);



const data = await ProctManager.getProducts();
export { data }


