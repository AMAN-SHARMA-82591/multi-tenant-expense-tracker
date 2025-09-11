import { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router";
import { ToastContainer } from "react-toastify";
import Login from "../Login";
import Register from "../Register";
import ChatPage from "../chat/ChatPage";
import { useAuth } from "../utils/contextApi";
import ExpenseList from "../expenses/ExpenseList";
import ProtectedRoute from "../common/ProtectedRoute";
import AppLayout from "../common/AppLayout";

export default function AppRoutes() {
  const { user, darkMode } = useAuth();

  return (
    <Suspense fallback={<div>Loading...</div>}>
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
      <ToastContainer
        theme={darkMode ? "dark" : "light"}
        position="bottom-right"
        autoClose={true}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover
      />
    </Suspense>
  );
}
