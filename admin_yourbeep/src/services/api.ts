import axios from "axios";
import { firebaseAuth } from "../features/auth/services/firebaseClient";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(async (config) => {
  const firebaseToken = await firebaseAuth.currentUser?.getIdToken();
  const token = firebaseToken || localStorage.getItem("token");

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("authUser");
    }

    return Promise.reject(error);
  },
);

export default api;
