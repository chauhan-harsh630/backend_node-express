import express from 'express';
import {
    addToCart,
    getCart
} from '../controller/cart.controller.js';

const route = express.Router();

route.post('/add', addToCart);
route.get('/:userId', getCart);

export default route;