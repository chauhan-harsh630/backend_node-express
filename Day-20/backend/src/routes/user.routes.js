import express from 'express';
import {
    register,
    login,
    profile,
    logout,
} from '../controller/user.controller.js';
import { auth } from '../middleware/user.middleware.js';
const routes = express.Router();

routes.post('/register', register);
routes.post('/login', login);
routes.get('/profile',auth,profile);
routes.post('/logout', logout);

export default routes