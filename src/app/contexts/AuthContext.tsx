"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type User = {
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

  const login = async (email: string, password: string) => {
    // MVP SIMPLES (fake login)
    if (!email || !password) {
      throw new Error("Preencha todos os campos");
    }

    const fakeUser = { email };

    localStorage.setItem("auth-user", JSON.stringify(fakeUser));
    setUser(fakeUser);
  };

  const register = async (email: string, password: string) => {
    // MVP simples
    const newUser = { email };

    localStorage.setItem("auth-user", JSON.stringify(newUser));
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem("auth-user");
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