import { Router } from "express";
import { registerController, loginController } from "./auth.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/register", registerController);
router.post("/login", loginController);

router.get("/me", authMiddleware, (req, res) => {
  return res.json({ user: (req as any).user });
});

export default router;