import { useState, useMemo } from "react";
import ConversationItem from "./ConversationItem";
import { HiSearch } from "react-icons/hi";
// import { formatDistanceToNow } from "date-fns";
import { useChat } from "../utils/contextApi";

const ChatSidebar = () => {
  const { conversations, currentUser, getUnreadCount, getConversationById } =
    useChat();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all"); // all, groups, direct

  // Filter conversations based on search and type
  const filteredConversations = useMemo(() => {
    let filtered = conversations.filter((conv) => {
      const matchesSearch =
        conv.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conv.username?.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      if (filterType === "groups") return conv.type === "group";
      if (filterType === "direct") return conv.type !== "group";

      return true;
    });

    // Sort by last message timestamp (most recent first)
    filtered.sort((a, b) => {
      const aTime = a.lastMessage?.timestamp || new Date(0);
      const bTime = b.lastMessage?.timestamp || new Date(0);
      return bTime - aTime;
    });

    return filtered;
  }, [conversations, searchTerm, filterType]);

  const getConversationDisplayName = (conv) => {
    if (conv.type === "group") return conv.name;
    return conv.username || conv.name;
  };

  const getConversationAvatar = (conv) => {
    if (conv.type === "group") return conv.avatar;
    return conv.avatar;
  };

  const getConversationSubtitle = (conv) => {
    if (conv.lastMessage) {
      const sender = getConversationById(conv.lastMessage.sender);
      const senderName = sender?.username || sender?.name || "Unknown";
      // const timeAgo = formatDistanceToNow(conv.lastMessage.timestamp, {
      //   addSuffix: true,
      // });
      return `${senderName}: ${conv.lastMessage.content}`;
    }
    return conv.description || "No messages yet";
  };

  return (
    <div className="h-full flex flex-col border-r dark:bg-gray-800 dark:border-gray-700 bg-white border-gray-200">
      {/* Search and Filter Header */}
      <div className="p-4 border-b dark:border-gray-700 border-gray-200">
        <div className="relative mb-3">
          <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 dark:text-gray-400 text-gray-500" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border transition-colors bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-1">
          {[
            { key: "all", label: "All", count: conversations.length },
            {
              key: "groups",
              label: "Groups",
              count: conversations.filter((c) => c.type === "group").length,
            },
            {
              key: "direct",
              label: "Direct",
              count: conversations.filter((c) => c.type !== "group").length,
            },
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setFilterType(key)}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                filterType === key
                  ? "dark:bg-blue-600 dark:text-white bg-blue-500 text-white"
                  : "dark:text-gray-400 dark:hover:bg-gray-700 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {label} ({count})
            </button>
          ))}
        </div>
      </div>
      {/* Current User Info --- For now I have added a condition. Remove that after backend integration */}
      {currentUser && (
        <div className="p-4 border-b dark:border-gray-700 dark:bg-gray-700 border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.username}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div
                className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 dark:border-gray-800 border-white
                  ${
                    currentUser.status === "online"
                      ? "bg-green-500"
                      : currentUser.status === "away"
                      ? "bg-yellow-500"
                      : "bg-gray-500"
                  }`}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate dark:text-white text-gray-900">
                {currentUser.username}
              </p>
              <p className="text-sm truncate dark:text-gray-400 text-gray-600">
                {currentUser.email}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="p-4 dark:text-gray-400 text-gray-500 text-center">
            {searchTerm ? "No conversations found" : "No conversations yet"}
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredConversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                displayName={getConversationDisplayName(conversation)}
                avatar={getConversationAvatar(conversation)}
                subtitle={getConversationSubtitle(conversation)}
                unreadCount={getUnreadCount(conversation.id)}
                isActive={false} // Will be set by parent component
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t dark:border-gray-700 dark:bg-gray-700 border-gray-200 bg-gray-50">
        <div className="text-xs text-center dark:text-gray-400 text-gray-500">
          {filteredConversations.length} conversation
          {filteredConversations.length !== 1 ? "s" : ""}
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;
