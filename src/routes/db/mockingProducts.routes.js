import { Router } from "express";
import { genarateFakeProducts } from "../../services/utils/fakerProducts.js";

const mockingProducts = Router();
const products = await genarateFakeProducts(50);
mockingProducts.get('/mockingproducts', async (req, res) => {
    try {
        res.status(200).send({ status: 'OK', payload: products });

    }
    catch (err) {
        res.status(500).send({ status: 'ERR', data: err.message });
    }
}
)

export { mockingProducts }