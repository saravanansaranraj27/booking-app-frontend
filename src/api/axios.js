import axios from "axios";
import toast from "react-hot-toast";
const api = axios.create({
  baseURL: "http://localhost:8080",
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isAuthPage =
        window.location.pathname === "/login" ||
        window.location.pathname === "/register";
      if (!isAuthPage) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(error);
      }
    }
    let message = "Unable to complete the request.";
    if (error.response?.data) {
      const data = error.response.data;
      if (typeof data === "object") {
        if (typeof data.detail === "string") {
          message = data.detail;
        } else if (typeof data.message === "string") {
          message = data.message;
        } else {
          const errors = Object.values(data)
            .flatMap((value) => (Array.isArray(value) ? value : [value]))
            .filter(Boolean)
            .join(", ");
          if (errors) {
            message = errors;
          }
        }
      } else if (typeof data === "string") {
        message = data;
      }
    } else if (error.message) {
      message = error.message;
    }
    toast.error(message);
    error.message = message;
    return Promise.reject(error);
  },
);
export default api;
