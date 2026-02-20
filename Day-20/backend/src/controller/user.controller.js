import Users from "../models/user.models.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs';


export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existeUser = await Users.findOne({ email });
        if (existeUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }
        const hashpassword = await bcrypt.hash(password, 10);
        const user = await Users.create({
            name,
            email,
            password: hashpassword,
        });
        res.status(201).json({ success: true, message: "User registered successfully" });
    } catch (error) {
        res.status(500).josn({
            success: false,
            message: error.message
        });
    }
}
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await Users.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }
        const isMath = await bcrypt.compare(password, user.password);

        if (!isMath) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }
        const token = jwt.sign({ id: user._id, name: user.name, email: user.email, }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",   // use lax if same host
        });
        res.json("Login successfull");
    } catch (error) {
        res.status(500).josn({
            success: false,
            message: error.message
        });
    }
}
export const profile = (req, res) => {
    res.json({ user: req.user });
};
export const logout = (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out" });
}

