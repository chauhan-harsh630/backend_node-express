import User from "../models/user.model.js";

 const createUser = async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json({
            success: true,
            message: "User create successfuly",
            userID:user,
        });
    } catch (error) {
        res.status(500).json({
            success: true,
            message: error.message
        });
    }
}

export default createUser