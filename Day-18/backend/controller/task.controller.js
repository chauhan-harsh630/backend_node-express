import Task from "../models/task.model.js";

export const createTask = async (req, res) => {
    try {
        console.log("User from middleware:", req.user);
        console.log("Body:", req.body);

        const { title, description, status } = req.body;

        const task = await Task.create({
            title,
            description,
            status,
            user: req.user._id
        });

        res.status(201).json({
            success: true,
            message: "Task created successfully",
            data: task
        });

    } catch (error) {
        console.log("ERROR:", error);
        res.status(500).json({
            message: error.message
        });
    }
};
export const getMyTasks = async (req, res) => {
    try {
        const task = await Task.find({ user: req.user._id });
        
        res.status(200).json({
            success: true,
            TaskList: task.length,
            message: "Task fetched successfully",
            Tasks: task
        })

    } catch (error) {
        res.status(500).json({message:"Internal server error"});
    }

}

export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({message:"Task not found"});
        }

        if (task.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({message:"Unauthorized"});
        }
        await task.deleteOne();
        res.status(200).json({
            success: true,
            message: "Task deleted successfully",
        })  
    } catch (error) {
        res.status(500).json({message:"Internal server error"});
    }
}