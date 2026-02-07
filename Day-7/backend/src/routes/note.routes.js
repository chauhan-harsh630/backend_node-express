import express from 'express'; 

import {
    createNotes,
    getNotes,
    getNote,
    updateNotes,
    deleteNotes
} from '../controller/note.controller.js';

const router = express.Router();

router.post('/', createNotes);
router.get('/', getNotes);
router.get('/:id', getNote);
router.put('/:id', updateNotes);
router.delete('/:id', deleteNotes);

export default router