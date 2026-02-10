import express from 'express';

import {
    createUser,
    getUsers,
    upDateUser,
    deleteUser
} from '../controller/user.controller.js';

const routes = express.Router();

routes.post('/', createUser);
routes.get('/', getUsers);
routes.put('/:id', upDateUser);
routes.delete('/:id', deleteUser);

export default routes