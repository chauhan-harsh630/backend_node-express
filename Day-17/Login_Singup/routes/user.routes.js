import express from "express";
import { signup, login,profile } from "../controller/auth.controller.js";
import { auth } from "../middelware/auth.middleware.js";
const routes = express.Router();

routes.post("/signup", signup);
routes.post("/login", login);
routes.get("/profile", auth, profile);
export default routes;