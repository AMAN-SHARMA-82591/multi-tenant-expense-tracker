export const DateFormat = (date) => new Date(date).toLocaleDateString();
export const MONTH = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Mock data
export const mockUsers = [
  {
    id: "1",
    username: "John Doe",
    email: "john@example.com",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    status: "online",
  },
  {
    id: "2",
    username: "Jane Smith",
    email: "jane@example.com",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    status: "online",
  },
  {
    id: "3",
    username: "Mike Johnson",
    email: "mike@example.com",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    status: "away",
  },
  {
    id: "4",
    username: "Sarah Wilson",
    email: "sarah@example.com",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    status: "offline",
  },
  {
    id: "5",
    username: "David Brown",
    email: "david@example.com",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    status: "online",
  },
];

export const mockGroups = [
  {
    id: "g1",
    name: "Project Team",
    description: "Main project discussion group",
    avatar:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=150&h=150&fit=crop",
    type: "group",
    members: ["1", "2", "3", "4"],
    admins: ["1"],
    lastMessage: {
      content: "Great work on the latest update!",
      sender: "2",
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      unreadCount: 2,
    },
  },
  {
    id: "g2",
    name: "Design Team",
    description: "UI/UX design discussions",
    avatar:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?w=150&h=150&fit=crop",
    type: "group",
    members: ["1", "2", "5"],
    admins: ["2"],
    lastMessage: {
      content: "New design mockups are ready for review",
      sender: "5",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      unreadCount: 0,
    },
  },
];

export const chatMockMessages = {
  g1: [
    {
      id: "m1",
      content: "Hello everyone! How is the project going?",
      sender: "1",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
      type: "text",
      readBy: ["1", "2", "3"],
    },
    {
      id: "m2",
      content: "We're making great progress! The backend is almost complete.",
      sender: "2",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      type: "text",
      readBy: ["1", "2", "3"],
    },
    {
      id: "m3",
      content: "Great work on the latest update!",
      sender: "2",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      type: "text",
      readBy: ["1", "2"],
    },
  ],
  g2: [
    {
      id: "m4",
      content: "I've updated the color scheme based on feedback",
      sender: "2",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
      type: "text",
      readBy: ["1", "2", "5"],
    },
    {
      id: "m5",
      content: "New design mockups are ready for review",
      sender: "5",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      type: "text",
      readBy: ["1", "2", "5"],
    },
  ],
};

// Initial state
export const chatInitialState = {
  currentUser: mockUsers[0],
  users: mockUsers,
  groups: mockGroups,
  messages: chatMockMessages,
  currentChat: null,
  conversations: [...mockGroups, ...mockUsers.slice(1)], // Groups + direct chats
  typingUsers: {},
  sidebarOpen: true,
  unreadCounts: {},
  notifications: [],
};

// Action types
export const chatActionTypes = {
  SET_TYPING: "SET_TYPING",
  ADD_MESSAGE: "ADD_MESSAGE",
  CREATE_GROUP: "CREATE_GROUP",
  MARK_AS_READ: "MARK_AS_READ",
  REMOVE_TYPING: "REMOVE_TYPING",
  TOGGLE_SIDEBAR: "TOGGLE_SIDEBAR",
  SET_CURRENT_CHAT: "SET_CURRENT_CHAT",
  ADD_NOTIFICATION: "ADD_NOTIFICATION",
  SET_CONVERSATIONS: "SET_CONVERSATIONS",
  UPDATE_UNREAD_COUNT: "UPDATE_UNREAD_COUNT",
  REMOVE_NOTIFICATION: "REMOVE_NOTIFICATION",
};
