import express from 'express';
import { helloRedis } from '../controller/hello.controller.js';

const routes = express.Router();

routes.get('/hello', helloRedis);

export default routes;