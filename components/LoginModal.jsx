import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
// import { FaGoogle } from "react-icons/fa";
import { useRouter } from "next/router";

export default function LoginModal({ isOpen, onClose }) {
    const { login } = useAuth();

    const router = useRouter()

    const [step, setStep] = useState(1); // 1: email, 2: OTP
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);

    // Reset state when modal closes
    useEffect(() => {
        if (!isOpen) {
            setStep(1);
            setEmail("");
            setOtp("");
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const sendOtp = async () => {
        if (!email) return toast.error("Enter email", {
            toastId: "Enter email"
        });
        try {
            setLoading(true);
            await axios.post("/api/auth/send-otp", { email });
            toast.success("OTP sent to your email!", { toastId: "OTP sent to your email!" });
            setStep(2);
        } catch (err) {
            console.error(err);
            toast.error("Failed to send OTP", { toastId: "Failed to send OTP" });
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async () => {
        if (!otp) return toast.error("Enter OTP", { toastId: "Enter OTP" });
        try {
            setLoading(true);
            await login(email, otp);
            toast.success("Logged in successfully!", { toastId: "Logged in successfully!" });
            onClose();

            router.push("/dashboard")
        } catch (err) {
            console.error(err);
            toast.error("Login failed", { toastId: "Login failed" });
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = "/api/auth/google"; // your Google OAuth endpoint
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Blurred background */}
            <div
                style={{ backgroundColor: "rgb(0,0,0,0.5)" }}
                className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className="relative bg-white rounded-xl w-full max-w-md p-6 shadow-lg z-10 transition-transform transform scale-95 animate-scale-in">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                    <FiX size={20} />
                </button>

                <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
                    Login
                </h2>

                {/* Step Content */}
                <div className="transition-all duration-500">
                    {step === 1 && (
                        <div className="flex flex-col gap-4 animate-fade-in">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                            />
                            <button
                                onClick={sendOtp}
                                disabled={loading}
                                className="bg-sky-500 text-white py-2 rounded-lg hover:bg-sky-600 transition-colors cursor-pointer"
                            >
                                {loading ? "Sending..." : "Send OTP"}
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="flex flex-col gap-4 animate-fade-in">
                            <p className="text-gray-600 text-sm text-center">
                                OTP sent to <span className="font-medium">{email}</span>
                            </p>
                            <input
                                type="password"
                                placeholder="Enter OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                            />
                            <button
                                onClick={handleLogin}
                                disabled={loading}
                                className="bg-sky-500 text-white py-2 rounded-lg hover:bg-sky-600 transition-colors cursor-pointer"
                            >
                                {loading ? "Verifying..." : "Login"}
                            </button>
                        </div>
                    )}
                </div>

                {/* OR Separator */}
                {/* <div className="flex items-center my-4">
                    <hr className="flex-grow border-gray-300" />
                    <span className="px-2 text-gray-500 text-sm">OR</span>
                    <hr className="flex-grow border-gray-300" />
                </div> */}

                {/* Google Login */}
                {/* <button
                    onClick={handleGoogleLogin}
                    className="w-full flex items-center justify-center gap-2 py-2 border rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                >
                    <FaGoogle size={20} />
                    Continue with Google
                </button> */}
            </div>

            {/* Tailwind Animations */}
            <style jsx>{`
        @keyframes scale-in {
          0% {
            transform: scale(0.95);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out forwards;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease forwards;
        }
      `}</style>
        </div>
    );
}
