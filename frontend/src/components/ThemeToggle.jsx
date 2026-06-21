import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

function ThemeToggle() {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="
        p-2
        rounded-lg
        border
        border-gray-300
        dark:border-gray-600
        bg-white
        dark:bg-slate-800
        text-gray-700
        dark:text-yellow-300
        hover:bg-gray-100
        dark:hover:bg-slate-700
        transition
      "
    >
      {darkMode ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}

export default ThemeToggle;
