import express from "express";
import mongoose from "mongoose";
import User from "../models/user.model.js";
import Doctor from "../models/docter.model.js";
import Appointment from "../models/appointment.model.js";


const router = express.Router();

router.post("/doctor", async (req, res) => {
  const doctor = await Doctor.create(req.body);
  res.json(doctor);
});

router.post("/user", async (req, res) => {
  const user = await User.create(req.body);
  res.json(user);
});
router.post("/book", async (req, res) => {
  const { userId, doctorId, date } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const doctor = await Doctor.findById(doctorId).session(session);

    if (!doctor) throw new Error("Doctor not found");
    if (doctor.availableSlots <= 0)
      throw new Error("No slots available");

    await Appointment.create(
      [{ userId, doctorId, date }],
      { session }
    );

    doctor.availableSlots -= 1;
    await doctor.save({ session });

    await session.commitTransaction();

    res.json({ message: "Appointment booked successfully" });

  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ error: error.message });

  } finally {
    session.endSession();
  }
});

export default router