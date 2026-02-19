import mongoose from "mongoose";
import { type } from "node:os";

const tokenSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    token: { type: String, required: true },
    createdat: { type: Date, default: Date.now, expires: 3600 } // Token expires after 1 hour
})

const RefreshToken = mongoose.model("RefreshToken", tokenSchema);
export default RefreshToken;