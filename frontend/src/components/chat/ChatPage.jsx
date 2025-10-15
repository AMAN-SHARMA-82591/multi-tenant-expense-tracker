import { ChatProvider } from "../../context/ChatProvider";
import ChatDashboard from "./ChatDashboard";
import { Toaster } from "react-hot-toast";

const ChatPage = () => {
  return (
    <ChatProvider>
      <ChatDashboard />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#10B981",
              secondary: "#fff",
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: "#EF4444",
              secondary: "#fff",
            },
          },
        }}
      />
    </ChatProvider>
  );
};

export default ChatPage;
