import connectDB from "@/middleware/connectDb";
import User from "@/models/User";
import Task from "@/models/Task";
import sendEmail from "@/utils/sendEmail";
import cron from "node-cron";
import moment from "moment-timezone";

const handler = async (req, res) => {
  res.status(200).json({ message: "Reminder cron running in background" });
};

connectDB();

if (!global.reminderCronStarted) {
  global.reminderCronStarted = true;

  // Runs every 30 minutes
  cron.schedule("*/30 * * * *", async () => {
    console.log("Running reminder cron...");

    const users = await User.find();

    for (const user of users) {
      const userTime = moment().tz(user.timezone);
      const hour = userTime.hour();
      const todayDate = userTime.format("YYYY-MM-DD");

      if (hour === 21) {

        // Avoid sending twice
        if (user.lastReminderSent && moment(user.lastReminderSent).tz(user.timezone).format("YYYY-MM-DD") === todayDate) {
          continue;
        }

        // 🔹 DAILY TASKS PENDING
        const dailyPendingTasks = await Task.find({
          createdBy: user.email,
          isCompleted: false,
          type: "Daily"
        });

        // 🔹 MONTHLY TASKS DUE TODAY
        const monthlyPendingTasks = await Task.find({
          createdBy: user.email,
          isCompleted: false,
          type: "Monthly",
          dueDate: {
            $gte: moment(userTime).startOf("day").toDate(),
            $lte: moment(userTime).endOf("day").toDate()
          }
        });

        const totalPending = dailyPendingTasks.length + monthlyPendingTasks.length;

        if (totalPending > 0) {
          await sendEmail(
            user.email,
            "You're close! Finish your tasks 💪",
            `You still have 
${dailyPendingTasks.length} daily tasks 
and ${monthlyPendingTasks.length} monthly tasks due today.
Finish strong!`
          );
        } else {
          await sendEmail(
            user.email,
            "Great work today 🎉",
            "Amazing! You’ve completed all tasks scheduled for today. That's discipline right there!"
          );
        }

        user.lastReminderSent = new Date();
        await user.save();
      }
    }
  });
}

export default handler;
