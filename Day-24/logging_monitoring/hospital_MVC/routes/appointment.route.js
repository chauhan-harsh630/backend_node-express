import express from "express";
import {
  bookAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  deleteAppointment
} from "../controller/appointment.controller.js";

const router = express.Router();

router.post("/appointment", bookAppointment);
router.get("/appointments", getAllAppointments);
router.get("/appointments/:id", getAppointmentById);
router.put("/appointments/:id", updateAppointmentStatus);
router.delete("/appointments/:id", deleteAppointment);

export default router;