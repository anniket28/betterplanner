
import React from 'react'
import { FiSun, FiCalendar, FiClock, FiArrowRight } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
import { useLocalStorageWithReset } from "../hooks/useLocalStorageWithReset";
import DataDashboard from '../components/DataDashboard';

export default function Dashboard(props) {
  const { today } = props

  const navigate = useNavigate();

  // Load tasks from local storage
  const [dailyTasks] = useLocalStorageWithReset("dailyTasks", "daily");
  const [weeklyTasks] = useLocalStorageWithReset("weeklyTasks", "weekly");
  const [monthlyTasks] = useLocalStorageWithReset("monthlyTasks", "monthly");

  // Compute stats
  const dailyDone = dailyTasks.filter(t => t.done).length;
  const weeklyDone = weeklyTasks.filter(t => t.done).length;
  const monthlyDone = monthlyTasks.filter(t => t.done).length;

  const dailyProgress = dailyTasks.length ? (dailyDone / dailyTasks.length) * 100 : 0;
  const weeklyProgress = weeklyTasks.length ? (weeklyDone / weeklyTasks.length) * 100 : 0;
  const monthlyProgress = monthlyTasks.length ? (monthlyDone / monthlyTasks.length) * 100 : 0;

  const cardClass = "bg-white p-6 rounded-lg shadow flex flex-col justify-between hover:shadow-lg transition-shadow";

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Greeting */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Hi User,</h1>
          <p className="text-gray-600">Here’s your progress today!</p>
        </div>
        <p className="text-gray-600 mb-6">{today}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Daily */}
        <div className={cardClass}>
          <h2 className="text-xl font-semibold mb-2">Daily</h2>
          <p className="text-gray-600 mb-2">{dailyDone} / {dailyTasks.length} tasks completed</p>
          <div className="w-full bg-gray-200 h-2 rounded-full mb-4">
            <div className="bg-sky-500 h-2 rounded-full" style={{ width: `${dailyProgress}%` }}></div>
          </div>
          <button
            onClick={() => navigate("/daily")}
            className="text-sky-500 flex items-center gap-1 font-medium hover:underline"
          >
            Go to Daily <FiArrowRight />
          </button>
        </div>

        {/* Weekly */}
        <div className={cardClass}>
          <h2 className="text-xl font-semibold mb-2">Weekly</h2>
          <p className="text-gray-600 mb-2">{weeklyDone} / {weeklyTasks.length} tasks completed</p>
          <div className="w-full bg-gray-200 h-2 rounded-full mb-4">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: `${weeklyProgress}%` }}></div>
          </div>
          <button
            onClick={() => navigate("/weekly")}
            className="text-green-500 flex items-center gap-1 font-medium hover:underline"
          >
            Go to Weekly <FiArrowRight />
          </button>
        </div>

        {/* Monthly */}
        <div className={cardClass}>
          <h2 className="text-xl font-semibold mb-2">Monthly</h2>
          <p className="text-gray-600 mb-2">{monthlyDone} / {monthlyTasks.length} tasks completed</p>
          <div className="w-full bg-gray-200 h-2 rounded-full mb-4">
            <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${monthlyProgress}%` }}></div>
          </div>
          <button
            onClick={() => navigate("/monthly")}
            className="text-indigo-500 flex items-center gap-1 font-medium hover:underline"
          >
            Go to Monthly <FiArrowRight />
          </button>
        </div>
      </div>

      <DataDashboard />
    </div>
  );
}