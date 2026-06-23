import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3333",
});

// injeta token automaticamente
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// TASKS API
export async function getTasks() {
  const res = await api.get("/api/tasks");
  return res.data;
}

export async function createTask(data: any) {
  const res = await api.post("/api/tasks", data);
  return res.data;
}

export async function updateTask(id: string, data: any) {
  const res = await api.put(`/api/tasks/${id}`, data);
  return res.data;
}

export async function deleteTask(id: string) {
  const res = await api.delete(`/api/tasks/${id}`);
  return res.data;
}