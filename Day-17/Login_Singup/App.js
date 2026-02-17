import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoutes from "./routes/user.routes.js";


dotenv.config();
const app = express();
app.use(express.json());
const port = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_DB)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log(err));
    
app.use('/api/users', userRoutes);
app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});
