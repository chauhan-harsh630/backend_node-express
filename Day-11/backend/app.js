import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import routes from './src/routes/user.routes.js';
const app = express();
dotenv.config();
const port = process.env.PORT || 4000;
app.use(express.json());

app.use('/api/user', routes);

mongoose.connect(process.env.DB)
    .then(() => console.log("DB is connect"))
    .catch((err) => console.log(err));

app.listen(port, () => {
    console.log(`Server at running at http://localhost:${port}`);
});