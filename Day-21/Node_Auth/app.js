import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_DB)
    .then(() => console.log("DB is connect successfully"))
    .catch((err) => console.error(err));

app.listen(port, () => {
    console.log(`Server is runnig at http://localhost:${port}`);
});

