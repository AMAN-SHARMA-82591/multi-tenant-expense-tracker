import { useReducer } from "react";
import {
  chatActionTypes,
  chatInitialState,
} from "../components/utils/constants";
import { ChatContext } from "../components/utils/contextApi";

// Reducer
function chatReducer(state, action) {
  switch (action.type) {
    case chatActionTypes.SET_CURRENT_CHAT:
      return {
        ...state,
        currentChat: action.payload,
      };

    case chatActionTypes.ADD_MESSAGE: {
      const { chatId, message } = action.payload;
      const existingMessages = state.messages[chatId] || [];
      return {
        ...state,
        messages: {
          ...state.messages,
          [chatId]: [...existingMessages, message],
        },
      };
    }

    case chatActionTypes.SET_TYPING:
      return {
        ...state,
        typingUsers: {
          ...state.typingUsers,
          [action.payload.chatId]: [
            ...(state.typingUsers[action.payload.chatId] || []),
            action.payload.userId,
          ],
        },
      };

    case chatActionTypes.REMOVE_TYPING: {
      const { chatId: typingChatId, userId } = action.payload;
      return {
        ...state,
        typingUsers: {
          ...state.typingUsers,
          [typingChatId]: (state.typingUsers[typingChatId] || []).filter(
            (id) => id !== userId
          ),
        },
      };
    }

    case chatActionTypes.TOGGLE_DARK_MODE:
      return {
        ...state,
        darkMode: !state.darkMode,
      };

    case chatActionTypes.TOGGLE_SIDEBAR:
      return {
        ...state,
        sidebarOpen: !state.sidebarOpen,
      };

    case chatActionTypes.CREATE_GROUP:
      return {
        ...state,
        groups: [...state.groups, action.payload],
        conversations: [...state.conversations, action.payload],
      };

    case chatActionTypes.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };

    case chatActionTypes.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(
          (n) => n.id !== action.payload
        ),
      };

    case chatActionTypes.MARK_AS_READ: {
      const { chatId: readChatId } = action.payload;
      return {
        ...state,
        unreadCounts: {
          ...state.unreadCounts,
          [readChatId]: 0,
        },
      };
    }

    case chatActionTypes.UPDATE_UNREAD_COUNT: {
      const { chatId: countChatId, count } = action.payload;
      return {
        ...state,
        unreadCounts: {
          ...state.unreadCounts,
          [countChatId]: count,
        },
      };
    }

    default:
      return state;
  }
}

// Provider component
export function ChatProvider({ children }) {
  const [state, dispatch] = useReducer(chatReducer, chatInitialState);

  // Actions
  const actions = {
    setCurrentChat: (chat) => {
      dispatch({ type: chatActionTypes.SET_CURRENT_CHAT, payload: chat });
      // Mark messages as read when opening chat
      if (chat) {
        dispatch({
          type: chatActionTypes.MARK_AS_READ,
          payload: { chatId: chat.id },
        });
      }
    },

    sendMessage: (chatId, content, type = "text", fileData = null) => {
      const message = {
        id: `m${Date.now()}`,
        content,
        sender: state.currentUser.id,
        timestamp: new Date(),
        type,
        readBy: [state.currentUser.id],
        ...fileData,
      };

      dispatch({
        type: chatActionTypes.ADD_MESSAGE,
        payload: { chatId, message },
      });

      // Add notification for other users
      const chat = state.conversations.find((c) => c.id === chatId);
      if (chat && chat.type === "group") {
        chat.members.forEach((memberId) => {
          if (memberId !== state.currentUser.id) {
            dispatch({
              type: chatActionTypes.UPDATE_UNREAD_COUNT,
              payload: { chatId, count: (state.unreadCounts[chatId] || 0) + 1 },
            });
          }
        });
      }
    },

    setTyping: (chatId, userId) => {
      dispatch({
        type: chatActionTypes.SET_TYPING,
        payload: { chatId, userId },
      });
    },

    removeTyping: (chatId, userId) => {
      dispatch({
        type: chatActionTypes.REMOVE_TYPING,
        payload: { chatId, userId },
      });
    },

    toggleDarkMode: () => {
      dispatch({ type: chatActionTypes.TOGGLE_DARK_MODE });
    },

    toggleSidebar: () => {
      dispatch({ type: chatActionTypes.TOGGLE_SIDEBAR });
    },

    createGroup: (groupData) => {
      const newGroup = {
        id: `g${Date.now()}`,
        ...groupData,
        type: "group",
        lastMessage: {
          content: "Group created",
          sender: state.currentUser.id,
          timestamp: new Date(),
          unreadCount: 0,
        },
      };

      dispatch({ type: chatActionTypes.CREATE_GROUP, payload: newGroup });

      // Initialize empty messages array
      dispatch({
        type: chatActionTypes.ADD_MESSAGE,
        payload: {
          chatId: newGroup.id,
          message: {
            id: `m${Date.now()}`,
            content: "Group created",
            sender: state.currentUser.id,
            timestamp: new Date(),
            type: "text",
            readBy: [state.currentUser.id],
          },
        },
      });
    },

    addNotification: (notification) => {
      const id = Date.now();
      dispatch({
        type: chatActionTypes.ADD_NOTIFICATION,
        payload: { id, ...notification },
      });

      // Auto-remove notification after 5 seconds
      setTimeout(() => {
        dispatch({ type: chatActionTypes.REMOVE_NOTIFICATION, payload: id });
      }, 5000);
    },
  };

  // Get current chat messages
  const getCurrentChatMessages = () => {
    if (!state.currentChat) return [];
    return state.messages[state.currentChat.id] || [];
  };

  // Get user by ID
  const getUserById = (userId) => {
    return state.users.find((user) => user.id === userId);
  };

  // Get conversation by ID
  const getConversationById = (conversationId) => {
    return state.conversations.find((conv) => conv.id === conversationId);
  };

  // Check if user is typing
  const isUserTyping = (chatId, userId) => {
    return (state.typingUsers[chatId] || []).includes(userId);
  };

  // Get unread count for a chat
  const getUnreadCount = (chatId) => {
    return state.unreadCounts[chatId] || 0;
  };

  // Socket.IO ready methods (for future backend integration)
  const socketActions = {
    connect: () => {
      // Placeholder for Socket.IO connection
      console.log("Socket.IO connection ready");
    },

    joinChat: (chatId) => {
      // Placeholder for joining chat room
      console.log(`Joining chat: ${chatId}`);
    },

    leaveChat: (chatId) => {
      // Placeholder for leaving chat room
      console.log(`Leaving chat: ${chatId}`);
    },

    sendTyping: (chatId) => {
      actions.setTyping(chatId, state.currentUser.id);
      // Placeholder for Socket.IO typing event
      console.log(`Typing in chat: ${chatId}`);
    },

    stopTyping: (chatId) => {
      actions.removeTyping(chatId, state.currentUser.id);
      // Placeholder for Socket.IO stop typing event
      console.log(`Stopped typing in chat: ${chatId}`);
    },
  };

  const value = {
    ...state,
    ...actions,
    getCurrentChatMessages,
    getUserById,
    getConversationById,
    isUserTyping,
    getUnreadCount,
    socketActions,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}
