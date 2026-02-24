import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
     name: { type: String, required: true },
  specialization: { type: String, required: true },
  availableSlots: {
    type: Number,
    default: 5
  }
}, { timeStamp: true });

const Doctor = mongoose.model("Doctor", doctorSchema);
export default Doctor;