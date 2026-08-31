"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { api } from "../lib/api";
import { useToast } from "./ToastContext";

type User = {
  id: string;
  email: string;
  name?: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const { showToast } = useToast();

  function persistUser(nextUser: User | null) {
    if (typeof window === "undefined") return;

    if (nextUser) {
      localStorage.setItem("auth-user", JSON.stringify(nextUser));
    } else {
      localStorage.removeItem("auth-user");
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const stored = localStorage.getItem("auth-user");
      if (stored) {
        const parsed = JSON.parse(stored) as User;
        setUser(parsed);
      }
    } catch {}
  }, []);

  const login = async (email: string, password: string) => {
    if (!email || !password) {
      throw new Error("Preencha todos os campos");
    }

    const response = await api.post("/auth/login", {
      email,
      password,
    });

    const { token } = response.data;

    showToast("Login feito com sucesso", "success");

    // salva token para requests futuras
    localStorage.setItem("token", token);

    // decode simples do usuário (vem do backend no JWT payload)
    const payload = JSON.parse(atob(token.split(".")[1]));

    const realUser: User = {
      id: payload.id,
      email: payload.email,
    };

    persistUser(realUser);
    setUser(realUser);
  };

  const register = async (name: string, email: string, password: string) => {
    if (!name || !email || !password) {
      throw new Error("Preencha nome, e-mail e senha");
    }

    await api.post("/auth/register", {
      name,
      email,
      password,
    });

    showToast("Conta criada com sucesso", "success");
  };

  const logout = () => {
    localStorage.removeItem("token");
    persistUser(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth precisa do AuthProvider");
  return context;
}