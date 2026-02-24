import express from 'express';
import User from '../controller/user.controller.js';

const router = express.Router();

router.post('/users', User);

export default router;