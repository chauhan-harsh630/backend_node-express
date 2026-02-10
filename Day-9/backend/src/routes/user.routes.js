import express from 'express';
import {
    createUser,
    getUser,
    updateUser,
    deleteUser
} from '../controller/user.controller.js';

const routes = express.Router();

routes.post('/', createUser);
routes.get('/', getUser);
routes.put('/:id', updateUser);
routes.delete('/:id', deleteUser);

export default routes