import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import WeeklyPlanner from "./pages/WeeklyPlanner";
import DailyPlanner from "./pages/DailyPlanner";
import MonthlyPlanner from "./pages/MonthlyPlanner";
import { format } from "date-fns";

function App() {
  const today = format(new Date(), "EEEE, MMMM do, yyyy");

  return (
    <Router>
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <div className="flex-1 bg-gray-50 p-6 overflow-auto">
          <Routes>
            <Route path="/" element={<Dashboard today={today} />} />
            <Route path="/daily" element={<DailyPlanner today={today} />} />
            <Route path="/weekly" element={<WeeklyPlanner today={today} />} />
            <Route path="/monthly" element={<MonthlyPlanner today={today} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
