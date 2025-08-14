import axios from "axios";
import { isTokenExpired } from "../utils/auth";

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
      logoutHandler();
    }
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    if (isTokenExpired(token)) {
      logoutHandler();
      throw new Error("Token expired");
    }
    config.headers.Authorization = token;
  }
  return config;
});

export default axiosInstance;
