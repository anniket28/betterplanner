import connectDB from "@/middleware/connectDb";
import Task from '@/models/Task';
import { getUserFromRequest } from "@/utils/getUserFromRequest";

const handler = async (req, res) => {
    try {
        const user = getUserFromRequest(req);

        if (!user) {
            return res.status(401).send("Not authenticated");
        }

        const { type } = req.query;

        if (type === "All") {
            const dailyTasks = await Task.find({ createdBy: user.email, type: "Daily", isDeleted: false }).sort({ isCompleted: 1, createdAt: -1 });
            const weeklyTasks = await Task.find({ createdBy: user.email, type: "Weekly", isDeleted: false }).sort({ isCompleted: 1, createdAt: -1 });
            const monthlyTasks = await Task.find({ createdBy: user.email, type: "Monthly", isDeleted: false }).sort({ isCompleted: 1, createdAt: -1 });

            return res.status(200).json({ dailyTasks: dailyTasks, weeklyTasks: weeklyTasks, monthlyTasks: monthlyTasks });
        } else {
            const tasks = await Task.aggregate([
                { $match: { createdBy: user.email, isDeleted: false } },

                {
                    $addFields: {
                        priorityOrder: {
                            $switch: {
                                branches: [
                                    { case: { $eq: ["$priority", "High"] }, then: 1 },
                                    { case: { $eq: ["$priority", "Medium"] }, then: 2 },
                                    { case: { $eq: ["$priority", "Low"] }, then: 3 },
                                ],
                                default: 4
                            }
                        }
                    }
                },

                {
                    $sort: {
                        isCompleted: 1,  // false first ✅
                        priorityOrder: 1, // High → Medium → Low ✅
                        createdAt: -1,     // latest first ✅
                        dayOfMonth: 1
                    }
                }
            ]);

            return res.status(200).json(tasks);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
};

export default connectDB(handler);
