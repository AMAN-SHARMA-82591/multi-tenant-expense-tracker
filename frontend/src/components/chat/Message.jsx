import { useState } from "react";
import { HiCheck, HiCheckCircle, HiDownload, HiEye } from "react-icons/hi";
import { formatDistanceToNow } from "date-fns";
import { useChat } from "../utils/contextApi";

const Message = ({ message, showAvatar, isOwnMessage }) => {
  const { getUserById } = useChat();
  const [showImagePreview, setShowImagePreview] = useState(false);

  const sender = getUserById(message.sender);
  const isImage = message.type === "image";
  const isFile = message.type === "file" || message.type === "pdf";

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (fileName) => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return "🖼️";
    if (["pdf"].includes(ext)) return "📄";
    if (["doc", "docx"].includes(ext)) return "📝";
    if (["xls", "xlsx"].includes(ext)) return "📊";
    if (["ppt", "pptx"].includes(ext)) return "📊";
    if (["zip", "rar", "7z"].includes(ext)) return "📦";
    return "📎";
  };

  const renderMessageContent = () => {
    if (isImage) {
      return (
        <div className="max-w-xs">
          <img
            src={message.fileUrl}
            alt={message.content}
            className="rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => setShowImagePreview(true)}
          />
          {message.content && <p className="mt-2 text-sm">{message.content}</p>}
        </div>
      );
    }

    if (isFile) {
      return (
        <div className="max-w-xs">
          <div className="p-3 rounded-lg border dark:border-gray-600 dark:bg-gray-700 border-gray-300 bg-gray-50">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{getFileIcon(message.fileName)}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate dark:text-white  text-gray-900">
                  {message.fileName}
                </p>
                <p className="text-xs dark:text-gray-400 text-gray-500">
                  {formatFileSize(message.fileSize)}
                </p>
              </div>
              <button
                className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 dark:text-gray-400 text-gray-600"
                title="Download file"
              >
                <HiDownload className="w-4 h-4" />
              </button>
            </div>
          </div>
          {message.content && <p className="mt-2 text-sm">{message.content}</p>}
        </div>
      );
    }

    return <p className="text-sm whitespace-pre-wrap">{message.content}</p>;
  };

  const renderReadReceipt = () => {
    if (isOwnMessage) {
      const readCount = message.readBy?.length || 0;
      // const totalMembers = 2; // For direct chats, this would be dynamic

      if (readCount > 1) {
        return (
          <div className="flex items-center space-x-1 text-xs text-blue-500">
            <HiCheckCircle className="w-3 h-3" />
            <span>Read</span>
          </div>
        );
      } else {
        return (
          <div className="flex items-center space-x-1 text-xs text-gray-400">
            <HiCheck className="w-3 h-3" />
            <span>Delivered</span>
          </div>
        );
      }
    }
    return null;
  };

  return (
    <>
      <div className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
        <div
          className={`flex ${
            isOwnMessage ? "flex-row-reverse" : "flex-row"
          } items-end space-x-2 max-w-xs lg:max-w-md`}
        >
          {/* Avatar */}
          {showAvatar && !isOwnMessage && (
            <div className="flex-shrink-0">
              <img
                src={sender?.avatar}
                alt={sender?.username}
                className="w-8 h-8 rounded-full object-cover"
              />
            </div>
          )}

          {/* Message Content */}
          <div
            className={`flex flex-col ${
              isOwnMessage ? "items-end" : "items-start"
            }`}
          >
            {/* Sender name for group chats */}
            {!isOwnMessage && showAvatar && message.type === "group" && (
              <p className="text-xs font-medium mb-1 dark:text-gray-400 text-gray-500">
                {sender?.username}
              </p>
            )}

            {/* Message bubble */}
            <div
              className={`px-4 py-2 rounded-2xl ${
                isOwnMessage
                  ? "dark:bg-blue-600 dark:text-white bg-blue-500 text-white"
                  : "dark:bg-gray-700 dark:text-white bg-gray-200 text-gray-900"
              }`}
            >
              {renderMessageContent()}
            </div>

            {/* Message metadata */}
            <div
              className={`flex items-center space-x-2 mt-1 ${
                isOwnMessage ? "justify-end" : "justify-start"
              }`}
            >
              <span className="text-xs dark:text-gray-400 text-gray-500">
                {formatDistanceToNow(message.createdAt, { addSuffix: true })}
              </span>
              {renderReadReceipt()}
              {message.isEdited && (
                <span className="text-xs dark:text-gray-400 text-gray-500">
                  (edited)
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      {showImagePreview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
          onClick={() => setShowImagePreview(false)}
        >
          <div className="relative max-w-4xl max-h-full p-4">
            <img
              src={message.fileUrl}
              alt={message.content}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <button
              className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75"
              onClick={() => setShowImagePreview(false)}
            >
              <HiEye className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Message;
