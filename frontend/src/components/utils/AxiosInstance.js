import axios from "axios";
import { jwtDecode } from "jwt-decode";

let logoutHandler = () => {};

export const setLogoutHandler = (callbackFn) => {
  logoutHandler = callbackFn;
};

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BACKEND_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      alert("Session expired");
      localStorage.removeItem("token");
      logoutHandler();
    }
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    const { exp } = jwtDecode(token);
    const now = Math.floor(Date.now() / 1000);
    if (exp < now) {
      logoutHandler();
      throw new Error("Token expired");
    }
    config.headers.Authorization = token;
  }
  return config;
});

export default axiosInstance;
