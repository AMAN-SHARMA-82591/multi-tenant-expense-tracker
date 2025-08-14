import { Routes, Route, Navigate } from "react-router";
import Login from "../Login";
import Register from "../Register";
import ExpenseList from "../ExpenseList";
import { useAuth } from "../utils/contextApi";
import ProtectedRoute from "../common/ProtectedRoute";

export default function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {!user?.tenantId ? (
        <>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/*" element={<Navigate replace to="/login" />} />
        </>
      ) : (
        <>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <ExpenseList />
              </ProtectedRoute>
            }
          />
          <Route path="/*" element={<Navigate replace to="/" />} />
        </>
      )}
    </Routes>
  );
}
