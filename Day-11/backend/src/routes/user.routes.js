import express from 'express';
import {
    cresteStudent,
    getStudent
} from '../controller/user.controller.js';

const routes = express.Router();

routes.post('/', cresteStudent);
routes.get('/', getStudent);

export default routes