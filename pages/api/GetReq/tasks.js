import connectDB from "@/middleware/connectDb";
import Task from "@/models/Task";
import { getUserFromRequest } from "@/utils/getUserFromRequest";
import moment from "moment-timezone";

const handler = async (req, res) => {
    try {
        const user = getUserFromRequest(req);

        if (!user) {
            return res.status(401).send("Not authenticated");
        }

        const { type } = req.query;
        const email = user.email;

        // Ideally store timezone in User model later
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        /* -------------------  TYPE === ALL  ------------------- */
        if (type === "All") {

            const dailyTasks = await Task.find({ createdBy: email, type: "Daily", isDeleted: false })
                .sort({ isCompleted: 1, createdAt: -1 });

            const weeklyTasks = await Task.find({ createdBy: email, type: "Weekly", isDeleted: false })
                .sort({ isCompleted: 1, createdAt: -1 });

            const monthlyTasks = await Task.find({ createdBy: email, type: "Monthly", isDeleted: false })
                .sort({ isCompleted: 1, createdAt: -1 });

            /* ----------- STREAK + HEATMAP DATA ----------- */

            const completedTasks = await Task.find({
                createdBy: email,
                isCompleted: true,
                completedAt: { $ne: null }
            });

            const completedDates = new Set();
            const heatmap = {};

            completedTasks.forEach(task => {
                const day = moment(task.completedAt)
                    .tz(timezone)
                    .format("YYYY-MM-DD");

                completedDates.add(day);

                heatmap[day] = heatmap[day]
                    ? heatmap[day] + 1
                    : 1;
            });

            const sortedDates = [...completedDates].sort().reverse();

            let streak = 0;
            let currentDay = moment().tz(timezone);

            for (let date of sortedDates) {
                if (moment(date).isSame(currentDay, "day")) {
                    streak++;
                    currentDay.subtract(1, "day");
                } else {
                    break;
                }
            }

            return res.status(200).json({
                dailyTasks,
                weeklyTasks,
                monthlyTasks,
                streak,
                heatmap
            });
        }

        /* -------------------  SINGLE TYPE  ------------------- */

        const tasks = await Task.aggregate([
            {
                $match: {
                    createdBy: email,
                    isDeleted: false,
                    type: type,
                }
            },

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
                    isCompleted: 1,    // ✅ Not completed first
                    priorityOrder: 1,  // ✅ High → Medium → Low
                    createdAt: -1,
                    dayOfMonth: 1
                }
            }
        ]);

        return res.status(200).json(tasks);

    } catch (error) {
        console.error("Error in task fetch:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export default connectDB(handler);
