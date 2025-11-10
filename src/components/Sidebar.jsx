import { useState } from "react";
import { FiCheckCircle } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import { FiGrid, FiSun, FiCalendar, FiClock } from "react-icons/fi";

const links = [
    { name: "Dashboard", icon: FiGrid, path: "/dashboard" },
    { name: "Daily", icon: FiSun, path: "/daily" },
    { name: "Weekly", icon: FiCalendar, path: "/weekly" },
    { name: "Monthly", icon: FiClock, path: "/monthly" },
];

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <>
            {/* Mobile Top Bar */}
            <div className="md:hidden flex items-center justify-between p-4 bg-white shadow-md">
                <div className="flex mb-2 items-center">
                    <FiCheckCircle className="text-green-500 text-lg mr-1" />
                    <span className="hidden md:block text-xl text-sky-500 font-bold">Better </span>
                    <span className="hidden md:block text-xl text-green-500 font-bold">Planner</span>
                </div>
                <button onClick={() => setIsOpen(!isOpen)}>
                    <span className="text-2xl">&#9776;</span> {/* hamburger icon */}
                </button>
            </div>

            {/* Sidebar */}
            <div className={`bg-white md:flex flex-col w-64 p-4 shadow-md
                       absolute md:relative h-full top-0 left-0
                       transform ${isOpen ? "translate-x-0" : "-translate-x-full"} 
                       transition-transform duration-300 md:translate-x-0`}>
                <div className="flex mb-5 items-center">
                    <FiCheckCircle className="text-green-500 text-lg mr-1" />
                    <span className="hidden md:block text-xl text-sky-500 font-bold">Better </span>
                    <span className="hidden md:block text-xl text-green-500 font-bold">Planner</span>
                </div>

                <nav className="flex flex-col gap-3">
                    {links.map(({ name, icon: Icon, path }) => (
                        <NavLink
                            key={name}
                            to={path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 p-2 rounded hover:bg-green-100 transition-colors ${isActive ? "bg-green-200 font-semibold" : ""
                                }`
                            }
                        >
                            <Icon className="text-green-500" size={20} />
                            {name}
                        </NavLink>
                    ))}
                </nav>
            </div>
        </>
    );
}
