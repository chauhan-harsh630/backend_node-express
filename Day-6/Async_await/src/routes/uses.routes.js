import express from 'express';
import {getUser} from '../controllers/user.controller.js'
const routes = express.Router();

routes.get('/:id',getUser)

export default routes