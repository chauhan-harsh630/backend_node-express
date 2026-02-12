import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
        unique: true,
    },
    age: {
        type: Number,
        require: true
    },
    roll_no: {
        type: Number,
        require: true
    }

});

const user = mongoose.model("user", userSchema);
export default user