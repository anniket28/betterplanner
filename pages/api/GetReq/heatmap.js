import connectDB from "@/middleware/connectDb";
import Task from "@/models/Task";
import { getUserFromRequest } from "@/utils/getUserFromRequest";
import moment from "moment-timezone";

connectDB();

export default async function handler(req, res) {
    const user = getUserFromRequest(req);

    if (!user) {
        return res.status(401).send("Not authenticated");
    }

    const email = user.email;

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const tasks = await Task.find({
        createdBy: email,
        isCompleted: true,
    });

    const heatmap = {};

    tasks.forEach(task => {
        const day = moment(task.completedAt)
            .tz(timezone)
            .format("YYYY-MM-DD");

        heatmap[day] = heatmap[day] ? heatmap[day] + 1 : 1;
    });

    res.status(200).json(heatmap);
}
