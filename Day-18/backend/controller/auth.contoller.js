import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const singup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({message:"All fields are required"});
        }

        const existUser = await User.findOne({ email });
        if (existUser) {
            return res.status(400).json({message:"User already exists"});
        }
        const hashpassword = await bcrypt.hash(password, 10);
        const uset = await User.create({ name, email, password: hashpassword });
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: uset._id,
                name: uset.name,
                email: uset.email,
            }
        })
    } catch (error) {
        res.status(500).json({message:"Internal server error"});        
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({message:"All fields are required"});
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({message:"Invalid credentials"});
        }
        const ismatch = await bcrypt.compare(password, user.password);
        if (!ismatch) {
            return res.status(400).json({message:"Invalid credentials"});
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        console.log("LOGIN SECRET:", process.env.JWT_SECRET);
        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            }
        })
    } catch (error) {
        res.status(500).json({message:"Internal server error"});        
    }
}