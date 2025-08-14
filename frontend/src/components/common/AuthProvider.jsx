import { useCallback, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "../utils/contextApi";
import { setLogoutHandler } from "../utils/AxiosInstance";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

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
  }, [logout]);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
