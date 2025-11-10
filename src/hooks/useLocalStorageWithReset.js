import { useState, useEffect } from "react";

// type = "daily" | "weekly" | "monthly"
export function useLocalStorageWithReset(key, type) {
  const [tasks, setTasks] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    const now = new Date();
    const today = now.toISOString().split("T")[0]; // YYYY-MM-DD

    let updated = tasks.map(task => {
      if (!task.lastReset) task.lastReset = task.createdAt || today;

      const lastReset = task.lastReset;
      const shouldReset = 
        (type === "daily" && lastReset !== today) ||
        (type === "weekly" && new Date(lastReset).getWeekNumber() !== now.getWeekNumber()) ||
        (type === "monthly" && new Date(lastReset).getMonth() !== now.getMonth());

      if (task.repeat && shouldReset) {
        task.done = false;
        task.lastReset = today;
      }
      return task;
    });

    setTasks(updated);
    localStorage.setItem(key, JSON.stringify(updated));
  }, []); // Run once on load

  const saveTasks = (newTasks) => {
    setTasks(newTasks);
    localStorage.setItem(key, JSON.stringify(newTasks));
  };

  return [tasks, saveTasks];
}

// Helper to get week number
Date.prototype.getWeekNumber = function () {
  const d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
  return Math.ceil((((d - yearStart) / 86400000) + 1)/7)
}
