import { useState, useRef } from "react";
import {
  HiPaperClip,
  HiEmojiHappy,
  HiArrowCircleRight,
  HiX,
} from "react-icons/hi";
import FileUpload from "./FileUpload";
import { useChat } from "../utils/contextApi";

const MessageInput = ({ chatId, onTyping }) => {
  const { sendMessage } = useChat();
  const [message, setMessage] = useState("");
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  // const [typingTimeout, setTypingTimeout] = useState(null);

  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  // // Handle typing detection
  // useEffect(() => {
  //   if (typingTimeout) {
  //     clearTimeout(typingTimeout);
  //   }

  //   if (message.trim()) {
  //     if (!isTyping) {
  //       setIsTyping(true);
  //       onTyping?.(true);
  //     }

  //     const timeout = setTimeout(() => {
  //       setIsTyping(false);
  //       onTyping?.(false);
  //     }, 1000);

  //     setTypingTimeout(timeout);
  //   } else {
  //     setIsTyping(false);
  //     onTyping?.(false);
  //   }

  //   return () => {
  //     if (typingTimeout) {
  //       clearTimeout(typingTimeout);
  //     }
  //   };
  // }, [message, onTyping]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(chatId, message.trim());
      setMessage("");
      setIsTyping(false);
      onTyping?.(false);

      // Focus back to textarea
      textareaRef.current?.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setShowFileUpload(true);
    }
  };

  const handleFileUpload = (fileData) => {
    sendMessage(
      chatId,
      fileData.content || "Sent a file",
      fileData.type,
      fileData
    );
    setShowFileUpload(false);
    setMessage("");

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleEmojiClick = (emoji) => {
    setMessage((prev) => prev + emoji);
    textareaRef.current?.focus();
  };

  const emojis = ["😊", "😂", "❤️", "👍", "🎉", "🔥", "💯", "✨", "😎", "🤔"];

  return (
    <div className="p-4">
      {/* File Upload Modal */}
      {showFileUpload && (
        <FileUpload
          onUpload={handleFileUpload}
          onCancel={() => setShowFileUpload(false)}
        />
      )}

      {/* Message Input Form */}
      <form onSubmit={handleSubmit} className="flex items-end space-x-2">
        {/* File Upload Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2 rounded-lg transition-colors hover:bg-gray-100 text-gray-600 dark:hover:bg-gray-700 dark:text-gray-300"
          title="Attach file"
        >
          <HiPaperClip className="w-5 h-5" />
        </button>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf,.doc,.docx,.txt"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Emoji Picker */}
        <div className="relative">
          <button
            type="button"
            className="p-2 rounded-lg transition-colors hover:bg-gray-100 text-gray-600 dark:hover:bg-gray-700 dark:text-gray-300"
            title="Add emoji"
          >
            <HiEmojiHappy className="w-5 h-5" />
          </button>

          {/* Emoji dropdown */}
          <div className="absolute bottom-full right-0 mb-2 p-2 dark:bg-gray-800 dark:border-gray-700 bg-white border-gray-200 rounded-lg shadow-lg border">
            <div className="grid grid-cols-5 gap-1">
              {emojis.map((emoji, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleEmojiClick(emoji)}
                  className="w-8 h-8 text-lg hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Text Input */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            rows={1}
            className="w-full px-4 py-2 rounded-lg border resize-none transition-colors focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 focus:ring-2 bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500"
            style={{
              minHeight: "44px",
              maxHeight: "120px",
            }}
          />

          {/* Character count */}
          {message.length > 0 && (
            <div className="absolute -bottom-6 right-2 dark:text-gray-400 text-xs text-gray-500">
              {message.length}/1000
            </div>
          )}
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={!message.trim()}
          className={`p-2 rounded-lg transition-colors ${
            message.trim()
              ? "dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white bg-blue-500 hover:bg-blue-600 text-white"
              : "dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed bg-gray-200 text-gray-400"
          }`}
          title="Send message"
        >
          <HiArrowCircleRight className="w-5 h-5" />
        </button>
      </form>

      {/* Typing indicator for current user */}
      {isTyping && (
        <div className="mt-2 text-xs dark:text-gray-400  text-gray-500$">
          You are typing...
        </div>
      )}
    </div>
  );
};

export default MessageInput;
