import express from 'express';
import mongoose from 'mongoose';
import router from './routes/transication.routes.js';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(express.json());
const port = process.env.PORT || 8080;


mongoose.connect(process.env.MONGO_DB)
    .then(() => console.log("DB is connect successfully"))
    .catch((err) => console.log(err));

app.use('/api/hospital', router);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
