import express from 'express';
import mongoose from 'mongoose';
import studentRoutes from './src/routes/student.routes.js';

const app = express();
const port = 5000;

app.use(express.json());
app.use('/api/student', studentRoutes);

mongoose.connect("mongodb://localhost:27017/")
    .then(() => console.log("Student DB is connect"))
    .catch((err) => console.log(err));

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});