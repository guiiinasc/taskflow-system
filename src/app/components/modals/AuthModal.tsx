"use client";

import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

type Props = {
  isOpen: boolean;
  mode: "login" | "register";
  setMode: (mode: "login" | "register") => void;
  onClose: () => void;
};

export function AuthModal({ isOpen, mode, setMode, onClose }: Props) {
  const { login, register } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setError("");

    try {
      setLoading(true);

      if (mode === "login") {
        await login(email, password);
      } else {
        await register(email, password);
      }

      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isLogin = mode === "login";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999,
      }}
    >
      <div
        style={{
          width: 720,
          height: 420,
          background: "#0F172A",
          borderRadius: 16,
          overflow: "hidden",
          position: "relative",
          display: "flex",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {/* 🔥 WRAPPER DESLIZANTE */}
        <div
          style={{
            display: "flex",
            width: "200%",
            zIndex: 2,
            position: "relative",
            transform: isLogin ? "translateX(0%)" : "translateX(-50%)",
            transition: "transform 0.6s ease",
          }}
        >
          {/* LOGIN */}
          <div style={{ width: "50%", padding: 32 }}>
            <h2 style={{ color: "#fff", marginBottom: 20 }}>Entrar</h2>

            <input
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
            />

            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
            />

            <button onClick={handleSubmit} style={buttonStyle}>
              {loading ? "Carregando..." : "Entrar"}
            </button>

            <p style={switchText}>
              Não tem conta?{" "}
              <span onClick={() => setMode("register")} style={linkStyle}>
                Criar conta
              </span>
            </p>
          </div>

          {/* REGISTER */}
          <div style={{ width: "50%", padding: 32 }}>
            <h2 style={{ color: "#fff", marginBottom: 20 }}>
              Criar conta
            </h2>

            <input
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
            />

            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
            />

            <button onClick={handleSubmit} style={buttonStyle}>
              {loading ? "Carregando..." : "Cadastrar"}
            </button>

            <p style={switchText}>
              Já tem conta?{" "}
              <span onClick={() => setMode("login")} style={linkStyle}>
                Fazer login
              </span>
            </p>
          </div>
        </div>

        {/* 🔥 PAINEL LATERAL ANIMADO */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: isLogin ? "50%" : "0%",
            width: "50%",
            height: "100%",
            background: "linear-gradient(135deg, #2563eb, #7c3aed)",
            transition: "left 0.6s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 30,
            textAlign: "center",
            zIndex: 1,
          }}
        >
          <div>
            <h2 style={{ color: "#fff", marginBottom: 10 }}>
              {isLogin ? "Bem-vindo de volta!" : "Bem-vindo!"}
            </h2>

            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 14 }}>
              {isLogin
                ? "Entre para continuar gerenciando suas tarefas."
                : "Crie sua conta para começar agora."}
            </p>
          </div>
        </div>

        {/* FECHAR */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            background: "transparent",
            border: "none",
            color: "#fff",
            fontSize: 18,
            cursor: "pointer",
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}

// 🔹 estilos reutilizáveis
const inputStyle = {
  width: "100%",
  padding: 12,
  marginBottom: 12,
  borderRadius: 8,
  background: "#020617",
  border: "1px solid rgba(255,255,255,0.08)",
  color: "#fff",
};

const buttonStyle = {
  width: "100%",
  padding: 12,
  background: "#2563eb",
  color: "#fff",
  borderRadius: 8,
  fontWeight: 600,
  marginTop: 8,
  cursor: "pointer",
};

const switchText = {
  marginTop: 16,
  fontSize: 13,
  color: "#94a3b8",
};

const linkStyle = {
  color: "#60a5fa",
  cursor: "pointer",
  fontWeight: 600,
};