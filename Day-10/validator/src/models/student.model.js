import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, "Name is reqired"],
        trim: true,
    },
    email: {
        type: String,
        require: [true, "Email is required"],
        unique: true,
        lowercase: true,
    },
    age: {
        type: Number,
        require: [true, "Age is required"],
        min: 5,
        max: 100
    }
});
const student = mongoose.model("student", studentSchema);
export default student