import mongoose from "mongoose";

const medicalRecordSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
        required: true,
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
        required: true,
    },
    appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment",
        default: null,
    },
    diagnosis: {
        type: String,
        required: true,
    },
    treatment: {
        type: String,
        default: "",
    },
    labResults: [
        {
            testName: { type: String },       // e.g. "Blood Sugar", "CBC"
            result: { type: String },
            reportUrl: { type: String },      // file upload URL (Cloudinary etc.)
            conductedAt: { type: Date, default: Date.now },
        }
    ],
    reports: [
        {
            title: { type: String },
            fileUrl: { type: String },        // PDF/image upload
            uploadedAt: { type: Date, default: Date.now },
        }
    ],
    followUpDate: {
        type: Date,
        default: null,
    },
    recordDate: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

const MedicalRecord = mongoose.model("MedicalRecord", medicalRecordSchema);
export default MedicalRecord;