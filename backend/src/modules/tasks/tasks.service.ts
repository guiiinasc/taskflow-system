import { prisma } from "../../config/prisma";

function parseLocalDate(dateValue: string) {
  const raw = String(dateValue ?? "").trim();
  if (!raw) return new Date();

  const [year, month, day] = raw.split("-").map(Number);
  if ([year, month, day].every((part) => Number.isFinite(part))) {
    return new Date(year, month - 1, day);
  }

  return new Date(raw);
}

export async function createTask(userId: string, data: any) {
  return prisma.task.create({
    data: {
      title: data.title,
      description: data.description,
      location: data.location,
      type: data.type,
      status: data.status ?? "pendente",
      date: parseLocalDate(data.date),
      time: data.time,
      quantity: data.quantity,
      userId,
    },
  });
}

export async function getTasks(userId: string) {
  return prisma.task.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getTaskById(userId: string, taskId: string) {
  const task = await prisma.task.findFirst({
    where: { id: taskId, userId },
  });

  if (!task) throw new Error("Task não encontrada");

  return task;
}

export async function updateTask(userId: string, taskId: string, data: any) {
  const task = await prisma.task.findFirst({
    where: { id: taskId, userId },
  });

  if (!task) throw new Error("Task não encontrada");

  return prisma.task.update({
    where: { id: taskId },
    data: {
      ...data,
      date: data.date ? parseLocalDate(data.date) : undefined,
    },
  });
}

export async function deleteTask(userId: string, taskId: string) {
  const task = await prisma.task.findFirst({
    where: { id: taskId, userId },
  });

  if (!task) throw new Error("Task não encontrada");

  await prisma.task.delete({
    where: { id: taskId },
  });

  return { message: "Task deletada com sucesso" };
}