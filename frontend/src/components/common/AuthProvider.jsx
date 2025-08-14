import { useCallback, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "../utils/contextApi";
import { setLogoutHandler } from "../utils/AxiosInstance";
import { isTokenExpired } from "../utils/auth";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = (userData) => {
    const token = userData.token;
    const decoded = jwtDecode(token);
    setUser(decoded);
    localStorage.setItem("token", `Bearer ${token}`);
  };

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("token");
  }, []);

  useEffect(() => {
    setLogoutHandler(logout);
    const token = localStorage.getItem("token");
    if (token && !isTokenExpired(token)) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (error) {
        console.error(error);
        logout();
      }
    }
    setIsLoading(false);
  }, [logout]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold text-gray-700">Loading...</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ isLoading, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
