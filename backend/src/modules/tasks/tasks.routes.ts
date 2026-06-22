import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import {
  create,
  list,
  getById,
  update,
  remove,
} from "./tasks.controller";

const router = Router();

router.use(authMiddleware);

// CRUD
router.post("/", create);
router.get("/", list);
router.get("/:id", getById);
router.put("/:id", update);
router.delete("/:id", remove);

export default router;