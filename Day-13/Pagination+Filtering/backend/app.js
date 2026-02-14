import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import noteRoutes from './src/routes/note.routes.js';
const app = express();
dotenv.config();
const port = process.env.PORT || 5000;
app.use(express.json());

app.use('/api/notes', noteRoutes);

mongoose.connect(process.env.MONGO_DB_URI)
    .then(() => console.log("DB is connected"))
    .catch((err) => console.log(err));


    
app.listen(port, () => {
    console.log(`Server is running port http://localhost:${port}`);
});