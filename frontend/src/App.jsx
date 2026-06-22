import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Explore from "./pages/Explore";
import HomestayDetails from "./pages/HomestayDetails";
import Booking from "./pages/Booking";
import TravelPlanner from "./pages/TravelPlanner";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import UIShowcase from "./pages/UIShowcase";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-teal-50 dark:bg-slate-900 transition-colors duration-300">
      <Navbar />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/homestay/:id" element={<HomestayDetails />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/travelplanner" element={<TravelPlanner />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/settings" element={<Settings />} />

          <Route path="/uishowcase" element={<UIShowcase />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
