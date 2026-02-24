import express from 'express';
import createDoctor from '../controller/doctor.controller.js';
const routes = express.Router();

routes.post('/doctor', createDoctor);

export default routes;