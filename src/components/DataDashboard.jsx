import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { format, subDays } from "date-fns";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const COLORS = ["#ebedf0", "#c6e48b", "#7bc96f", "#239a3b", "#196127"];

export default function DataDashboard() {
  const [dailyTasks, setDailyTasks] = useState([]);
  const [weeklyTasks, setWeeklyTasks] = useState([]);
  const [monthlyTasks, setMonthlyTasks] = useState([]);
  const [completionMap, setCompletionMap] = useState({});
  const [completionChartData, setCompletionChartData] = useState({ labels: [], data: [] });

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPriority, setSelectedPriority] = useState("All");

  const categories = ["All", "General", "Health", "Work", "Learning", "Personal"];
  const priorities = ["All", "High", "Medium", "Low"];

  // Load tasks
  useEffect(() => {
    setDailyTasks(JSON.parse(localStorage.getItem("dailyTasks") || "[]"));
    setWeeklyTasks(JSON.parse(localStorage.getItem("weeklyTasks") || "[]"));
    setMonthlyTasks(JSON.parse(localStorage.getItem("monthlyTasks") || "[]"));
  }, []);

  // Build completion map for heatmap
  useEffect(() => {
    const map = {};
    const allTasks = [...dailyTasks, ...weeklyTasks, ...monthlyTasks].filter(t => {
      return (selectedCategory === "All" || t.category === selectedCategory) &&
        (selectedPriority === "All" || t.priority === selectedPriority);
    });

    allTasks.forEach(task => {
      const date = task.createdAt;
      if (!map[date]) map[date] = { done: 0, total: 0 };
      map[date].total += 1;
      if (task.done) map[date].done += 1;
    });

    setCompletionMap(map);
  }, [dailyTasks, weeklyTasks, monthlyTasks, selectedCategory, selectedPriority]);

  // Build completion chart data
  useEffect(() => {
    const allTasks = [...dailyTasks, ...weeklyTasks, ...monthlyTasks].filter(t => {
      return (selectedCategory === "All" || t.category === selectedCategory) &&
        (selectedPriority === "All" || t.priority === selectedPriority);
    });

    const allDates = new Set(allTasks.map(t => t.createdAt));
    const sortedDates = Array.from(allDates).sort();

    const labels = [];
    const data = [];

    sortedDates.forEach(date => {
      const tasksOnDate = allTasks.filter(t => t.createdAt === date);
      if (tasksOnDate.length === 0) return;
      const completed = tasksOnDate.filter(t => t.done).length;
      const percent = Math.round((completed / tasksOnDate.length) * 100);
      labels.push(date);
      data.push(percent);
    });

    setCompletionChartData({ labels, data });
  }, [dailyTasks, weeklyTasks, monthlyTasks, selectedCategory, selectedPriority]);

  const getColor = (percent) => {
    if (percent === 0) return COLORS[0];
    if (percent <= 25) return COLORS[1];
    if (percent <= 50) return COLORS[2];
    if (percent <= 75) return COLORS[3];
    return COLORS[4];
  };

  // Last 30 days for heatmap
  const days = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), 29 - i);
    const formatted = format(date, "yyyy-MM-dd");
    const record = completionMap[formatted];
    const percent = record ? Math.round((record.done / record.total) * 100) : 0;
    return { date: formatted, percent };
  });

  const chartData = {
    labels: completionChartData.labels,
    datasets: [
      {
        label: "Completion %",
        data: completionChartData.data,
        backgroundColor: "rgba(34,197,94,0.7)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Overall Task Completion Over Time" },
    },
    scales: { y: { beginAtZero: true, max: 100 } },
  };

  return (
    <div className="py-6 px-0 bg-gray-50 min-h-fit">
      {/* Filters */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <select
          className="p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>

        <select
          className="p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
          value={selectedPriority}
          onChange={(e) => setSelectedPriority(e.target.value)}
        >
          {priorities.map(pri => <option key={pri} value={pri}>{pri}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Chart */}
        <div>
          {completionChartData.labels.length === 0 ? (
            <p className="text-gray-500">No data to show yet for selected filters.</p>
          ) : (
            <Bar data={chartData} options={chartOptions} />
          )}
        </div>

        {/* Heatmap */}
        <div>
        <h2 className="text-xl font-semibold mb-4">Habit Heatmap (Last 30 Days)</h2>
        <div className="grid grid-cols-7 gap-1">
          {days.map((day) => (
            <div
              key={day.date}
              className="w-8 h-8 rounded-sm"
              style={{ backgroundColor: getColor(day.percent) }}
              title={`${day.date}: ${day.percent}% completed`}
            />
          ))}
        </div>
      </div>
      </div>
    </div>
  );
}
