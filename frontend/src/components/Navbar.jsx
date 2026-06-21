import { useState } from "react";
import { Link } from "react-router-dom";
import { CircleUserRound, Menu, X } from "lucide-react";

function Navbar() {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <>
      <nav className="relative z-50 bg-teal-800 shadow-md px-4 md:px-10 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            TravelTrail
          </h1>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-white hover:text-teal-300">
              Home
            </Link>

            <Link to="/explore" className="text-white hover:text-teal-300">
              Explore
            </Link>

            <Link
              to="/travelplanner"
              className="text-white hover:text-teal-300"
            >
              Travel Planner
            </Link>

            <Link to="/login" className="text-white hover:text-teal-300">
              Login
            </Link>
          </div>

          {/* Desktop Profile */}
          <div className="relative z-9999 hidden md:block">
            <button onClick={() => setProfileOpen(!profileOpen)}>
              <CircleUserRound
                size={30}
                className="cursor-pointer text-white hover:text-teal-300"
              />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-3 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800 z-9999">
                <div className="border-b border-gray-200 px-4 py-3 dark:border-slate-700">
                  <p className="font-semibold dark:text-white">John Doe</p>

                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    john@example.com
                  </p>
                </div>

                <Link
                  to="/dashboard"
                  onClick={() => setProfileOpen(false)}
                  className="block px-4 py-3 hover:bg-gray-100 dark:text-white dark:hover:bg-slate-700"
                >
                  Dashboard
                </Link>

                <Link
                  to="/settings"
                  onClick={() => setProfileOpen(false)}
                  className="block px-4 py-3 hover:bg-gray-100 dark:text-white dark:hover:bg-slate-700"
                >
                  Settings
                </Link>

                <Link
                  to="/login"
                  onClick={() => setProfileOpen(false)}
                  className="block px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-slate-700"
                >
                  Logout
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setOpen(true)}
          >
            <Menu size={30} />
          </button>
        </div>
      </nav>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-64 bg-teal-700 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-end p-4">
          <button onClick={() => setOpen(false)}>
            <X size={30} className="text-white" />
          </button>
        </div>

        <div className="flex flex-col px-8">
          <Link
            to="/"
            className="py-3 text-lg text-white hover:text-teal-300"
            onClick={() => setOpen(false)}
          >
            Home
          </Link>

          <Link
            to="/explore"
            className="py-3 text-lg text-white hover:text-teal-300"
            onClick={() => setOpen(false)}
          >
            Explore
          </Link>

          <Link
            to="/travelplanner"
            className="py-3 text-lg text-white hover:text-teal-300"
            onClick={() => setOpen(false)}
          >
            Travel Planner
          </Link>

          <Link
            to="/login"
            className="py-3 text-lg text-white hover:text-teal-300"
            onClick={() => setOpen(false)}
          >
            Login
          </Link>

          <div className="mt-6 space-y-3 border-t border-teal-500 pt-6">
            <Link
              to="/dashboard"
              className="block text-lg text-white hover:text-teal-300"
              onClick={() => setOpen(false)}
            >
              Dashboard
            </Link>

            <Link
              to="/settings"
              className="block text-lg text-white hover:text-teal-300"
              onClick={() => setOpen(false)}
            >
              Settings
            </Link>

            <Link
              to="/login"
              className="block text-lg text-red-200 hover:text-red-100"
              onClick={() => setOpen(false)}
            >
              Logout
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
