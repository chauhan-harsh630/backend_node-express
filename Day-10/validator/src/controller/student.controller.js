import students from "../models/student.model.js"
export const createStudent = async (req, res) => {
    try {
        const student = await students.create(req.body);
        res.status(201).json({
            success: true,
            data: student,
        });
    } catch (error) {
        res.status(500).json({
            success: 'error',
            message: error.message
        });
    }
}

export const getStudent = async (req, res) => {
    try {
        const student = await students.find();
        res.status(200).json({
            success: true,
            result: student.length,
            data: student
        });
    } catch (error) {
        res.status(500).json({
            success: 'error',
            message: error.message
        });
    }
}