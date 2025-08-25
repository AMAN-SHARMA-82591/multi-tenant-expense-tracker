import { useEffect, useRef } from "react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import ChatHeader from "./ChatHeader";
import { HiArrowLeft } from "react-icons/hi";
import { useChat } from "../utils/contextApi";

const ChatWindow = () => {
  const {
    currentChat,
    darkMode,
    sidebarOpen,
    toggleSidebar,
    getCurrentChatMessages,
    socketActions,
  } = useChat();

  // const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const messages = getCurrentChatMessages();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Join chat room when chat changes
  useEffect(() => {
    if (currentChat) {
      socketActions.joinChat(currentChat.id);
      return () => {
        socketActions.leaveChat(currentChat.id);
      };
    }
  }, [currentChat?.id, currentChat, socketActions]);

  const handleTyping = (isUserTyping) => {
    // setIsTyping(isUserTyping);
    if (isUserTyping) {
      socketActions.sendTyping(currentChat.id);
    } else {
      socketActions.stopTyping(currentChat.id);
    }
  };

  if (!currentChat) {
    return null;
  }

  return (
    <div
      className={`flex flex-col h-full ${
        darkMode ? "bg-gray-900" : "bg-white"
      }`}
    >
      {/* Chat Header */}
      <ChatHeader chat={currentChat} />

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden">
        <MessageList
          messages={messages}
          chatId={currentChat.id}
          onTyping={handleTyping}
        />
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div
        className={`border-t ${
          darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
        }`}
      >
        <MessageInput chatId={currentChat.id} onTyping={handleTyping} />
      </div>

      {/* Mobile back button overlay */}
      {!sidebarOpen && (
        <button
          onClick={toggleSidebar}
          className={`md:hidden absolute top-20 left-4 z-30 p-2 rounded-full shadow-lg ${
            darkMode
              ? "bg-gray-800 text-white hover:bg-gray-700"
              : "bg-white text-gray-900 hover:bg-gray-50"
          }`}
        >
          <HiArrowLeft className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default ChatWindow;
