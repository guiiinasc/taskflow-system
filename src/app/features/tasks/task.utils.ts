import { Task } from "./task.types";

export function groupTasks(tasks: Task[]) {
  const today = new Date().toISOString().split("T")[0];

  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrow = tomorrowDate.toISOString().split("T")[0];

  return {
    today: tasks.filter((t) => t.date === today),
    tomorrow: tasks.filter((t) => t.date === tomorrow),
    upcoming: tasks.filter(
      (t) => t.date !== today && t.date !== tomorrow
    ),
  };
}

export function getTaskStats(tasks: Task[]) {
  const total = tasks.length;
  const pending = tasks.filter(t => t.status === "pendente").length;
  const completed = tasks.filter(t => t.status === "concluido").length;

  return { total, pending, completed };
}