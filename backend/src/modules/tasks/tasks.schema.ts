import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  location: z.string().optional(),
  type: z.string().optional(),
  status: z.enum(["pendente", "em_andamento", "concluida"]).optional(),
  date: z.string(), // vem como string do front
  time: z.string().optional(),
  quantity: z.number().optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(2).optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  type: z.string().optional(),
  status: z.enum(["pendente", "em_andamento", "concluida"]).optional(),
  date: z.string().optional(),
  time: z.string().optional(),
  quantity: z.number().optional(),
});