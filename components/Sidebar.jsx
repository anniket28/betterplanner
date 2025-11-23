import Link from "next/link";
import { useRouter } from "next/router";
import { FiCheckCircle, FiGrid, FiSun, FiCalendar, FiClock, FiLogOut } from "react-icons/fi";
import { FaLinkedin, FaTwitter } from "react-icons/fa";
import { SiBuymeacoffee } from "react-icons/si";
import LoginModal from "./LoginModal";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

const links = [
    { name: "Home", icon: FiGrid, path: "/" },
    { name: "Dashboard", icon: FiGrid, path: "/dashboard" },
    { name: "Daily", icon: FiSun, path: "/daily" },
    { name: "Weekly", icon: FiCalendar, path: "/weekly" },
    { name: "Monthly", icon: FiClock, path: "/monthly" },
];

export default function Sidebar() {
    const { user, logout } = useAuth();

    const router = useRouter();

    const [isLoginOpen, setIsLoginOpen] = useState(false);

    const handleClick = (path) => {
        if (path !== "/" && !user) {
            setIsLoginOpen(true);

            return;
        }
        router.push(path);
    };

    return (
        <>
            <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

            {/* Desktop Sidebar */}
            <div className="bg-white hidden md:flex flex-col justify-between w-64 p-4 shadow-md h-screen mt-0">

                {/* Branding */}
                <div>
                    <div className="flex mb-5 items-center">
                        <FiCheckCircle className="text-green-500 text-lg mr-1" />
                        <Link href={"/"} passHref>
                            <span className="text-xl text-sky-500 font-bold">Better</span>
                            <span className="text-xl text-green-500 font-bold">Planner</span>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex flex-col gap-3">
                        {links.map(({ name, icon: Icon, path }) => (
                            <button
                                key={name}
                                onClick={() => handleClick(path)}
                                className={`flex items-center gap-3 p-2 rounded hover:bg-green-100 transition-colors cursor-pointer ${router.pathname === path ? "bg-green-200 font-semibold" : ""
                                    }`}
                            >
                                <Icon className="text-green-500" size={20} />
                                {name}
                            </button>
                        ))}
                        {user && (
                            <button onClick={logout}
                                className={`flex items-center gap-3 p-2 rounded hover:bg-green-100 transition-colors cursor-pointer`}>
                                <FiLogOut className="text-green-500" size={20} />
                                Logout
                            </button>
                        )}
                    </nav>
                </div>

                {/* Footer + Social Icons */}
                <div className="py-0 mb-5">
                    <footer className="text-center text-gray-500 text-sm">
                        Built with 💚 by AB Builds
                    </footer>

                    {/* Gray line */}
                    <div className="border-t border-gray-300 my-3"></div>

                    {/* Social icons */}
                    <div className="flex justify-center gap-4">
                        <a href="https://www.linkedin.com/in/a-b-builds-76637a38a" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600 transition-colors">
                            <FaLinkedin size={20} />
                        </a>
                        <a href="https://x.com/AB_Builds" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-400 transition-colors">
                            <FaTwitter size={20} />
                        </a>
                        <a href="https://www.buymeacoffee.com/abbuilds" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-yellow-500 transition-colors">
                            <SiBuymeacoffee size={20} />
                        </a>
                    </div>
                </div>
            </div>

            {/* Mobile Bottom Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-md flex justify-around py-2 border-t z-50">
                {links.map(({ name, icon: Icon, path }) => (
                    <button onClick={() => handleClick(path)} key={name} className="flex flex-col items-center">
                        <Icon
                            size={22}
                            className={`${router.pathname === path ? "text-green-600" : "text-gray-500"}`}
                        />
                        <span className="text-[10px] text-gray-600 mt-1">{name}</span>
                    </button>
                ))}
                {user && (
                    <button className="flex flex-col items-center" onClick={logout}>
                        <FiLogOut size={20} />
                        <span className="text-[10px] text-gray-600 mt-1">Logout</span>
                    </button>
                )}
            </div>
        </>
    );
}
