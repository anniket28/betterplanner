import connectDB from "@/middleware/connectDb";
import Task from '@/models/Task';
import { getUserFromRequest } from "@/utils/getUserFromRequest";

const handler = async (req, res) => {
    if (req.method == "POST") {
        const user = getUserFromRequest(req);

        if (!user) {
            return res.status(401).send("Not authenticated");
        }

        let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        let currentDate = new Date();
        let timestamp = days[currentDate.getDay()] + ", " + currentDate.getDate() + "-" + months[currentDate.getMonth()] + "-" + currentDate.getFullYear() + " " + currentDate.toLocaleTimeString();

        const data = req.body.data

        let newTask = new Task({
            title: data.newTask,
            category: data.category,
            priority: data.priority,
            type: data.type,
            day: data.day ? data.day : null,
            month: data.month ? data.month : null,
            dayOfMonth: data.dayOfMonth ? data.dayOfMonth : null,
            dueDate: data.dueDate ? data.dueDate : null,
            isRepeatable: data.repeat,
            createdBy: user.email,
            date: timestamp
        })

        try {
            const results = await newTask.save();
            return res.status(200).send(results);
        } catch (error) {
            console.error(error);
            return res.status(500).send(error);
        }
    } else if (req.method === "PUT") {
        const user = getUserFromRequest(req);

        if (!user) {
            return res.status(401).send("Not authenticated");
        }

        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ success: false, error: "Task ID is required" });
        }

        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ success: false, error: "Task not found" });
        }

        // ✅ Toggle logic
        if (task.isCompleted) {
            // If uncompleting
            task.isCompleted = false;
            task.completedAt = null;
        } else {
            // If completing
            task.isCompleted = true;
            task.completedAt = new Date(); // When it was completed
        }

        const updatedTask = await task.save();

        return res.status(200).json({
            success: true,
            task: updatedTask
        });
    } else {
        res.status(405).send("Not Allowed");
    }
};

export default connectDB(handler);
