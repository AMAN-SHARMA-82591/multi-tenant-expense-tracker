import { HiUserCircle } from "react-icons/hi";
import { useAuth } from "../utils/contextApi";
import { Link, useLocation } from "react-router";
import DarkModeToggle from "./DarkModeToggle";

export default function Header() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;
  const { user, logout } = useAuth();
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
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
          {/* Dark Mode Toggle */}
          <DarkModeToggle />
          <div className="flex items-center space-x-2">
            <h2 className="font-medium text-gray-800 dark:text-gray-200">
              {user.username}
            </h2>
            <HiUserCircle className="text-gray-600 dark:text-gray-300 w-5 h-5" />
          </div>
        </div>
      </div>
    </header>
  );
}
