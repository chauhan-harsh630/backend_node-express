import express from 'express';
import {
    createNotes,
    getAllNotes,
    deleteNote
} from '../controller/note.controller.js';

const routes = express.Router();

routes.post('/', createNotes);
routes.get('/', (req, res) => {
    res.send("Server is runnnig");
    getAllNotes;
});
routes.delete('/:id', deleteNote);

export default routes;