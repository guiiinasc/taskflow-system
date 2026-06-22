import { Request, Response } from "express";
import * as service from "./tasks.service";
import { createTaskSchema, updateTaskSchema } from "./tasks.schema";

export async function create(req: any, res: Response) {
  try {
    const userId = req.user.id;

    const data = createTaskSchema.parse(req.body);

    const task = await service.createTask(userId, data);

    return res.status(201).json({
      data: task,
      message: "Task criada com sucesso",
      error: null,
    });
  } catch (err: any) {
    return res.status(400).json({
      data: null,
      message: null,
      error: err.message,
    });
  }
}

export async function list(req: any, res: Response) {
  const userId = req.user.id;

  const tasks = await service.getTasks(userId);

  return res.json({
    data: tasks,
    message: "Tasks listadas com sucesso",
    error: null,
  });
}

export async function getById(req: any, res: Response) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const task = await service.getTaskById(userId, id);

    return res.json({
      data: task,
      message: null,
      error: null,
    });
  } catch (err: any) {
    return res.status(404).json({
      data: null,
      message: null,
      error: err.message,
    });
  }
}

export async function update(req: any, res: Response) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const data = updateTaskSchema.parse(req.body);

    const task = await service.updateTask(userId, id, data);

    return res.json({
      data: task,
      message: "Task atualizada com sucesso",
      error: null,
    });
  } catch (err: any) {
    return res.status(400).json({
      data: null,
      message: null,
      error: err.message,
    });
  }
}

export async function remove(req: any, res: Response) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const result = await service.deleteTask(userId, id);

    return res.json({
      data: result,
      message: "Task deletada com sucesso",
      error: null,
    });
  } catch (err: any) {
    return res.status(400).json({
      data: null,
      message: null,
      error: err.message,
    });
  }
}