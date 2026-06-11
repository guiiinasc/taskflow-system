import { Request, Response } from "express";
import { register, login } from "./auth.service";
import { registerSchema, loginSchema } from "./auth.schema";

export async function registerController(req: Request, res: Response) {
  try {
    const data = registerSchema.parse(req.body);

    const user = await register(data.email, data.name, data.password);

    return res.status(201).json(user);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
}

export async function loginController(req: Request, res: Response) {
  try {
    const data = loginSchema.parse(req.body);

    const result = await login(data.email, data.password);

    return res.json(result);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
}