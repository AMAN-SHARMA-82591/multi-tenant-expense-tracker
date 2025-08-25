import { useState } from "react";
import {
  HiUserGroup,
  HiDotsVertical,
  HiPhone,
  HiVideoCamera,
} from "react-icons/hi";
import { useChat } from "../utils/contextApi";

const ChatHeader = ({ chat }) => {
  const { darkMode, currentUser } = useChat();
  const [showMenu, setShowMenu] = useState(false);

  const isGroup = chat.type === "group";
  const memberCount = chat.members?.length || 0;
  const isAdmin = chat.admins?.includes(currentUser.id);

  const getDisplayName = () => {
    if (isGroup) return chat.name;
    return chat.username || chat.name;
  };

  const getSubtitle = () => {
    if (isGroup) {
      return `${memberCount} member${memberCount !== 1 ? "s" : ""}${
        chat.description ? ` • ${chat.description}` : ""
      }`;
    }
    return chat.status === "online" ? "Online" : "Offline";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "away":
        return "bg-yellow-500";
      case "offline":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div
      className={`flex items-center justify-between p-4 border-b ${
        darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
      }`}
    >
      <div className="flex items-center space-x-3">
        {/* Avatar */}
        <div className="relative">
          {isGroup ? (
            <div
              className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                darkMode ? "bg-gray-600" : "bg-gray-200"
              }`}
            >
              <HiUserGroup
                className={`w-6 h-6 ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              />
            </div>
          ) : (
            <div className="relative">
              <img
                src={chat.avatar}
                alt={getDisplayName()}
                className="w-12 h-12 rounded-full object-cover"
              />
              {chat.status && (
                <div
                  className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 ${
                    darkMode ? "border-gray-800" : "border-white"
                  } ${getStatusColor(chat.status)}`}
                />
              )}
            </div>
          )}
        </div>

        {/* Chat Info */}
        <div className="flex-1 min-w-0">
          <h3
            className={`font-semibold text-lg truncate ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {getDisplayName()}
          </h3>
          <p
            className={`text-sm truncate ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {getSubtitle()}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-2">
        {/* Call buttons (placeholder for future functionality) */}
        <button
          className={`p-2 rounded-lg transition-colors ${
            darkMode
              ? "hover:bg-gray-700 text-gray-300"
              : "hover:bg-gray-100 text-gray-600"
          }`}
          title="Voice call"
        >
          <HiPhone className="w-5 h-5" />
        </button>

        <button
          className={`p-2 rounded-lg transition-colors ${
            darkMode
              ? "hover:bg-gray-700 text-gray-300"
              : "hover:bg-gray-100 text-gray-600"
          }`}
          title="Video call"
        >
          <HiVideoCamera className="w-5 h-5" />
        </button>

        {/* Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className={`p-2 rounded-lg transition-colors ${
              darkMode
                ? "hover:bg-gray-700 text-gray-300"
                : "hover:bg-gray-100 text-gray-600"
            }`}
          >
            <HiDotsVertical className="w-5 h-5" />
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <div
              className={`absolute right-0 top-full mt-2 w-48 rounded-lg shadow-lg border ${
                darkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              } z-50`}
            >
              <div className="py-1">
                {isGroup && (
                  <>
                    <button
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      View group info
                    </button>
                    <button
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Add members
                    </button>
                    {isAdmin && (
                      <button
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Manage group
                      </button>
                    )}
                    <div
                      className={`border-t ${
                        darkMode ? "border-gray-700" : "border-gray-200"
                      }`}
                    />
                  </>
                )}

                <button
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Mute notifications
                </button>
                <button
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Clear chat
                </button>
                <button
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Block user
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
};

export default ChatHeader;
