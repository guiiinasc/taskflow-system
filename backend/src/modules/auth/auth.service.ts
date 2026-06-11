import { hashPassword, comparePassword } from "../../lib/hash";
import { generateToken } from "../../lib/jwt";

type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

const users: User[] = [];

export async function register(name: string, email: string, password: string) {
  const userExists = users.find((u) => u.email === email);

  if (userExists) {
    throw new Error("Usuário já existe");
  }

  const hashed = await hashPassword(password);

  const user = {
    id: crypto.randomUUID(),
    name,
    email,
    password: hashed,
  };

  users.push(user);

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

export async function login(email: string, password: string) {
  const user = users.find((u) => u.email === email);

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
  });

  return { token };
}