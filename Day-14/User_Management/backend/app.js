import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import usersRoutes from './src/routes/user.routes.js';

const app = express();
dotenv.config()
const port = process.env.PORT || 5000;
app.use(express.json())
app.use('/api/user', usersRoutes);

mongoose.connect(process.env.MONGO_DB_URI)
    .then(() => console.log("DB is connected"))
    .catch((err) => console.log(err));
app.get('/', (req, res) => {
    res.send("SERVER is running!!!!");
});

app.listen(port, () => {
    console.log(`Server is runnig at http://localhost:${port}`);
})