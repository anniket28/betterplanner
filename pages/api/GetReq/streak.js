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

  const completedDates = new Set();

  tasks.forEach(task => {
    const day = moment(task.completedAt)
      .tz(timezone)
      .format("YYYY-MM-DD");
    completedDates.add(day);
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

  res.status(200).json({ streak });
}
