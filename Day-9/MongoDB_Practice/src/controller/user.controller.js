import userSchema from "../models/user.model.js"

export const createUser = async (req, res) => {
    try {
        const user = await userSchema.create(req.body);
        res.status(201).json({
            success: true,
            data: user
        });
    } catch (err) {
        res.status(404).json({
            success: true,
            message: err.message
        });
    }
}

export const getUsers = async (req, res) => {
    try {
        const user = await userSchema.find();
        res.status(200).json({
            success: true,
            data: user
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }

}

export const upDateUser = async (req, res) => {
    try {
        const user = await userSchema.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not find"
            });
        }
        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
}

export const deleteUser = async (req, res) => {
    try {
        const user = await userSchema.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "User delete successfully"
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}