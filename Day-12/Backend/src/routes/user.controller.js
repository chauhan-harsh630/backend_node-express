import express from 'express';
import { creareUser } from '../controller/user.controller.js';
import route from './cart.routes.js';

const routes = express.Router();

routes.post('/', creareUser);

export default routes;
