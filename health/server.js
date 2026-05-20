import express from 'express'
import mongoose from 'mongoose';
import adminRouter from './routes/adminroute.js';

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/hospital')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Middleware to parse JSON request bodies
app.use(express.json());

app.get("/", (req, res) => {
    res.send("hello from express")
});

// Correctly mount the router using app.use
app.use("/api/admin/register", adminRouter);

app.listen(3000, () => {
    console.log(`Server running on http://localhost:3000`);
})
