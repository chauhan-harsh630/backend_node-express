import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema({
    appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment",
        required: true,
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
        required: true,
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
        required: true,
    },
    medicines: [
        {
            name: { type: String, required: true },
            dosage: { type: String },
            frequency: { type: String },
            duration: { type: String },
        }
    ],
    diagnosis: {
        type: String,
        required: true,
    },
    notes: {
        type: String,
        default: "",
    },
    visitDate: {
        type: Date,
        default: Date.now,
    },

}, { timestamps: true });

const Prescription = mongoose.model("Prescription", prescriptionSchema);
export default Prescription;