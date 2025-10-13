import { HiUserGroup } from "react-icons/hi";
import { formatDistanceToNow } from "date-fns";
import { useChat } from "../utils/contextApi";
import Avatar from "@mui/material/Avatar";

const ConversationItem = ({ conversation, subtitle, unreadCount }) => {
  const { setCurrentChat, currentChat } = useChat();

  const isSelected = currentChat?._id === conversation._id;
  const lastMessageTime = conversation.lastMessage?.timestamp;

  const handleClick = () => {
    setCurrentChat(conversation);
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
      onClick={handleClick}
      className={`p-4 cursor-pointer transition-colors duration-150 ${
        isSelected
          ? "dark:bg-blue-600 dark:text-white bg-blue-50 text-blue-900 border-r-2 border-blue-500"
          : "dark:hover:bg-gray-700 dark:text-gray-300 hover:bg-gray-50 text-gray-900"
      }`}
    >
      <div className="flex items-center space-x-3">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <Avatar>
            <HiUserGroup />
          </Avatar>
        </div>
        {/* <div className="relative flex-shrink-0">
          {conversation.type === "group" ? (
            <div className="w-12 h-12 rounded-lg flex items-center justify-center dark:bg-gray-600 bg-gray-200">
              <HiUserGroup className="w-6 h-6 dark:text-gray-400 text-gray-600" />
            </div>
          ) : (
            <div className="relative">
              <img
                src={avatar}
                alt={displayName}
                className="w-12 h-12 rounded-full object-cover"
              />
              {conversation.status && (
                <div
                  className={`absolute -bottom-1 -right-1 dark:border-gray-800 border-white w-3 h-3 rounded-full border-2 ${getStatusColor(
                    conversation.status
                  )}`}
                />
              )}
            </div>
          )}
        </div> */}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4
              className={`font-medium truncate ${
                isSelected ? "text-white" : "dark:text-white text-gray-900"
              }`}
            >
              {conversation.tenant.name}
            </h4>
            {lastMessageTime && (
              <span
                className={`text-xs flex-shrink-0 ml-2 ${
                  isSelected
                    ? "text-blue-100"
                    : "dark:text-gray-400 text-gray-500"
                }`}
              >
                {formatDistanceToNow(lastMessageTime, { addSuffix: true })}
              </span>
            )}
          </div>

          <p
            className={`text-sm truncate ${
              isSelected ? "text-blue-100" : "dark:text-gray-400 text-gray-600"
            }`}
          >
            {subtitle}
          </p>
        </div>

        {/* Unread count */}
        {unreadCount > 0 && (
          <div
            className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              isSelected ? "bg-blue-100 text-blue-900" : "bg-red-500 text-white"
            }`}
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </div>
        )}
      </div>

      {/* Group info for group chats */}
      {conversation.type === "group" && (
        <div className="mt-2 flex items-center space-x-2">
          <span
            className={`text-xs ${
              isSelected ? "text-blue-200" : "dark:text-gray-500 text-gray-400"
            }`}
          >
            {conversation.members?.length || 0} members
          </span>
          {conversation.description && (
            <span
              className={`text-xs truncate ${
                isSelected
                  ? "text-blue-200"
                  : "dark:text-gray-500 text-gray-400"
              }`}
            >
              • {conversation.description}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default ConversationItem;
