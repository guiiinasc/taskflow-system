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
router.post("/", (req, res) => {
  try {
    const { title, date } = req.body;
    const userId = (req as any).user.id;

    const task = createTask(userId, title, date);

    return res.status(201).json(task);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

//  LIST
router.get("/", (req, res) => {
  const userId = (req as any).user.id;

  const userTasks = getTasks(userId);

  return res.json(userTasks);
});

router.get("/:id", (req, res) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;

    const task = getTaskById(userId, id);

    return res.json(task);
  } catch (err: any) {
    return res.status(404).json({ error: err.message });
  }
});

//  UPDATE
router.put("/:id", (req, res) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;

    const updated = updateTask(userId, id, req.body);

    return res.json(updated);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

//  DELETE
router.delete("/:id", (req, res) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;

    deleteTask(userId, id);

    return res.json({ message: "Task deletada" });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

export default router;