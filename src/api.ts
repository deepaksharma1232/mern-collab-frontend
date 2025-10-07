// src/api.ts
import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import { auth } from "./auth/firebase";

// ✅ Use correct env variable name for React (starts with REACT_APP_)
const baseURL =
  process.env.REACT_APP_API_BASE || "http://localhost:5000/api";

export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

// ✅ Utility to set or remove a static token (used after login)
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

// ✅ Attach Firebase token automatically on every request
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken();
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    } catch (err) {
      console.error("⚠️ Failed to attach Firebase token:", err);
    }
    return config;
  },
  (error) => Promise.reject(error)
);
