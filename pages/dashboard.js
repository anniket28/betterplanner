
import { FiArrowRight } from "react-icons/fi";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "@/components/Loader";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Streak from "@/components/Streak";
import Heatmap from "@/components/Heatmap";

export default function Dashboard() {
    const { user } = useAuth();

    const today = format(new Date(), "EEEE, MMMM do, yyyy");

    const [dailyTasks, setDailyTasks] = useState([])
    const [weeklyTasks, setWeeklyTasks] = useState([])
    const [monthlyTasks, setMonthlyTasks] = useState([])
    const [heatmap, setHeatmap] = useState([])
    const [streak, setStreak] = useState([])
    const [loading, setLoading] = useState(true)
    const [statsLoading, setStatsLoading] = useState(true)

    // Compute stats
    const dailyDone = dailyTasks.filter(t => t.isCompleted).length;
    const weeklyDone = weeklyTasks.filter(t => t.isCompleted).length;
    const monthlyDone = monthlyTasks.filter(t => t.isCompleted).length;

    const dailyProgress = dailyTasks.length ? (dailyDone / dailyTasks.length) * 100 : 0;
    const weeklyProgress = weeklyTasks.length ? (weeklyDone / weeklyTasks.length) * 100 : 0;
    const monthlyProgress = monthlyTasks.length ? (monthlyDone / monthlyTasks.length) * 100 : 0;

    const cardClass = "bg-white p-6 rounded-lg shadow flex flex-col justify-between hover:shadow-lg transition-shadow";

    const fetchTasks = async () => {
        axios.get(process.env.NEXT_PUBLIC_HOST + `/api/GetReq/tasks?type=All`, {
        }).then((response) => {
            if (response.status === 200) {
                setDailyTasks(response.data.dailyTasks)
                setWeeklyTasks(response.data.weeklyTasks)
                setMonthlyTasks(response.data.monthlyTasks)
                const formatted = Object.keys(response.data.heatmap).map(date => ({
                    date: date,
                    count: response.data[date]
                }));
                setHeatmap(formatted);
                setStreak(response.data.streak)
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

    useEffect(() => {
        fetchTasks()
    }, [])


    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Greeting */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Hi {user?.username}</h1>
                    <p className="text-gray-600">Here’s your progress today!</p>
                </div>
                <p className="text-gray-600 mb-6">{today}</p>
            </div>

            {loading && <Loader />}

            {!loading && <>
                <div className="grid md:grid-cols-3 gap-6">
                    {/* Daily */}
                    <div className={cardClass}>
                        <h2 className="text-xl font-semibold mb-2">Daily</h2>
                        <p className="text-gray-600 mb-2">{dailyDone} / {dailyTasks.length} tasks completed</p>
                        <div className="w-full bg-gray-200 h-2 rounded-full mb-4">
                            <div className="bg-sky-500 h-2 rounded-full" style={{ width: `${dailyProgress}%` }}></div>
                        </div>
                        <Link
                            href={"/daily"}
                            passHref
                            className="text-sky-500 flex items-center gap-1 font-medium hover:underline cursor-pointer"
                        >
                            Go to Daily <FiArrowRight />
                        </Link>
                    </div>

                    {/* Weekly */}
                    <div className={cardClass}>
                        <h2 className="text-xl font-semibold mb-2">Weekly</h2>
                        <p className="text-gray-600 mb-2">{weeklyDone} / {weeklyTasks.length} tasks completed</p>
                        <div className="w-full bg-gray-200 h-2 rounded-full mb-4">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: `${weeklyProgress}%` }}></div>
                        </div>
                        <Link
                            href={"/weekly"}
                            passHref
                            className="text-green-500 flex items-center gap-1 font-medium hover:underline cursor-pointer"
                        >
                            Go to Weekly <FiArrowRight />
                        </Link>
                    </div>

                    {/* Monthly */}
                    <div className={cardClass}>
                        <h2 className="text-xl font-semibold mb-2">Monthly</h2>
                        <p className="text-gray-600 mb-2">{monthlyDone} / {monthlyTasks.length} tasks completed</p>
                        <div className="w-full bg-gray-200 h-2 rounded-full mb-4">
                            <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${monthlyProgress}%` }}></div>
                        </div>
                        <Link
                            href={"/monthly"}
                            passHref
                            className="text-indigo-500 flex items-center gap-1 font-medium hover:underline cursor-pointer"
                        >
                            Go to Monthly <FiArrowRight />
                        </Link>
                    </div>
                </div>

                <div className="my-3">
                    <Streak streak={streak} />
                </div>

                <div className="my-3">
                    <Heatmap heatmap={heatmap} />
                </div>
            </>}
        </div>
    );
}
