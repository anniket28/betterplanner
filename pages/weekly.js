import Loader from "@/components/Loader";
import axios from "axios";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";

const weekdays = process.env.NEXT_PUBLIC_WEEKDAYS
    ? process.env.NEXT_PUBLIC_WEEKDAYS.split(",")
    : ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const categories = process.env.NEXT_PUBLIC_TASK_CATEGORIES
    ? process.env.NEXT_PUBLIC_TASK_CATEGORIES.split(",")
    : ["General", "Health", "Work", "Learning", "Personal", "Finance", "Relationships", "Spiritual"]

const priorities = process.env.NEXT_PUBLIC_TASK_PRIORITIES
    ? process.env.NEXT_PUBLIC_TASK_PRIORITIES.split(",")
    : ["High", "Medium", "Low"];

const priorityColors = {
    High: "bg-red-500",
    Medium: "bg-yellow-500",
    Low: "bg-blue-500",
};

export default function Weekly() {
    const today = format(new Date(), "EEEE, MMMM do, yyyy");

    const [tasks, setTasks] = useState([]);
    const [selectedDay, setSelectedDay] = useState(format(new Date(), "EEEE"));
    const [newTask, setNewTask] = useState("");
    const [repeat, setRepeat] = useState(false);
    const [category, setCategory] = useState("General");
    const [priority, setPriority] = useState("Medium");
    const [loading, setLoading] = useState(true)
    const [clicked, setClicked] = useState(false)

    const fetchTasks = async () => {
        axios.get(process.env.NEXT_PUBLIC_HOST + `/api/GetReq/tasks?type=Weekly`).then((response) => {
            if (response.status === 200) {
                setTasks(response.data)
            }
            else {
                toast.error("Error loading tasks", {
                    toastId: "Error loading tasks"
                })
            }
        }).catch((error) => {
            console.log(error)
            toast.error("Some error occurred", {
                toastId: "Some error occurred"
            })
        }).finally(() => {
            setLoading(false)
        })
    };

    const addTask = async () => {
        if (!newTask.trim()) return;

        setClicked(true)

        const data = {
            newTask,
            category,
            priority,
            type: "Weekly",
            day: selectedDay,
            repeat
        }

        await axios.post(`${process.env.NEXT_PUBLIC_HOST}/api/PostReq/task`, {
            data
        }, {
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((response) => {
            if (response.status === 200) {
                toast.success("Task added successfully")

                setNewTask("");
                setRepeat(false);
                setCategory("General");
                setPriority("Medium");

                fetchTasks();
            }
            else {
                toast.error("Error adding task", {
                    toastId: "Error adding task"
                })
            }
        }).catch((error) => {
            console.log(error)
            toast.error("Some error occurred", {
                toastId: "Some error occurred"
            })
        }).finally(() => {
            setClicked(false)
        })
    };

    const toggleTask = async (id) => {
        setClicked(true)

        await axios.put(`${process.env.NEXT_PUBLIC_HOST}/api/PostReq/task`, { id })
            .then((response) => {
                if (response.status === 200) {
                    fetchTasks();
                }
                else {
                    toast.error("Some error occurred", {
                        toastId: "Some error occurred"
                    })
                }
            }).catch((error) => {
                console.log(error)
                toast.error("Some error occurred", {
                    toastId: "Some error occurred"
                })
            }).finally(() => {
                setClicked(false)
            })
    };

    const deleteTask = async (id) => {
        setClicked(true)

        await axios.put(`${process.env.NEXT_PUBLIC_HOST}/api/PostReq/delete-task`, { id })
            .then((response) => {
                if (response.status === 200) {
                    toast.success("Task deleted successfully")

                    fetchTasks();
                }
                else {
                    toast.error("Error deleting task", {
                        toastId: "Error deleting task"
                    })
                }
            }).catch((error) => {
                console.log(error)
                toast.error("Some error occurred", {
                    toastId: "Some error occurred"
                })
            }).finally(() => {
                setClicked(false)
            })
    };

    const tasksForDay = tasks.filter(task => task.day === selectedDay);
    const completedCount = tasksForDay.filter(t => t.isCompleted).length;
    const progress = tasksForDay.length ? (completedCount / tasksForDay.length) * 100 : 0;

    useEffect(() => {
        fetchTasks();
    }, [])

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold mb-4">Weekly Planner</h1>
                <p className="text-gray-600 mb-6">{today}</p>
            </div>

            {loading && <Loader />}

            {!loading && <>
                <div className="flex gap-2 mb-4 flex-wrap">
                    {weekdays.map(day => {
                        const count = tasks.filter(task => task.day === day).length; // total tasks for this day
                        return (
                            <button
                                disabled={clicked}
                                key={day}
                                className={`relative px-4 py-2 rounded-lg ${day === selectedDay ? "bg-green-500 text-white" : "bg-white border border-gray-300 text-gray-700"
                                    } hover:bg-green-400 transition-colors cursor-pointer`}
                                onClick={() => setSelectedDay(day)}
                            >
                                {day}
                                {/* Always show badge, even if 0 */}
                                <span className="absolute -top-2 -right-2 bg-sky-500 text-white text-xs px-2 py-0.5 rounded-full">
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Add Task */}
                <div className="flex flex-col md:flex-row gap-2 mb-4">
                    <input
                        disabled={clicked}
                        type="text"
                        placeholder={`Add task for ${selectedDay}...`}
                        className="flex-1 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addTask()}
                    />

                    {/* Category Selector */}
                    <select
                        disabled={clicked}
                        className="p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>

                    {/* Priority Selector */}
                    <select
                        disabled={clicked}
                        className="p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                    >
                        {priorities.map(pri => <option key={pri} value={pri}>{pri}</option>)}
                    </select>

                    <button
                        disabled={clicked}
                        onClick={addTask}
                        className="bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600 flex items-center gap-1 cursor-pointer"
                    >
                        <FiPlus /> Add
                    </button>
                </div>

                {/* Repeat Weekly */}
                <div className="flex items-center gap-2 mb-4 ">
                    <label className="cursor-pointer">
                        <input className="cursor-pointer mr-2" disabled={clicked} type="checkbox" checked={repeat} onChange={() => setRepeat(!repeat)} />
                        Repeat every week
                    </label>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                    <div className="w-full bg-gray-200 h-2 rounded-full">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                    <p className="text-gray-600 mt-1">{completedCount} / {tasksForDay.length} tasks completed</p>
                </div>

                {/* Task List */}
                <div className="space-y-3 mb-12 md:mb-0">
                    {tasksForDay.length === 0 && <p className="text-gray-500">No tasks for {selectedDay} yet.</p>}
                    {tasksForDay.map(task => (
                        <div key={task._id} className="bg-white p-3 rounded-lg shadow">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <input className="cursor-pointer" disabled={clicked} type="checkbox" checked={task.isCompleted} onChange={() => toggleTask(task._id)} />
                                    <span className={task.isCompleted ? "line-through text-gray-400" : "text-slate-800"}>{task.title}</span>
                                </div>
                                <button disabled={clicked} onClick={() => deleteTask(task._id)} className="text-red-500 hover:text-red-700 cursor-pointer"><FiTrash2 /></button>
                            </div>
                            <div className="flex items-center justify-between mt-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-700 px-1 rounded bg-gray-200 dark:bg-gray-700">{task.category}</span>

                                    <span className={`text-xs text-white px-1 rounded ${priorityColors[task.priority]}`}>
                                        {task.priority}
                                    </span>

                                    {task.isRepeatable && <span className="text-xs text-green-500">(Repeat)</span>}
                                </div>

                                {<span className="text-xs text-gray-500 ml-2">{task.date}</span>}
                            </div>
                        </div>
                    ))}
                </div>
            </>}
        </div>
    );
}
