import mongoose from "mongoose";

const billSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
        required: true,
    },
    appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment",
        default: null,
    },
    services: [
        {
            name: { type: String, required: true },   // e.g. "Consultation", "X-Ray"
            charge: { type: Number, required: true },
        }
    ],
    totalAmount: {
        type: Number,
        required: true,
        min: 0,
    },
    discount: {
        type: Number,
        default: 0,
        min: 0,
    },
    finalAmount: {
        type: Number,
        required: true,
        min: 0,
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "paid", "partial", "cancelled"],
        default: "pending",
    },
    paymentMethod: {
        type: String,
        enum: ["cash", "card", "upi", "insurance", "online"],
        default: "cash",
    },
    paidAt: {
        type: Date,
        default: null,
    },
}, { timestamps: true });

const Bill = mongoose.model("Bill", billSchema);
export default Bill;