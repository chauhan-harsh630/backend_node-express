import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import RefreshToken from "../models/refresh.token.model.js";

/* ============================= */
/* Token Generators */
/* ============================= */

const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user._id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
    );
};

const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
    );
};

/* ============================= */
/* SIGNUP */
/* ============================= */

export const signup = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            email,
            password: hashedPassword,
        });

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: user._id,
                email: user.email,
            }
        });

    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({
            message: "Error creating user",
            error: error.message,
        });
    }
};

/* ============================= */
/* LOGIN */
/* ============================= */

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Save refresh token in DB
        await RefreshToken.create({
            user: user._id,
            token: refreshToken,
        });

        res
            .cookie("refreshtoken", refreshToken, {
                httpOnly: true,
                secure: false, // true in production (HTTPS)
                sameSite: "strict",
            })
            .json({
                message: "Login successful",
                accessToken,
            });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({
            message: "Error logging in",
            error: error.message,
        });
    }
};

/* ============================= */
/* REFRESH (WITH ROTATION) */
/* ============================= */

export const refresh = async (req, res) => {
    try {
        const oldToken = req.cookies.refreshtoken;

        if (!oldToken) {
            return res.status(401).json({ message: "No refresh token provided" });
        }

        const storedToken = await RefreshToken.findOne({ token: oldToken });

        if (!storedToken) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }

        jwt.verify(
            oldToken,
            process.env.REFRESH_TOKEN_SECRET,
            async (err, decoded) => {
                if (err) {
                    return res.status(403).json({ message: "Invalid refresh token" });
                }

                // 🔁 ROTATION: Delete old token
                await storedToken.deleteOne();

                const user = await User.findById(decoded.id);

                const newAccessToken = generateAccessToken(user);
                const newRefreshToken = generateRefreshToken(user);

                // Save new refresh token
                await RefreshToken.create({
                    user: user._id,
                    token: newRefreshToken,
                });
                res
                    .cookie("refreshtoken", newRefreshToken, {
                        httpOnly: true,
                        secure: false,
                        sameSite: "strict",
                    })
                    .json({
                        message: "Token refreshed successfully",
                        accessToken: newAccessToken,
                    });
            }
        );
    } catch (error) {
        console.error("Refresh Error:", error);
        res.status(500).json({
            message: "Error refreshing token",
            error: error.message,
        });
    }
};

/* ============================= */
/* LOGOUT */
/* ============================= */

export const logout = async (req, res) => {
    try {
        const token = req.cookies.refreshtoken;

        if (token) {
            await RefreshToken.findOneAndDelete({ token });
        }

        res.clearCookie("refreshtoken");

        res.json({ message: "Logged out successfully" });

    } catch (error) {
        console.error("Logout Error:", error);
        res.status(500).json({
            message: "Error logging out",
            error: error.message,
        });
    }
};
