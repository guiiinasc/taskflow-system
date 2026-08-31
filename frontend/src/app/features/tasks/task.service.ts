import { api } from "../../lib/api";
import { parseDateLocal } from "../../utils/date";

function isAuthError(error: unknown) {
  return typeof error === "object" && error !== null && "response" in error &&
    typeof (error as { response?: { status?: number } }).response?.status === "number" &&
    (error as { response?: { status?: number } }).response?.status === 401;
}

function toPersistedDate(dateValue: string) {
  const raw = String(dateValue ?? "").trim();
  if (!raw) return new Date();

  const [year, month, day] = raw.split("-").map(Number);
  if ([year, month, day].every((part) => Number.isFinite(part))) {
    return new Date(year, month - 1, day);
  }

  return parseDateLocal(raw);
}

// TASKS API
export async function getTasks() {
  try {
    const res = await api.get("/api/tasks");
    return res.data;
  } catch (error) {
    if (isAuthError(error)) {
      return { data: [] };
    }
    throw error;
  }
}

export async function createTask(data: any) {
  try {
    const res = await api.post("/api/tasks", {
      ...data,
      date: toPersistedDate(data.date).toISOString(),
    });
    return res.data;
  } catch (error) {
    if (isAuthError(error)) {
      return { data: null, message: "Faça login para criar tarefas", error: "Unauthorized" };
    }
    throw error;
  }
}

export async function updateTask(id: string, data: any) {
  const res = await api.put(`/api/tasks/${id}`, {
    ...data,
    date: data.date ? toPersistedDate(data.date).toISOString() : data.date,
  });
  return res.data;
}

export async function deleteTask(id: string) {
  const res = await api.delete(`/api/tasks/${id}`);
  return res.data;
}