import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from "./tasks.service";

const router = Router();

//  TODAS protegidas
router.use(authMiddleware);

//  CREATE
router.post("/", async (req, res) => {
  try {
    const userId = (req as any).user.id;

    const task = await createTask(userId, req.body);

    return res.status(201).json(task);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});~

//  LIST
router.get("/", async (req, res) => {
  const userId = (req as any).user.id;

  const userTasks = await getTasks(userId);

  return res.json(userTasks);
});

router.get("/:id", async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;

    const task = await getTaskById(userId, id);

    return res.json(task);
  } catch (err: any) {
    return res.status(404).json({ error: err.message });
  }
});

//  UPDATE
router.put("/:id", async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;

    const updated = await updateTask(userId, id, req.body);

    return res.json(updated);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

//  DELETE
router.delete("/:id", async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;

    await deleteTask(userId, id);

    return res.json({ message: "Task deletada" });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

export default router;