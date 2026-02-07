import AppError from "../utils/AppError.js";

let notes = [];
let id = 1;


// Create notes

export const createNotes = (req, res, next) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return next(new AppError("Title and content required", 400));
    }
    const newNotes = { id: id++, title, content };
    notes.push(newNotes);

    res.status(201).json({
        success: true,
        data: newNotes,
    });
}


export const getNotes = (req, res, next) => {
    res.json({
        success: true,
        count: notes.length,
        data: notes,
    });
}
//get single notes
export const getNote = (req, res, next) => {
    const note = notes.find(u => u.id === Number(req.params.id));
    if (!note) {
        return next(new AppError("Note not found", 404));
    }

    res.json({
        success: true,
        data: note,
    });
}

//Update notes
export const updateNotes = (req, res, next) => {
    const note = notes.find(u => u.id === Number(req.params.id));
    if (!note) {
        return next(new AppError("Note not found", 404));
    }
    note.titil = req.titil || note.titil;
    note.content = req.content || note.content;

    res.json({
        success: true,
        data: note
    });
}

//delete notes
export const deleteNotes = (req, res, next) => {
    const index = notes.findIndex(u => u.id === Number(req.params.id));
    if (!index) {
        return next(new AppError("Notes not found", 404));
    }
    notes.splice(index, 1);

    res.json({
        success: true,
        data: notes,
    });
}