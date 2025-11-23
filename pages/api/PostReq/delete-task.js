import connectDB from "@/middleware/connectDb";
import Task from '@/models/Task';
import { getUserFromRequest } from "@/utils/getUserFromRequest";

const handler = async (req, res) => {
    if (req.method === "PUT") {
        const user = getUserFromRequest(req);

        if (!user) {
            return res.status(401).send("Not authenticated");
        }

        const { id } = req.body;

        if (!id) {
            return res.status(400).send("Task ID is required");
        }

        try {
            const task = await Task.findById(id);
            if (!task) return res.status(404).json({ success: false, error: "Task not found" });

            task.isDeleted = true;
            const deletedTask = await task.save();

            return res.status(200).send(deletedTask);
        } catch (error) {
            console.error(error);
            return res.status(500).send(error);
        }
    } else {
        res.status(405).send("Not Allowed");
    }
};

export default connectDB(handler);