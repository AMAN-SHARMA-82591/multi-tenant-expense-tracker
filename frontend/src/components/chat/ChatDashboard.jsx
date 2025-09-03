import { useState, useEffect } from "react";
// import { toast } from "react-hot-toast";
import { HiMenu, HiPlus, HiMoon, HiSun } from "react-icons/hi";
import { io } from "socket.io-client";
import ChatWindow from "./ChatWindow";
import ChatSidebar from "./ChatSidebar";
import CreateGroupModal from "./CreateGroupModal";
import { useAuth, useChat } from "../utils/contextApi";
import { useRef } from "react";

const ChatDashboard = () => {
  const {
    currentChat,
    toggleSidebar,
    conversations,
    getUnreadCount,
    addNotification,
  } = useChat();
  const { user } = useAuth();
  const socket = useRef();
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [totalUnread, setTotalUnread] = useState(0);

  // Calculate total unread messages
  useEffect(() => {
    const total = conversations.reduce((sum, conv) => {
      return sum + getUnreadCount(conv.id);
    }, 0);
    setTotalUnread(total);
  }, [conversations, getUnreadCount]);

  // Auto-close sidebar on mobile when chat is selected
  useEffect(() => {
    if (currentChat && window.innerWidth < 768) {
      toggleSidebar();
    }
  }, [currentChat, toggleSidebar]);

  useEffect(() => {
    if (user) {
      socket.current = io(import.meta.env.VITE_APP_BACKEND_HOST);
      socket.current.emit("setup", user);
    }
  }, [user]);

  const handleGroupCreated = (groupData) => {
    setShowCreateGroup(false);
    addNotification({
      type: "success",
      title: "Group Created",
      message: `${groupData.name} has been created successfully!`,
    });
  };

  return (
    <div className="min-h-screen transition-colors duration-200 dark:bg-gray-900 dark:text-white bg-gray-50 text-gray-900">
      {/* Main Content */}
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <div className="transition-all duration-300 w-80 -translate-x-full md:translate-x-0">
          <ChatSidebar />
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col">
          {currentChat ? (
            <ChatWindow />
          ) : (
            <div className="flex-1 flex items-center justify-center dark:bg-gray-900 bg-gray-50">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center dark:bg-gray-800 dark:text-gray-400 bg-gray-200 text-gray-500">
                  <svg
                    className="w-12 h-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 dark:text-white text-gray-900">
                  Welcome to Chat
                </h3>
                <p className="dark:text-gray-400 text-gray-600">
                  Select a conversation to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Group Modal */}
      {showCreateGroup && (
        <CreateGroupModal
          onClose={() => setShowCreateGroup(false)}
          onGroupCreated={handleGroupCreated}
        />
      )}

      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50">
        {/* Toast notifications will be rendered here by react-hot-toast */}
      </div>
    </div>
  );
};

export default ChatDashboard;
