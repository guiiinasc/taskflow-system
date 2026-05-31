import { Task } from "./task.types";

function toLocalDateString(date: Date): string {
  const year  = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day   = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function groupTasks(tasks: Task[]) {
  const now      = new Date();
  const today    = toLocalDateString(now);

  const tomorrowDate = new Date(now);
  tomorrowDate.setDate(now.getDate() + 1);
  const tomorrow = toLocalDateString(tomorrowDate);

  return {
    // Exatamente hoje
    today: tasks.filter((t) => t.date === today),

    // Exatamente amanhã
    tomorrow: tasks.filter((t) => t.date === tomorrow),

    // Apenas datas FUTURAS (depois de amanhã) — passados não aparecem
    upcoming: tasks.filter((t) => t.date > tomorrow),
  };
}

export function getTaskStats(tasks: Task[]) {
  const total     = tasks.length;
  const pending   = tasks.filter((t) => t.status === "pendente").length;
  const completed = tasks.filter((t) => t.status === "concluido").length;

  return { total, pending, completed };
}

export function getTaskSubtitle(task: Task) {
  if (task.type === "entrega") {
    if (task.quantity) return `${task.quantity} pacotes`;
    return "Entrega";
  }

  if (task.type === "manutencao") {
    if (task.description) return task.description;
    return "Manutenção";
  }

  if (task.type === "outro") {
    if (task.customType) return task.customType;
    return "Outro";
  }

  return "";
}

export function getTaskTypeMeta(task: Task) {
  switch (task.type) {
    case "entrega":
      return {
        label: "ENTREGA",
        color: "#38bdf8",
      };

    case "manutencao":
      return {
        label: "MANUTENÇÃO",
        color: "#facc15",
      };

    case "outro":
      return {
        label: "OUTRO",
        color: "#a78bfa",
      };

    default:
      return {
        label: "TASK",
        color: "#94a3b8",
      };
  }
}

export function getTaskStatusMeta(task: Task) {
  if (task.status === "concluido") {
    return {
      label: "Concluído",
      color: "#22c55e",
    };
  }

  return {
    label: "Pendente",
    color: "#f59e0b",
  };
}