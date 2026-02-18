import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRotues from './routes/auth.routes.js';
import Taskroutes from './routes/task.routes.js';


dotenv.config();
const app = express();
app.use(express.json());


const port = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_DB)
.then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.log(err));


app.use('/api/auth', authRotues);
app.use('/api/tasks', Taskroutes);

app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));