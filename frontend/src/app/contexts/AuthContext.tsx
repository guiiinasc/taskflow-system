"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import axios from "axios";

type User = {
  id: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

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

    const response = await axios.post("http://localhost:3333/auth/login", {
      email,
      password,
    });

    const { token } = response.data;

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

  const register = async (email: string, password: string) => {
    if (!email || !password) {
      throw new Error("Preencha todos os campos");
    }

    await axios.post("http://localhost:3333/auth/register", {
      email,
      password,
    });
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