import express from 'express';
import cors from 'cors'
import notesRoutes from './routes/note.routes.js';
import errorHandler from './middleware/errorHandler.js';
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/notes', notesRoutes);
app.use(errorHandler);

export default app