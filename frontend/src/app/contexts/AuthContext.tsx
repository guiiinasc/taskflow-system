"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

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

  function createUser(email: string): User {
    const normalizedEmail = email.trim().toLowerCase();
    return {
      id: normalizedEmail,
      email: normalizedEmail,
    };
  }

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
        const parsed = JSON.parse(stored) as Partial<User>;
        if (parsed.email) {
          setUser(createUser(parsed.email));
        }
      }
    } catch {}
  }, []);

  const login = async (email: string, password: string) => {
    // MVP SIMPLES (fake login)
    if (!email || !password) {
      throw new Error("Preencha todos os campos");
    }

    const fakeUser = createUser(email);
    persistUser(fakeUser);
    setUser(fakeUser);
  };

  const register = async (email: string, password: string) => {
    // MVP simples
    const newUser = createUser(email);
    persistUser(newUser);
    setUser(newUser);
  };

  const logout = () => {
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