import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Patient ID is required"]
    },

    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: [true, "Doctor ID is required"]
    },

    appointmentDate: {
      type: Date,
      required: [true, "Appointment date is required"]
    },

    status: {
      type: String,
      enum: ["booked", "completed", "cancelled"],
      default: "booked"
    }
  },
  {
    timestamps: true
  }
);

/* ===============================
   Index for Preventing Duplicate Booking
================================= */
appointmentSchema.index({ doctor: 1, appointmentDate: 1 });

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;