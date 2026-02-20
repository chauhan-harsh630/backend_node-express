import express from 'express';
import mongoose from "mongoose";
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import ratelimit from 'express-rate-limit';

import userRoutes from './src/routes/user.routes.js';
dotenv.config();
const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(cookieParser());
app.use(helmet());

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));
app.use('/api/auth', userRoutes);

mongoose.connect(process.env.MONGO_DB)
    .then(() => console.log("DB connect succefully"))
    .catch((err) => console.log(err));

const limiter = ratelimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
});
app.use(limiter);
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});