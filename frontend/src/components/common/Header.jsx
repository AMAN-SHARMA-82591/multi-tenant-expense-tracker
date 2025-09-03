import { HiMoon, HiSun } from "react-icons/hi";
import { useAuth } from "../utils/contextApi";
import { Link, useLocation } from "react-router";

export default function Header() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;
  const { logout, darkMode, toggleDarkMode } = useAuth();
  return (
    <header className="sticky top-0 z-40 border-b dark:bg-gray-800 dark:border-gray-700 bg-white border-gray-200">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-3">
          <div className="flex space-x-4">
            <Link
              to="/"
              className={`font-medium transition-colors duration-200 ${
                isActive("/")
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
              }`}
            >
              Home
            </Link>
            <Link
              to="/chat"
              className={`font-medium transition-colors duration-200 ${
                isActive("/chat")
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
              }`}
            >
              Chat
            </Link>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg transition-colors dark:hover:bg-gray-700 text-gray-600 hover:bg-gray-200 dark:text-gray-300"
          >
            {darkMode ? (
              <HiSun className="w-5 h-5" />
            ) : (
              <HiMoon className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
