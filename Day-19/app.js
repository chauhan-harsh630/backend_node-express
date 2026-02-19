import express from "express";
import authRoutes from "./src/routes/auth.routes.js";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";


const app = express();
dotenv.config();
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
const port = process.env.PORT || 5000;


mongoose.connect(process.env.MONGO_DB)
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.error("Error connecting to MongoDB", error));


app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});
