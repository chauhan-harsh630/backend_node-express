import mongoose from "mongoose";

const wardSchema = new mongoose.Schema({
    roomNo: {
        type: Number,
        required: true,
        unique: true,
    },
    type: {
        type: String,
        enum: ["general", "icu", "cardiac", "isolation", "private"],
        required: true,
    },
    status: {
        type: String,
        enum: ["available", "occupied", "maintenance"],
        default: "available",
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
        default: null,
    },
    floor: {
        type: Number,
    },
    totalBeds: {
        type: Number,
        default: 1,
    },
}, { timestamps: true });

const Ward = mongoose.model("Ward", wardSchema);
export default Ward;