"use client";

import { useEffect, useRef, useState } from "react";
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
  const [visible, setVisible] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  useEffect(() => {
    setError("");
  }, [mode, isOpen]);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [isOpen]);

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
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Falha ao autenticar");
    } finally {
      setLoading(false);
    }
  };

  const isLogin = mode === "login";

  return (
    <>
      <style>{`
        @keyframes auth-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes auth-scale-in {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .auth-panel-slide {
          transition: transform 0.52s cubic-bezier(0.22, 1, 0.36, 1),
                      opacity  0.38s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .auth-accent-slide {
          transition: transform 0.52s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .auth-input:focus {
          border-color: rgba(37, 99, 235, 0.7) !important;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15) !important;
        }
        .auth-btn-primary:hover:not(:disabled) {
          background: #1d4ed8 !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 20px rgba(37, 99, 235, 0.35) !important;
        }
        .auth-btn-primary:active:not(:disabled) {
          transform: translateY(0);
        }
        .auth-btn-ghost:hover {
          background: rgba(255,255,255,0.08) !important;
        }
        .auth-close:hover {
          background: rgba(255,255,255,0.08) !important;
          color: #fff !important;
        }
        .auth-switch-link:hover {
          color: #93c5fd !important;
        }
        @media (max-width: 540px) {
          .auth-modal-inner {
            width: 94vw !important;
            height: auto !important;
            min-height: 420px !important;
          }
          .auth-accent-panel {
            display: none !important;
          }
          .auth-form-panel {
            width: 100% !important;
            transform: none !important;
            opacity: 1 !important;
          }
        }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(2, 6, 23, 0.82)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 999,
          animation: "auth-fade-in 0.22s ease",
        }}
      >
        {/* Modal */}
        <div
          className="auth-modal-inner"
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "min(92vw, 740px)",
            height: "min(76vh, 460px)",
            background: "#0F172A",
            borderRadius: 20,
            overflow: "hidden",
            position: "relative",
            border: "1px solid rgba(255,255,255,0.07)",
            boxShadow:
              "0 0 0 1px rgba(255,255,255,0.03), 0 32px 80px rgba(0,0,0,0.55), 0 8px 20px rgba(0,0,0,0.3)",
            animation: "auth-scale-in 0.3s cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          {/* ── Form Panel ── */}
          <div
            className="auth-panel-slide auth-form-panel"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "50%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              padding: "40px 36px",
              transform: isLogin ? "translateX(0)" : "translateX(100%)",
              opacity: 1,
              zIndex: 2,
              background: "#0F172A",
            }}
          >
            <div style={{ width: "100%" }}>
              {/* Header */}
              <div style={{ marginBottom: 28 }}>
                <p style={{
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#3b82f6",
                  marginBottom: 8,
                }}>
                  {isLogin ? "Bem-vindo de volta" : "Criar conta"}
                </p>
                <h2 style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#f1f5f9",
                  lineHeight: 1.2,
                  letterSpacing: "-0.02em",
                }}>
                  {isLogin ? "Entrar na sua conta" : "Comece agora gratuitamente"}
                </h2>
              </div>

              {/* Error */}
              {error && (
                <div style={{
                  marginBottom: 16,
                  padding: "10px 14px",
                  borderRadius: 10,
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.18)",
                  color: "#fca5a5",
                  fontSize: 13,
                  lineHeight: 1.5,
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 8,
                }}>
                  <span style={{ marginTop: 1, flexShrink: 0 }}>⚠</span>
                  <span>{error}</span>
                </div>
              )}

              {/* Inputs */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <input
                  className="auth-input"
                  type="email"
                  placeholder="E-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  style={{
                    width: "100%",
                    padding: "11px 14px",
                    borderRadius: 10,
                    background: "#020617",
                    border: "1px solid rgba(255,255,255,0.07)",
                    color: "#f1f5f9",
                    fontSize: 14,
                    fontFamily: "inherit",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                  }}
                />
                <input
                  className="auth-input"
                  type="password"
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  style={{
                    width: "100%",
                    padding: "11px 14px",
                    borderRadius: 10,
                    background: "#020617",
                    border: "1px solid rgba(255,255,255,0.07)",
                    color: "#f1f5f9",
                    fontSize: 14,
                    fontFamily: "inherit",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                  }}
                />
              </div>

              {/* Submit */}
              <button
                className="auth-btn-primary"
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  width: "100%",
                  marginTop: 16,
                  padding: "12px 14px",
                  background: "#2563eb",
                  color: "#fff",
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 600,
                  fontFamily: "inherit",
                  border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.7 : 1,
                  transition: "background 0.2s, transform 0.15s, box-shadow 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                {loading ? (
                  <>
                    <span style={{
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderTopColor: "#fff",
                      animation: "spin 0.65s linear infinite",
                      display: "inline-block",
                    }} />
                    Carregando...
                  </>
                ) : (
                  isLogin ? "Entrar" : "Criar conta"
                )}
              </button>

              {/* Switch */}
              <p style={{
                marginTop: 18,
                fontSize: 13,
                color: "rgba(148,163,184,0.6)",
                textAlign: "center",
              }}>
                {isLogin ? "Não tem uma conta? " : "Já tem uma conta? "}
                <span
                  className="auth-switch-link"
                  onClick={() => setMode(isLogin ? "register" : "login")}
                  style={{
                    color: "#60a5fa",
                    cursor: "pointer",
                    fontWeight: 600,
                    transition: "color 0.15s",
                  }}
                >
                  {isLogin ? "Criar conta" : "Fazer login"}
                </span>
              </p>
            </div>
          </div>

          {/* ── Accent Panel ── */}
          <div
            className="auth-accent-slide auth-accent-panel"
            style={{
              position: "absolute",
              top: 0,
              left: isLogin ? "50%" : 0,
              width: "50%",
              height: "100%",
              background: "linear-gradient(145deg, #1e40af 0%, #3730a3 50%, #6d28d9 100%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "40px 32px",
              textAlign: "center",
              zIndex: 3,
              overflow: "hidden",
            }}
          >
            {/* Decorative orbs */}
            <div style={{
              position: "absolute",
              top: -60,
              right: -40,
              width: 180,
              height: 180,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.05)",
              pointerEvents: "none",
            }} />
            <div style={{
              position: "absolute",
              bottom: -50,
              left: -30,
              width: 140,
              height: 140,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.04)",
              pointerEvents: "none",
            }} />

            {/* Icon */}
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.18)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 20,
              fontSize: 22,
            }}>
              {isLogin ? "👋" : "✨"}
            </div>

            <h3 style={{
              color: "#fff",
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              marginBottom: 10,
              lineHeight: 1.3,
            }}>
              {isLogin ? "Bem-vindo de volta!" : "Junte-se a nós"}
            </h3>

            <p style={{
              color: "rgba(255,255,255,0.65)",
              fontSize: 13,
              lineHeight: 1.6,
              marginBottom: 24,
              maxWidth: 220,
            }}>
              {isLogin
                ? "Entre para continuar de onde parou e acessar seu painel."
                : "Crie sua conta em segundos e comece a usar agora mesmo."}
            </p>

            <button
              className="auth-btn-ghost"
              onClick={() => setMode(isLogin ? "register" : "login")}
              style={{
                padding: "9px 20px",
                border: "1px solid rgba(255,255,255,0.22)",
                background: "transparent",
                color: "#fff",
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "inherit",
                cursor: "pointer",
                transition: "background 0.2s",
              }}
            >
              {isLogin ? "Criar uma conta" : "Já tenho conta"}
            </button>
          </div>

          {/* ── Close ── */}
          <button
            className="auth-close"
            onClick={onClose}
            style={{
              position: "absolute",
              top: 14,
              right: 14,
              width: 30,
              height: 30,
              borderRadius: 8,
              background: "transparent",
              border: "none",
              color: "rgba(148,163,184,0.5)",
              fontSize: 16,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
              transition: "background 0.15s, color 0.15s",
            }}
          >
            ✕
          </button>
        </div>
      </div>
    </>
  );
}
