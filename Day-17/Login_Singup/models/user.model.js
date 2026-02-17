import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        require: true,
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;