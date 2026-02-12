import express from 'express';
import {
    createProduct,
    getAllProduct
} from '../controller/product.controller.js';

const routes = express.Router();

routes.post('/', createProduct);
routes.get('/', getAllProduct);

export default routes