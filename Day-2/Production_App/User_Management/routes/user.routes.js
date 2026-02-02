import express from 'express';
import {
    getAlluser,
    getUserid,
    createUser
} from '../controller/user.controller.js';

const routes = express.Router();
 
routes.get('/', getAlluser);
routes.get('/:id', getUserid);
routes.get('/', createUser);

export default routes;