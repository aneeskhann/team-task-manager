/** Auth API service — register, login, logout, me, csrf. */
import api from "./index";

export const getCSRF    = ()         => api.get("/auth/csrf");
export const getMe      = ()         => api.get("/auth/me");
export const register   = (data)     => api.post("/auth/register", data);
export const login      = (data)     => api.post("/auth/login", data);
export const logout     = ()         => api.post("/auth/logout");
