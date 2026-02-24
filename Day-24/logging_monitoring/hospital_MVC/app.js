import express from 'express';

import userRoutes from './routes/user.routes.js';
import docterRoutes from './routes/docter.route.js';
import Appointment from './routes/appointment.route.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();
const app = express();
app.use(express.json());

app.use('/api', userRoutes);
app.use('/api', docterRoutes);
app.use('/api', Appointment);

mongoose.connect(process.env.MONGO_DB)
    .then(() => console.log("DB is connect successfull"))
    .catch((err) => console.error(err));

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
})
