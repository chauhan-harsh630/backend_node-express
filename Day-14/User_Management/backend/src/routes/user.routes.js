import express from 'express';
import {
    createUser,
    getUsers,
    getSingleUser,
    updateUser,
    deleteUser
} from '../controller/user.controller.js';

const routes = express.Router();

routes.post('/', createUser);
routes.get('/', getUsers);
routes.get('/:id', getSingleUser);
routes.put('/:id', updateUser);
routes.delete('/:id', deleteUser);

export default routes;