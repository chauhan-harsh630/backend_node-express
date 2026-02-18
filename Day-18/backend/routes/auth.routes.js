import express from "express";
import { singup, login } from "../controller/auth.contoller.js";


const authRotues = express.Router();

authRotues.post("/signup", singup);
authRotues.post("/login", login);

export default authRotues;