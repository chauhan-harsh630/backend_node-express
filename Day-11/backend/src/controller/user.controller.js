
import user from "../model/user.model.js";

export const cresteStudent = async (req, res) => {
    try {
        const student = await user.create(req.body);

        res.status(201).json({
            success: true,
            data: student
        });
    } catch (error) {
        res.status(500).json({
            success: true,
            message: error.message,
        });
    }
}

export const getStudent = async (req, res) => {
    try {
        const student = await user.find();
        if (!student) {
            res.status(404).json({
                message: "No student",
                success: false
            });
        }

        res.status(200).json({
            success: true,
            data: student
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}