import { HiMoon, HiSun } from "react-icons/hi";
import { useAuth } from "../utils/contextApi";

export default function DarkModeToggle({ style }) {
  const { toggleDarkMode, darkMode } = useAuth();
  return (
    <button
      title={darkMode ? "Light Mode" : "Dark Mode"}
      onClick={toggleDarkMode}
      style={style}
      className="p-2 rounded-lg transition-colors dark:hover:bg-gray-700 text-gray-600 hover:bg-gray-200 dark:text-gray-300"
    >
      {darkMode ? (
        <HiSun className="w-5 h-5" />
      ) : (
        <HiMoon className="w-5 h-5" />
      )}
    </button>
  );
}
