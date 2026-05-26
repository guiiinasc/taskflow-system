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