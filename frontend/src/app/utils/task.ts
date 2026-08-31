import type { Task, TaskStatus, TaskType } from "../features/tasks/task.types";
import { parseDateLocal, toLocalDateString } from "./date";

export type TaskFilter = "todas" | TaskStatus;
export type TaskTypeFilter = "todas" | TaskType;

const TASK_STATUS_SET = new Set<TaskStatus>([
  "pendente",
  "em_andamento",
  "concluido",
  "cancelado",
]);

const TASK_TYPE_SET = new Set<TaskType>(["entrega", "manutencao", "outro"]);

function generateTaskId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `task_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export function normalizeTaskStatus(value: unknown): TaskStatus {
  const normalized = String(value ?? "").trim().toLowerCase();
  if (TASK_STATUS_SET.has(normalized as TaskStatus)) return normalized as TaskStatus;
  return "pendente";
}

export function normalizeTaskType(value: unknown): TaskType {
  const normalized = String(value ?? "").trim().toLowerCase();
  if (TASK_TYPE_SET.has(normalized as TaskType)) return normalized as TaskType;
  return "outro";
}

export function normalizeTaskDate(value: unknown): string {
  const raw = String(value ?? "").trim();

  if (!raw) return toLocalDateString(new Date());

  const directMatch = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (directMatch) return raw;

  const isoLike = raw.match(/^(\d{4})-(\d{2})-(\d{2})T/);
  if (isoLike) {
    return raw.slice(0, 10);
  }

  const dateValue = new Date(raw);
  if (!Number.isNaN(dateValue.getTime())) {
    return toLocalDateString(dateValue);
  }

  return toLocalDateString(new Date());
}

function normalizeIsoString(value: unknown, fallback: string): string {
  const raw = String(value ?? "").trim();
  if (!raw) return fallback;

  const parsed = new Date(raw);
  if (!Number.isNaN(parsed.getTime())) return parsed.toISOString();

  return fallback;
}

export function normalizeTask(raw: Partial<Task> & Record<string, unknown>, fallbackUserId = "local-user"): Task {
  const nowIso = toLocalDateString(new Date());
  const normalizedType = normalizeTaskType(raw.type);
  const normalizedStatus = normalizeTaskStatus(raw.status);
  const quantity = typeof raw.quantity === "number" && Number.isFinite(raw.quantity)
    ? raw.quantity
    : undefined;

  return {
    id: typeof raw.id === "string" ? raw.id : generateTaskId(),
    userId: typeof raw.userId === "string" && raw.userId.trim() ? raw.userId : fallbackUserId,
    title: typeof raw.title === "string" && raw.title.trim() ? raw.title.trim() : "Tarefa",
    location: String(raw.location ?? "").trim(),
    quantity: normalizedType === "entrega" ? quantity : undefined,
    description: typeof raw.description === "string" && raw.description.trim() ? raw.description.trim() : undefined,
    type: normalizedType,
    customType: typeof raw.customType === "string" && raw.customType.trim() ? raw.customType.trim() : undefined,
    date: normalizeTaskDate(raw.date),
    time: typeof raw.time === "string" && raw.time.trim() ? raw.time.trim() : undefined,
    status: normalizedStatus,
    createdAt: normalizeIsoString(raw.createdAt, nowIso),
    updatedAt: normalizeIsoString(raw.updatedAt, nowIso),
  };
}

export function normalizeTaskList(raw: unknown, fallbackUserId = "local-user"): Task[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => normalizeTask((item ?? {}) as Partial<Task> & Record<string, unknown>, fallbackUserId));
}

export function groupTasks(tasks: Task[]) {
  const now = new Date();

  const today = toLocalDateString(now);

  const tomorrowDate = new Date(now);
  tomorrowDate.setDate(now.getDate() + 1);
  const tomorrow = toLocalDateString(tomorrowDate);

  const upcomingEndDate = new Date(now);
  upcomingEndDate.setDate(now.getDate() + 6);
  const upcomingEnd = toLocalDateString(upcomingEndDate);

  return {
    today: tasks.filter((t) => normalizeTaskDate(t.date) === today),
    tomorrow: tasks.filter((t) => normalizeTaskDate(t.date) === tomorrow),
    upcoming: tasks.filter((t) => {
      const taskDate = normalizeTaskDate(t.date);
      return taskDate > tomorrow && taskDate <= upcomingEnd;
    }),
  };
}

export function getTaskStats(tasks: Task[]) {
  const total = tasks.length;
  const pending = tasks.filter((t) => t.status === "pendente").length;
  const completed = tasks.filter((t) => t.status === "concluido").length;

  return { total, pending, completed };
}

export function createTaskDraft(): Omit<Task, "id" | "userId" | "createdAt" | "updatedAt"> {
  const now = new Date();

  const safeDate = new Date(Date.UTC(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  ));

  return {
    title: "",
    location: "",
    quantity: undefined,
    description: undefined,
    customType: undefined,
    date: toLocalDateString(safeDate),
    time: undefined,
    type: "entrega",
    status: "pendente",
  };
}

export function getTaskStatusLabel(status: TaskStatus): string {
  switch (status) {
    case "pendente":
      return "Pendente";
    case "em_andamento":
      return "Em andamento";
    case "concluido":
      return "Concluída";
    case "cancelado":
      return "Cancelada";
    default:
      return "Pendente";
  }
}

export function getTaskTypeLabel(type: TaskType, customType?: string): string {
  if (type === "outro") return customType?.trim() || "Outro";
  if (type === "manutencao") return "Manutenção";
  return "Entrega";
}

export function getTaskDisplayId(id: string): string {
  const numbers = id.replace(/\D/g, "");
  return `#${numbers.slice(-4)}`; 
}