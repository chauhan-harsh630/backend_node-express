import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import userRoutes from './src/routes/user.routes.js';

const app = express();
const port = 4000;
app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('API running');
});

mongoose.connect("mongodb://localhost:27017/Users")
    .then(() => console.log("DB connect"))
    .catch((err) => console.log(err));

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
