import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import producrRouter from './src/routes/product.routes.js';
import orderRouter from './src/routes/order.routes.js';
import cartRouter from './src/routes/cart.routes.js';
import userRoutes from './src/routes/user.controller.js';
const app = express();
dotenv.config();
const port = process.env.PORT || 5000;
app.use(express.json());

app.use('/api/product', producrRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/api/user', userRoutes);
mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log("DB is connected "))
    .catch((err) => console.log(err));

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});