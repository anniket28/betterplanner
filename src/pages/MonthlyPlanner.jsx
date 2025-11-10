import React, { useState } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { useLocalStorageWithReset } from "../hooks/useLocalStorageWithReset";

export default function MonthlyPlanner(props) {
  const { today } = props

  const [tasks, setTasks] = useLocalStorageWithReset("monthlyTasks", "monthly");
  const [newTask, setNewTask] = useState("");
  const [repeat, setRepeat] = useState(false);
  const [category, setCategory] = useState("General");
  const [priority, setPriority] = useState("Medium");

  const categories = ["General", "Health", "Work", "Learning", "Personal"];
  const priorities = ["High", "Medium", "Low"];

  const priorityColors = {
    High: "bg-red-500",
    Medium: "bg-yellow-500",
    Low: "bg-blue-500",
  };

  const addTask = () => {
    if (!newTask.trim()) return;
    const task = {
      id: Date.now(),
      title: newTask,
      repeat,
      done: false,
      category,
      priority,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setTasks([...tasks, task]);
    setNewTask("");
    setRepeat(false);
    setCategory("General");
    setPriority("Medium");
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, done: !task.done } : task));
  };

  const deleteTask = (id) => setTasks(tasks.filter(task => task.id !== id));

  const completedCount = tasks.filter(t => t.done).length;
  const progress = tasks.length ? (completedCount / tasks.length) * 100 : 0;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold mb-4">Monthly Planner</h1>
        <p className="text-gray-600 mb-6">{today}</p>
      </div>


      {/* Add Task */}
      <div className="flex flex-col md:flex-row gap-2 mb-4">
        <input
          type="text"
          placeholder="Add new monthly task..."
          className="flex-1 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
        />

        {/* Category Selector */}
        <select
          className="p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>

        {/* Priority Selector */}
        <select
          className="p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          {priorities.map(pri => <option key={pri} value={pri}>{pri}</option>)}
        </select>

        <button
          onClick={addTask}
          className="bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600 flex items-center gap-1"
        >
          <FiPlus /> Add
        </button>
      </div>

      {/* Repeat Monthly */}
      <label className="flex items-center gap-2 mb-4">
        <input type="checkbox" checked={repeat} onChange={() => setRepeat(!repeat)} />
        Repeat every month
      </label>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-gray-200 h-2 rounded-full">
          <div className="bg-green-500 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
        <p className="text-gray-600 mt-1">{completedCount} / {tasks.length} tasks completed</p>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {tasks.length === 0 && <p className="text-gray-500">No tasks for this month yet.</p>}
        {tasks.map(task => (
          <div key={task.id} className="flex items-center justify-between bg-white p-3 rounded-lg shadow">
            <div className="flex items-center gap-3">
              <input type="checkbox" checked={task.done} onChange={() => toggleTask(task.id)} />
              <span className={task.done ? "line-through text-gray-400" : ""}>{task.title}</span>

              {/* Category Badge */}
              <span className="text-sm text-gray-700 px-1 rounded bg-gray-200 dark:bg-gray-700">{task.category}</span>

              {/* Priority Badge */}
              <span className={`text-sm text-white px-2 py-0.5 rounded ${priorityColors[task.priority]}`}>
                {task.priority}
              </span>

              {task.repeat && <span className="text-sm text-green-500 ml-2">(Repeat)</span>}
            </div>
            <button onClick={() => deleteTask(task.id)} className="text-red-500 hover:text-red-700">
              <FiTrash2 />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
