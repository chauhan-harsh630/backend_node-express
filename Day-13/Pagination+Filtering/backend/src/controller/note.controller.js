import Note from "../models/notes.model.js";

export const createNotes = async (req, res) => {
    try {
        const notes = await Note.create(req.body);
        res.status(201).json({
            success: true,
            data: notes
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const getAllNotes = async (req, res) => {
    try {
        const page = parseInt(req.query.page);
        const limit = 3;
        const skip = (page - 1) * limit;

        const notes = await Note.find()
            .skip(skip)
            .limit(limit)
            .sort({ createAt: -1 });
        
        const total = await Note.countDocuments();

        res.status(200).json({
            total,
            page,
            totalpage: Math.ceil(total / limit),
            data: notes
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const deleteNote = async (req, res) => {
    try {
        await Note.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Delete Successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}