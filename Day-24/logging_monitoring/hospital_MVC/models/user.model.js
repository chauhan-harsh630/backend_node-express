import mongoose from "mongoose";
import { type } from "node:os";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: Number, required: true },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User