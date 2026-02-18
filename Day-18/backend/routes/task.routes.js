import express from "express";
import { createTask, getMyTasks, deleteTask } from "../controller/task.controller.js";
import auth from "../middleware/auth.middelware.js";

const Taskroutes = express.Router();

Taskroutes.post('/', auth,createTask);
Taskroutes.get('/',auth, getMyTasks);
Taskroutes.delete('/:id',auth, deleteTask);
 

export default Taskroutes;