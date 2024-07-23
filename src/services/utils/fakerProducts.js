import { faker } from '@faker-js/faker';
import { generateCode } from './code.js';
export const genarateFakeProducts = async (qty) => {
    const products = []
    for (let i = 0; i < qty; i++) {
        const title = faker.commerce.productName();
        const description = faker.commerce.productDescription();
        const price = faker.commerce.price();
        const thumbnail = `Oig${i}.jpg`;
        const code = generateCode();
        const stock = 50


        products.push({ title, description, price, thumbnail, code, stock })
    }

    return products
}
