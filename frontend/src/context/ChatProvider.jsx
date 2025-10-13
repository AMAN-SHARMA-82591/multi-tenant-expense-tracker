import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { io } from "socket.io-client";
import { chatActionTypes } from "../components/utils/constants";
import { ChatContext, useAuth } from "../components/utils/contextApi";
import axiosInstance from "../components/utils/AxiosInstance";

// Reducer
function chatReducer(state, action) {
  switch (action.type) {
    case chatActionTypes.SET_CONVERSATIONS: {
      const { groups, users, conversations } = action.payload;
      return {
        ...state,
        groups,
        users,
        conversations,
      };
    }
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

    case chatActionTypes.TOGGLE_SIDEBAR:
      return {
        ...state,
        sidebarOpen: !state.sidebarOpen,
      };

    // case chatActionTypes.CREATE_GROUP:
    //   return {
    //     ...state,
    //     groups: [...state.groups, action.payload],
    //     conversations: [...state.conversations, action.payload],
    //   };

    case chatActionTypes.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };

    case chatActionTypes.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(
          (n) => n._id !== action.payload
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
  const { user } = useAuth();
  const socket = useRef(null);
  const previousChatId = useRef(null);
  const initialState = {
    currentUser: user,
    users: [],
    groups: [],
    messages: {},
    currentChat: null,
    conversations: [],
    typingUsers: {},
    sidebarOpen: true,
    unreadCounts: {},
    notifications: [],
  };
  const [initialLoading, setInitialLoading] = useState(false);
  const [state, dispatch] = useReducer(chatReducer, initialState);

  useEffect(() => {
    if (!user) return;
    socket.current = io(import.meta.env.VITE_APP_BACKEND_HOST);

    socket.current.on("connect", () => {
      socket.current.emit("setup", user);
    });

    // Listen for incoming messages
    socket.current.on("message", (data) => {
      dispatch({
        type: chatActionTypes.ADD_MESSAGE,
        payload: { chatId: data?.message?.conversation, message: data.message },
      });
    });

    // Listen for typing events, etc.

    return () => {
      socket.current.disconnect();
    };
  }, [user]);

  const fetchInitialData = useCallback(async () => {
    try {
      // Fetch groups
      const groupRes = await axiosInstance.get("/conversation");
      const groups = groupRes.data?.data || [];

      // Fetch users (adjust endpoint as needed)
      const userRes = await axiosInstance.get("/user");
      const users = userRes.data?.users || [];
      dispatch({
        type: chatActionTypes.SET_CONVERSATIONS,
        payload: {
          groups,
          users,
          conversations: [
            ...groups,
            ...users.filter((u) => u._id !== user?._id),
          ],
        },
      });
      // Fetch messages if needed (or load when chat opens)
      // const messagesRes = await axiosInstance.get("/messages");
      // const messages = messagesRes.data?.messages || {};
      setInitialLoading(true);
    } catch (err) {
      // Handle error
      setInitialLoading(true);
      console.error(err);
    }
  }, [user]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // Actions
  const actions = {
    setCurrentChat: (chat) => {
      dispatch({ type: chatActionTypes.SET_CURRENT_CHAT, payload: chat });
      if (previousChatId.current && socket.current) {
        socket.current.emit("leaveRoom", previousChatId.current);
      }
      if (chat && socket.current) {
        socket.current.emit("joinRoom", chat?.conversation?._id);
        previousChatId.current = chat?.conversation?._id;
      }

      // Mark messages as read when opening chat
      if (chat) {
        dispatch({
          type: chatActionTypes.MARK_AS_READ,
          payload: { chatId: chat?.conversation?._id },
        });
      }
    },

    sendMessage: (conversationId, content, type = "text", fileData = null) => {
      const message = {
        conversationId: conversationId,
        content,
        sender: state.currentUser.id,
        type,
        ...fileData,
      };
      socket.current.emit("sendMessage", message);
      // dispatch({
      //   type: chatActionTypes.ADD_MESSAGE,
      //   payload: {
      //     chatId: conversationId,
      //     message: { ...message, createdAt: new Date() },
      //   },
      // });

      // Add notification for other users
      // const chat = state.conversations.find((c) => c._id === chatId);
      // if (chat && chat.type === "group") {
      //   chat.members.forEach((memberId) => {
      //     if (memberId !== state.currentUser._id) {
      //       dispatch({
      //         type: chatActionTypes.UPDATE_UNREAD_COUNT,
      //         payload: { chatId, count: (state.unreadCounts[chatId] || 0) + 1 },
      //       });
      //     }
      //   });
      // }
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

    toggleSidebar: () => {
      dispatch({ type: chatActionTypes.TOGGLE_SIDEBAR });
    },

    // createGroup: (groupData) => {
    //   const newGroup = {
    //     id: `g${Date.now()}`,
    //     ...groupData,
    //     type: "group",
    //     lastMessage: {
    //       content: "Group created",
    //       sender: state.currentUser._id,
    //       timestamp: new Date(),
    //       unreadCount: 0,
    //     },
    //   };

    //   dispatch({ type: chatActionTypes.CREATE_GROUP, payload: newGroup });

    //   // Initialize empty messages array
    //   dispatch({
    //     type: chatActionTypes.ADD_MESSAGE,
    //     payload: {
    //       chatId: newGroup._id,
    //       message: {
    //         id: `m${Date.now()}`,
    //         content: "Group created",
    //         sender: state.currentUser._id,
    //         timestamp: new Date(),
    //         type: "text",
    //         readBy: [state.currentUser._id],
    //       },
    //     },
    //   });
    // },

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
    return state.messages[state.currentChat?.conversation?._id] || [];
  };

  // Get user by ID
  const getUserById = (userId) => {
    return state.users.find((user) => user._id === userId);
  };

  // Get conversation by ID
  const getConversationById = (conversationId) => {
    return state.conversations.find((conv) => conv._id === conversationId);
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
      actions.setTyping(chatId, state.currentUser._id);
      // Placeholder for Socket.IO typing event
      console.log(`Typing in chat: ${chatId}`);
    },

    stopTyping: (chatId) => {
      actions.removeTyping(chatId, state.currentUser._id);
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

  if (!initialLoading) {
    return (
      <div className="h-screen dark:bg-gray-900 bg-white">Loading chat...</div>
    );
  }

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}
