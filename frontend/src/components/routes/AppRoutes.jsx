import { Routes, Route, Navigate } from "react-router";
import Login from "../Login";
import Register from "../Register";
import ChatPage from "../chat/ChatPage";
import { useAuth } from "../utils/contextApi";
import ExpenseList from "../expenses/ExpenseList";
import ProtectedRoute from "../common/ProtectedRoute";
import AppLayout from "../common/AppLayout";

export default function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {!user?.id ? (
        <>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/*" element={<Navigate replace to="/login" />} />
        </>
      ) : (
        <Route path="/" element={<AppLayout />}>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <ExpenseList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          />
          <Route path="/*" element={<Navigate replace to="/" />} />
        </Route>
      )}
    </Routes>
  );
}
