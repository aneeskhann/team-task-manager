/**
 * Axios instance — shared base for all API service modules.
 *
 * Configuration:
 *  • baseURL         — Django dev server (override via VITE_API_URL env var)
 *  • withCredentials — sends session cookie cross-origin
 *  • X-CSRFToken     — auto-attached from the csrftoken cookie for unsafe requests
 */
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

/** Read the csrftoken cookie set by Django and attach it as a header. */
api.interceptors.request.use((config) => {
  const csrfToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("csrftoken="))
    ?.split("=")[1];
  if (csrfToken) {
    config.headers["X-CSRFToken"] = csrfToken;
  }
  return config;
});

export default api;
