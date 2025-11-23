import Sidebar from "@/components/Sidebar";
import { AuthProvider } from "@/context/AuthContext";
import "@/styles/globals.css";
import NextNProgress from "nextjs-progressbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Head from "next/head";

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Head>
        {/* Title & Meta */}
        <title>BetterPlanner — A planner for your Better Self</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="BetterPlanner helps you plan daily, weekly & monthly goals, track priorities, and visualize progress with charts and a heatmap."
        />

        {/* Open Graph */}
        <meta property="og:title" content="BetterPlanner — A planner for your Better Self" />
        <meta
          property="og:description"
          content="BetterPlanner helps you plan daily, weekly & monthly goals, track priorities, and visualize progress with charts and a heatmap."
        />
        <meta property="og:image" content="/betterplanner.png" />
        <meta property="og:url" content="https://betterplanner.vercel.app" />
        <meta property="og:type" content="website" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="BetterPlanner — A planner for your Better Self" />
        <meta
          name="twitter:description"
          content="BetterPlanner helps you plan daily, weekly & monthly goals, track priorities, and visualize progress with charts and a heatmap."
        />
        <meta name="twitter:image" content="/betterplanner.png" />
      </Head>

      {/* Progress bar */}
      <NextNProgress color="lab(70.5521% -66.5147 45.8073)" />

      {/* Toast notifications */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {/* Layout */}
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 bg-gray-50 p-6 overflow-auto">
          <Component {...pageProps} />
        </main>
      </div>
    </AuthProvider>
  );
}
