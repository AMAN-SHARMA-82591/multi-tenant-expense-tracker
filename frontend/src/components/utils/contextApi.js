import { createContext, useContext } from "react";

export const AuthContext = createContext(null);
export const ChatContext = createContext(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
