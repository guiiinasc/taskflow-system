import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3333",
});

// interceptor automático de token
api.interceptors.request.use((config) => {
  if (typeof window === "undefined") return config;

  const token = localStorage.getItem("token");

  console.log("TOKEN ENVIADO:", token);

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});