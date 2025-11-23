import Loader from "@/components/Loader";
import LoginModal from "@/components/LoginModal";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import { FaLinkedin, FaTwitter } from "react-icons/fa";
import { SiBuymeacoffee } from "react-icons/si";
import { toast } from "react-toastify";

export default function Home() {
  const { user } = useAuth();

  const router = useRouter();

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [clicked, setClicked] = useState(false)

  const handleGetStarted = () => {
    if (!user) {
      setIsLoginOpen(true);

      return;
    }
    router.push("/dashboard");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill all the fields.", {
        toastId: "Please fill all the fields.",
      });
      return;
    }

    setClicked(true)

    const data = {
      name: formData.name,
      email: formData.email,
      message: formData.message,
    }

    await axios.post(`${process.env.NEXT_PUBLIC_HOST}/api/PostReq/send-message`, {
      data
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    }).then((response) => {
      if (response.status === 200) {
        toast.success("Thank you for your message. We'll get back to you.")

        setFormData({ name: "", email: "", message: "" });
      }
      else {
        toast.error("Error sending message", {
          toastId: "Error sending message"
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

  return (
    <>
      <main className="font-sans bg-gray-50 min-h-screen text-gray-800">
        <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

        {/* HERO */}
        <section className="px-6 py-10 text-center max-w-3xl mx-auto">
          <h2 className="text-4xl font-extrabold leading-tight">
            <span className="text-green-500">A Simple Planner</span> <span className="text-sky-500">Built for Consistency</span>
          </h2>

          <p className="text-lg mt-4 text-gray-600">
            Plan your day, week, and month — all synced in the cloud.
            Get reminders exactly when you need them. Stay on track effortlessly.
          </p>

          <button
            onClick={handleGetStarted}
            className="mt-5 relative inline-block px-6 py-3 font-semibold text-white 
             rounded-xl overflow-hidden bg-sky-500
             before:absolute before:top-0 before:left-0 before:h-full before:w-0 
             before:bg-green-500 before:z-0 before:transition-all before:duration-500
             hover:before:w-full
             transition-colors duration-500 cursor-pointer"
          >
            <span className="relative z-10">Get Started</span>
          </button>

        </section>

        {/* FEATURES */}
        <section className="px-6 py-12 bg-white">
          <h3 className="text-3xl font-bold text-center mb-12 text-green-500">Why BetterPlanner?</h3>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">

            {[
              { title: "Cloud Synced Tasks", desc: "Your tasks stay updated across all devices instantly." },
              { title: "Daily Planning", desc: "Build habits and plan your day with clarity." },
              { title: "Weekly Structure", desc: "Organize routines and content schedules with ease." },
              { title: "Monthly Goals", desc: "Track long-term goals and bigger commitments." },
              { title: "Heatmap Streaks", desc: "Visualize your consistency with a beautiful streak heatmap." },
              { title: "Smart Reminders", desc: "Set a time for any task — get notified exactly when you need it." }
            ].map((feature, idx) => (
              <div key={idx} className="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition border-l-4 border-sky-500">
                <h4 className="text-xl font-semibold text-green-500">{feature.title}</h4>
                <p className="mt-2 text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CONTACT FORM */}
        <section className="px-6 py-12 bg-gray-50 text-gray-800">
          <h3 className="text-3xl font-bold text-center text-sky-500">Get in Touch</h3>
          <p className="text-center mt-2 text-gray-600">Have questions or suggestions? Send me a message!</p>

          <form className="mt-8 max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              disabled={clicked}
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <input
              disabled={clicked}
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <textarea
              disabled={clicked}
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 md:col-span-2"
              rows={4}
            ></textarea>
            <button
              onClick={handleSubmit}
              type="submit"
              disabled={(!formData.name || !formData.email || !formData.message) || clicked}
              className={`relative md:col-span-2 px-6 py-3 font-semibold rounded-xl overflow-hidden
    text-white
    bg-sky-500
    before:absolute before:top-0 before:left-0 before:h-full before:w-0 
    before:bg-green-500 before:z-0 before:transition-all before:duration-500
    hover:before:w-full
    transition-colors duration-500
    cursor-pointer
    disabled:bg-gray-300
    disabled:text-slate-500
    disabled:before:w-0
    disabled:hover:before:w-0
    disabled:cursor-not-allowed
  `}
            >
              <span className="relative z-10">{clicked ? "Sending..." : "Send Message"}</span>
            </button>
          </form>
        </section>

        {/* Footer + Social Icons */}
        <div className="md:hidden mb-20 md:mb-0">
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
            <a href="https://www.buymeacoffee.com/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-yellow-500 transition-colors">
              <SiBuymeacoffee size={20} />
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
