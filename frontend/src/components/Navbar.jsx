import { useState } from "react";
import { Link } from "react-router-dom";
import { CircleUserRound, Menu, X } from "lucide-react";

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="bg-teal-700 shadow-md px-4 md:px-10 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            TravelTrail
          </h1>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-white hover:text-teal-300">
              Home
            </Link>

            <Link to="/about" className="text-white hover:text-teal-300">
              About Us
            </Link>

            <Link to="/rooms" className="text-white hover:text-teal-300">
              Rooms
            </Link>

            <Link to="/contact" className="text-white hover:text-teal-300">
              Contact
            </Link>

            <CircleUserRound
              size={28}
              className="cursor-pointer text-white hover:text-teal-300"
            />
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
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-56 bg-teal-700 z-50 transform transition-transform duration-300 ${
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
            className="text-white text-lg py-3 hover:text-teal-300"
            onClick={() => setOpen(false)}
          >
            Home
          </Link>

          <Link
            to="/about"
            className="text-white text-lg py-3 hover:text-teal-300"
            onClick={() => setOpen(false)}
          >
            About Us
          </Link>

          <Link
            to="/rooms"
            className="text-white text-lg py-3 hover:text-teal-300"
            onClick={() => setOpen(false)}
          >
            Rooms
          </Link>

          <Link
            to="/contact"
            className="text-white text-lg py-3 hover:text-teal-300"
            onClick={() => setOpen(false)}
          >
            Contact
          </Link>

          <div className="mt-6 pt-6 border-t border-teal-500">
            <Link
              to="/"
              className="text-white text-lg hover:text-teal-300"
              onClick={() => setOpen(false)}
            >
              My Profile
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
