import express from 'express';
import { createStudent, getStudent } from '../controller/student.controller.js';
import  studentMiddleware  from '../middleware/student.middleware.js';

const routes = express.Router();

routes.post('/',studentMiddleware ,createStudent);
routes.get('/', getStudent);

export default routes;