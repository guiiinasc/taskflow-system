import { prisma } from "../../config/prisma";
import { hashPassword, comparePassword } from "../../lib/hash";
import { generateToken } from "../../lib/jwt";

export async function register(name: string, email: string, password: string) {
  const userExists = await prisma.user.findUnique({
    where: { email },
  });

  if (userExists) {
    throw new Error("Usuário já existe");
  }

  const hashed = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
    },
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Credenciais inválidas");
  }

  const valid = await comparePassword(password, user.password);

  if (!valid) {
    throw new Error("Credenciais inválidas");
  }

  const token = generateToken({
    id: user.id,
    email: user.email,
    name: user.name,
  });

  return { token };
}