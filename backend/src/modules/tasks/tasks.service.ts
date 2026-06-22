import { prisma } from "../../config/prisma";

export async function createTask(userId: string, data: any) {
  return prisma.task.create({
    data: {
      title: data.title,
      description: data.description,
      location: data.location,
      type: data.type,
      status: data.status ?? "pendente",
      date: new Date(data.date),
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
      date: data.date ? new Date(data.date) : undefined,
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