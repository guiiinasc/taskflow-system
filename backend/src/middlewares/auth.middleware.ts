import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../lib/jwt";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Token não enviado" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token inválido" });
  }

  try {
    const decoded = verifyToken(token);

    // 🔥 aqui a mágica acontece
    (req as any).user = decoded;

    next();
  } catch {
    return res.status(401).json({ error: "Token inválido" });
  }
}