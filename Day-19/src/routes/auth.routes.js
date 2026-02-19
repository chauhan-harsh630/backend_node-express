import express from "express";
import { signup, login, refresh, logout } from "../controller/auth.controller.js";

import  auth  from "../middleware/auth.middleware.js";


const routes = express.Router();

routes.post("/signup", signup);
routes.post("/login",login);
routes.post("/refresh", refresh);
routes.post("/logout", logout);
 

routes.get("/profile", auth, (req, res) => {
    res.status(200).json({
        message: "Profile data",
        user: req.user,
    });
});

export default routes;