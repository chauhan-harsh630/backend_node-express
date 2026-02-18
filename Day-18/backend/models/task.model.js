import mongoose from "mongoose";
import { type } from "os";
import { deflate } from "zlib";


const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "in-progress", "completed"],
        default: "pending"
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);
export default Task;