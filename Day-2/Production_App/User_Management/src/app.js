import express from "express";
import userRoute from "../routes/user.routes.js";
import logger from "../Middleware/logger.js";

const app = express();

// global middleware
app.use(express.json());
app.use(logger);

// routes
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "User API running" });
});

app.use("/api/users", userRoute);

// 404
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

export default app;
