# Chat Application

A fully responsive, real-time chat application built with React.js and TailwindCSS, designed for integration with Socket.IO backend.

## Features

### 🚀 Core Functionality
- **Real-time Messaging**: Live message updates with Socket.IO ready architecture
- **Group Chats**: Create, join, and manage group conversations
- **Direct Messages**: One-on-one private conversations
- **File Sharing**: Upload and send images, PDFs, and documents
- **User Authentication**: JWT-based session management

### 💬 Chat Features
- **Message Types**: Text, images, files, and PDFs
- **Read Receipts**: Track message delivery and read status
- **Typing Indicators**: Show when users are typing
- **Message Timestamps**: Relative time display (e.g., "2 hours ago")
- **Message Editing**: Edit sent messages with edit indicators
- **Message Deletion**: Remove your own messages

### 🎨 User Interface
- **Responsive Design**: Mobile-first layout with collapsible sidebar
- **Dark Mode**: Toggle between light and dark themes
- **Modern UI**: Clean, intuitive interface using TailwindCSS
- **Smooth Animations**: Transitions and hover effects
- **Accessibility**: Keyboard navigation and screen reader support

### 📱 Mobile Experience
- **Collapsible Sidebar**: Auto-hide on mobile devices
- **Touch-Friendly**: Optimized for touch interactions
- **Responsive Layout**: Adapts to all screen sizes
- **Mobile Navigation**: Easy switching between chats

### 🔧 Technical Features
- **State Management**: React Context API with reducer pattern
- **Socket.IO Ready**: Prepared for real-time backend integration
- **File Upload**: Drag-and-drop with progress indicators
- **Mock Data**: Comprehensive sample data for testing
- **Modular Architecture**: Reusable components and clean code structure

## Project Structure

```
src/
├── components/
│   └── chat/
│       ├── ChatDashboard.jsx      # Main chat interface
│       ├── ChatSidebar.jsx        # Conversation list sidebar
│       ├── ChatWindow.jsx         # Chat area container
│       ├── ChatHeader.jsx         # Chat header with actions
│       ├── MessageList.jsx        # Scrollable message feed
│       ├── Message.jsx            # Individual message component
│       ├── MessageInput.jsx       # Message input with emojis
│       ├── FileUpload.jsx         # File upload modal
│       ├── CreateGroupModal.jsx   # Group creation modal
│       ├── TypingIndicator.jsx    # Typing animation
│       └── ConversationItem.jsx   # Sidebar conversation item
├── context/
│   └── AuthProvider.jsx            # Auth state management
│   └── ChatProvider.jsx            # Chat state management
└── App.jsx                        # Main app with routing
```

## Getting Started

### Prerequisites
- Node.js 16+ and npm
- React 18+
- TailwindCSS 4+

### Installation
1. Install dependencies:
   ```bash
   npm install
   ```

2. Install additional chat dependencies:
   ```bash
   npm install socket.io-client react-icons react-hot-toast date-fns
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Navigate to `/chat` to access the chat application

## Usage

### Basic Navigation
- **Sidebar**: Browse conversations and groups
- **Search**: Filter conversations by name or content
- **Create Group**: Start new group chats
- **Dark Mode**: Toggle theme with the moon/sun icon

### Sending Messages
- **Text Messages**: Type and press Enter or click Send
- **Emojis**: Click the emoji button to add reactions
- **Files**: Use the paperclip icon to upload documents
- **Images**: Drag and drop or select image files

### Group Management
- **Create Groups**: Set name, description, and select members
- **Member Management**: Add/remove members (admin only)
- **Group Info**: View member count and description

### File Sharing
- **Supported Formats**: Images (JPG, PNG, GIF), PDFs, Documents
- **File Size Limit**: 10MB per file
- **Upload Progress**: Visual progress indicators
- **File Preview**: Click images to view full size

## Mock Data

The application includes comprehensive mock data for testing:

### Users
- John Doe (admin)
- Jane Smith
- Mike Johnson
- Sarah Wilson
- David Brown

### Sample Groups
- **Project Team**: Main project discussion
- **Design Team**: UI/UX design discussions

### Sample Messages
- Text messages with timestamps
- File attachments
- Group chat examples

## Socket.IO Integration

The app is designed for easy backend integration:

### Events
- `join-chats`: Join user's chat rooms
- `send-message`: Send text messages
- `send-file-message`: Send file messages
- `typing`: Typing indicators
- `mark-read`: Read receipts

### Authentication
- JWT token-based authentication
- User verification on connection
- Secure chat room access

## Customization

### Styling
- Modify TailwindCSS classes for theme changes
- Update color schemes in dark mode
- Customize component layouts

### Features
- Add new message types
- Implement additional file formats
- Extend user status options
- Add notification systems

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance

- **Lazy Loading**: Components load on demand
- **Optimized Rendering**: Efficient message list rendering
- **Memory Management**: Proper cleanup of event listeners
- **Responsive Images**: Optimized image loading

## Future Enhancements

- **Voice/Video Calls**: WebRTC integration
- **Message Reactions**: Emoji reactions to messages
- **Message Threading**: Reply to specific messages
- **Advanced Search**: Search within messages
- **Push Notifications**: Browser notifications
- **Message Encryption**: End-to-end encryption
- **File Sharing**: Cloud storage integration

## Contributing

1. Follow the existing code structure
2. Use TailwindCSS for styling
3. Maintain responsive design principles
4. Add proper error handling
5. Include accessibility features

## License

This project is part of the multi-tenant expense tracker application.

---

**Note**: This is a frontend-only implementation with mock data. For production use, integrate with a Socket.IO backend and implement proper authentication and data persistence.
