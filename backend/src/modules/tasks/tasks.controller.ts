import * as service from "./tasks.service";

export async function create(req: any, res: any) {
  const userId = req.user.id;

  console.log("BODY:", req.body); 

  const task = await service.createTask(userId, req.body);

  return res.status(201).json(task);
}