import mongoose from "mongoose";

const staffSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
    designation: {
        type: String,
        required: true,
        trim: true,       // e.g. "Head Nurse", "Lab Technician"
    },
    department: {
        type: String,
        required: true,
        trim: true,
    },
    shift: {
        type: String,
        enum: ["morning", "evening", "night"],
        required: true,
    },
    salary: {
        type: Number,
        required: true,
        min: 0,
    },
    joiningDate: {
        type: Date,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,        // for soft delete / suspend staff
    },
    emergencyContact: {
        name: { type: String },
        phone: { type: String },
        relation: { type: String },
    },
}, { timestamps: true });

const Staff = mongoose.model("Staff", staffSchema);
export default Staff;