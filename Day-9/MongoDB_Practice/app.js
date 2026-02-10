import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import userRoutes from './src/routes/user.routes.js';


const app = express();
const port = 5000;
app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
    res.send("API is running");
});


mongoose.connect("mongodb://localhost:27017/")
    .then(() => console.log("DB is connected"))
    .catch((err) => console.log(err));


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});