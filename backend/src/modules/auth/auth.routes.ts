import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { register, login } from "./auth.service";

const router = Router();

// 🔓 REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await register(name, email, password);

    return res.status(201).json(user);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

// login 
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const data = await login(email, password);

    return res.json(data);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

// 🔒 ROTA PROTEGIDA
router.get("/me", authMiddleware, (req, res) => {
  return res.json({
    user: (req as any).user,
  });
});

export default router;