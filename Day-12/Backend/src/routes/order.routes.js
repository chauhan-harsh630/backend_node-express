import express from 'express';
import  createOrder from '../controller/Order.controller.js'

const routes = express.Router();

routes.post('/', createOrder);

export default routes;