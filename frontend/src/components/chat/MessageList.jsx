import { useEffect, useRef } from "react";
import Message from "./Message";
import TypingIndicator from "./TypingIndicator";
import { useChat } from "../utils/contextApi";

const MessageList = ({ messages, chatId }) => {
  const { isUserTyping, currentUser } = useChat();
  // const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);

  // Auto-scroll to bottom on new messages
  // useEffect(() => {
  //   if (messagesEndRef.current) {
  //     messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  //   }
  // }, [messages]);

  // Group messages by date
  const groupMessagesByDate = (messages) => {
    const groups = {};

    messages.forEach((message) => {
      const date = new Date(message.createdAt).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });

    return Object.entries(groups).map(([date, msgs]) => ({
      date: new Date(date),
      messages: msgs,
    }));
  };

  const messageGroups = groupMessagesByDate(messages);

  const renderDateSeparator = (date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let dateText;
    if (date.toDateString() === today.toDateString()) {
      dateText = "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      dateText = "Yesterday";
    } else {
      dateText = date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }

    return (
      <div className="flex justify-center my-4">
        <div className="px-3 py-1 rounded-full text-xs font-medium dark:bg-gray-700 dark:text-gray-300 bg-gray-200 text-gray-600">
          {dateText}
        </div>
      </div>
    );
  };

  const renderMessages = () => {
    if (messageGroups.length === 0) {
      return (
        <div className="flex flex-col items-center dark:text-gray-400 text-gray-500 justify-center h-full text-center">
          <div className="w-16 h-16 mx-auto mb-4 dark:bg-gray-800 bg-gray-200 rounded-full flex items-center justify-center $">
            <svg
              className="w-8 h-8"
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
          <h3 className="text-lg font-medium mb-2">No messages yet</h3>
          <p className="text-sm">
            Start the conversation by sending a message!
          </p>
        </div>
      );
    }

    return messageGroups.map(({ date, messages: groupMessages }) => (
      <div key={date.toISOString()}>
        {renderDateSeparator(date)}
        {groupMessages.map((message, index) => {
          const isOwnMessage = message.sender === currentUser.id;
          const showAvatar =
            !isOwnMessage &&
            (index === 0 ||
              groupMessages[index - 1]?.sender !== message.sender);

          return (
            <Message
              key={message._id}
              message={message}
              showAvatar={showAvatar}
              isOwnMessage={isOwnMessage}
            />
          );
        })}
      </div>
    ));
  };

  return (
    <div
      ref={scrollContainerRef}
      className="flex-1 overflow-y-auto p-4 space-y-2"
    >
      {/* Welcome message for new chats */}
      {messages.length === 0 && (
        <div className="text-center py-8 dark:text-gray-400 text-gray-500">
          <p className="text-sm">This is the beginning of your conversation</p>
        </div>
      )}

      {/* Messages */}
      {renderMessages()}

      {/* Typing indicator */}
      {isUserTyping(chatId, currentUser.id) && <TypingIndicator />}

      {/* Scroll anchor */}
      {/* <div ref={messagesEndRef} /> */}
    </div>
  );
};

export default MessageList;
