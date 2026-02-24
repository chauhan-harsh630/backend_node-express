import Doctor from "../models/doctor.model.js";

 const createDoctor = async (req, res) => {
    try {
        const docter = await Doctor.create(req.body);
        res.status(201).json({
            success: true,
            message: "Doctor is create successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export default createDoctor