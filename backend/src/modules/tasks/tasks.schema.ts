import { z } from "zod";

const taskTypeSchema = z.enum(["entrega", "manutencao", "outro"]);
const taskStatusSchema = z.enum([
  "pendente",
  "em_andamento",
  "concluido",
  "cancelado",
]);

export const createTaskSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  location: z.string().optional(),
  type: taskTypeSchema.optional(),
  status: taskStatusSchema.optional().default("pendente"),
  date: z.string().min(1),
  time: z.string().optional(),
  quantity: z.number().optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(2).optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  type: taskTypeSchema.optional(),
  status: taskStatusSchema.optional(),
  date: z.string().min(1).optional(),
  time: z.string().optional(),
  quantity: z.number().optional(),
});