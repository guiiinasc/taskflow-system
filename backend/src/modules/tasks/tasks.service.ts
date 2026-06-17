import { randomUUID } from "crypto";

type Task = {
  id: string;
  userId: string;
  title: string;
  date: string;
  status: "pendente" | "concluido";
};

const tasks: Task[] = [];

export function createTask(userId: string, title: string, date: string) {
  const task: Task = {
    id: randomUUID(),
    userId,
    title,
    date,
    status: "pendente",
  };

  tasks.push(task);
  return task;
}

export function getTasks(userId: string) {
  return tasks.filter((t) => t.userId === userId);
}

export function getTaskById(userId: string, taskId: string) {
  const task = tasks.find(
    (t) => t.id === taskId && t.userId === userId
  );

  if (!task) throw new Error("Task não encontrada");

  return task;
}

export function updateTask(userId: string, taskId: string, data: Partial<Task>) {
  const task = tasks.find((t) => t.id === taskId && t.userId === userId);

  if (!task) throw new Error("Task não encontrada");

  Object.assign(task, data);

  return task;
}

export function deleteTask(userId: string, taskId: string) {
  const index = tasks.findIndex(
    (t) => t.id === taskId && t.userId === userId
  );

  if (index === -1) throw new Error("Task não encontrada");

  tasks.splice(index, 1);
}