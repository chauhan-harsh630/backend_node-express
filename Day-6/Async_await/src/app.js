import express from 'express';
import usersRoutes from './routes/uses.routes.js';
import errorHandler from './middleware/error.middleware.js'

const app = express();

app.use('/api/users', usersRoutes);
app.use(errorHandler);

export default app