import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
    age: {
        type: Number,
        required: true,
        min: 0,
        max: 120,
    },
    gender: {
        type: String,
        enum: ["male", "female", "other"],
        required: true,
    },
    bloodGroup: {
        type: String,
        enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    medicalHistory: {
        type: String,
        default: "",
    },
    isAdmitted: {
        type: Boolean,
        default: false,
    },
    emergencyContact: {
        name: { type: String },
        phone: { type: String },
        relation: { type: String },
    },

}, { timestamps: true });

const Patient = mongoose.model("Patient", patientSchema);

export default Patient;