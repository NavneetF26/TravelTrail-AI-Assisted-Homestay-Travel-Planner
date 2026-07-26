import { FaGithub } from "react-icons/fa6";

function Footer() {
  return (
    <footer className="mt-10 bg-teal-800 text-teal-100">
      <div className="flex justify-center py-4">
        <a
          href="https://github.com/NavneetF26/TravelTrail-AI-Assisted-Homestay-Travel-Planner"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-teal-100 transition hover:text-white"
        >
          <FaGithub size={22} />
          <span className="text-sm font-medium">GitHub</span>
        </a>
      </div>

      <div className="border-t border-teal-700 py-3 text-center text-sm text-teal-200">
        © {new Date().getFullYear()} TravelTrail. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
