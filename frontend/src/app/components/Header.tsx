"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useAuthModal } from "../hooks/useAuthModal";
import type { TaskFilter } from "../utils/task";
import { useTasks } from "../hooks/useTasks";
import { parseDateLocal } from "../lib/date";

type Props = {
  filter: TaskFilter;
  setFilter: (value: TaskFilter) => void;
  onMenuClick?: () => void;
  isMobile?: boolean;
};

export function Header({ filter, setFilter, onMenuClick, isMobile }: Props) {
  const { user, logout } = useAuth();
  const { openLogin } = useAuthModal();
  const { allTasks } = useTasks();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window === "undefined") return "dark";
    const storedTheme = localStorage.getItem("taskflow-theme");
    return storedTheme === "light" ? "light" : "dark";
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    document.body.style.background = theme === "light" ? "#f8fafc" : "#0B1120";
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);

    if (typeof window !== "undefined") {
      localStorage.setItem("taskflow-theme", nextTheme);
    }
  };

  const isLightTheme = theme === "light";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const overdueTasks = allTasks.filter((task) => {
    const taskDate = parseDateLocal(task.date);
    return task.status === "pendente" && !Number.isNaN(taskDate.getTime()) && taskDate < today;
  });

  useEffect(() => {
    if (!isNotificationsOpen) return;

    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!notificationsRef.current?.contains(target)) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isNotificationsOpen]);

  const handleProfileClick = () => {
    if (!user) {
      setIsProfileMenuOpen(false);
      openLogin();
      return;
    }

    setIsProfileMenuOpen((prev) => !prev);
  };

  const handleLogout = () => {
    logout();
    setIsProfileMenuOpen(false);
  };

  return (
    <div
      style={{
        width: "100%",
        padding: isMobile ? "0 12px" : "0 24px",
        height: 56,
        background: isLightTheme ? "#f8fafc" : "var(--bg-page-2)",
        borderBottom: isLightTheme ? "1px solid rgba(15,23,42,0.08)" : "1px solid var(--bg-border-soft)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        boxShadow: isLightTheme
          ? "0 1px 0 rgba(15,23,42,0.04), 0 4px 16px rgba(15,23,42,0.08)"
          : "0 1px 0 rgba(0,0,0,0.2), 0 4px 16px rgba(0,0,0,0.15)",
      }}
    >
      {/* ESQUERDA */}
      <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 10 : 24 }}>
        
        {/* MENU */}
        {isMobile && onMenuClick && (
          <button
            onClick={onMenuClick}
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              border: "1px solid var(--bg-border-soft)",
              background: "var(--bg-panel-strong)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path
                d="M3 6h18M3 12h18M3 18h18"
                stroke="var(--text-primary)"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}

        {/* NOME */}
        <h2
          style={{
            fontSize: isMobile ? 14 : 15,
            fontWeight: 700,
            color: isLightTheme ? "#0f172a" : "#f8fafc",
            letterSpacing: "-0.03em",
            whiteSpace: "nowrap",
          }}
        >
          TaskFlow
        </h2>

        {/* DIVIDER */}
        {!isMobile && (
          <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.1)" }} />
        )}

        {/* TABS */}
        <div
          style={{
            display: "flex",
            gap: 2,
            background: isLightTheme ? "rgba(15,23,42,0.04)" : "rgba(255,255,255,0.05)",
            borderRadius: 8,
            padding: "3px",
            border: isLightTheme ? "1px solid rgba(15,23,42,0.08)" : "1px solid rgba(255,255,255,0.07)",
            overflowX: "auto",
            maxWidth: isMobile ? 180 : "none",
          }}
        >
          <Tab label={isMobile ? "Tot" : "Total"} active={filter === "todas"} isLightTheme={isLightTheme} onClick={() => setFilter("todas")} />
          <Tab label={isMobile ? "Pend" : "Pendentes"} active={filter === "pendente"} isLightTheme={isLightTheme} onClick={() => setFilter("pendente")} />
          <Tab label={isMobile ? "Conc" : "Concluídos"} active={filter === "concluido"} isLightTheme={isLightTheme} onClick={() => setFilter("concluido")} />
        </div>
      </div>

      {/* DIREITA */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        
        {/* SEARCH */}
        {!isMobile && (
          <div style={{ position: "relative" }}>
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgba(148,163,184,0.5)"
              strokeWidth="2.5"
              strokeLinecap="round"
              style={{
                position: "absolute",
                left: 10,
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
              }}
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>

            <input
              placeholder="Buscar tarefas..."
              style={{
                padding: "7px 12px 7px 30px",
                borderRadius: 8,
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.05)",
                color: "#e2e8f0",
                fontSize: 12.5,
                outline: "none",
                width: 180,
              }}
            />
          </div>
        )}

        <button
          type="button"
          onClick={toggleTheme}
          title={isLightTheme ? "Ativar modo escuro" : "Ativar modo claro"}
          aria-label={isLightTheme ? "Ativar modo escuro" : "Ativar modo claro"}
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            border: isLightTheme ? "1px solid rgba(15,23,42,0.1)" : "1px solid rgba(255,255,255,0.07)",
            background: isLightTheme ? "rgba(15,23,42,0.04)" : "rgba(255,255,255,0.04)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: isLightTheme ? "#0f172a" : "rgba(148,163,184,0.7)",
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          {isLightTheme ? "☀" : "☾"}
        </button>

        {/* ICONES ORIGINAIS */}
        {[
          {
            label: "Calendário",
            href: "/calendar",
            path: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
          },
          {
            label: "Notificações",
            path: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
          },
        ].map(({ label, href, path }) => {
          const iconButton = (
            <div
              title={label}
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                border: isLightTheme ? "1px solid rgba(15,23,42,0.08)" : "1px solid var(--bg-border-soft)",
                background: isLightTheme ? "rgba(15,23,42,0.04)" : "var(--bg-panel-strong)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: isLightTheme ? "#0f172a" : "var(--text-secondary)",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d={path} />
              </svg>
            </div>
          );

          if (label === "Notificações") {
            return (
              <div key={label} ref={notificationsRef} style={{ position: "relative" }}>
                <button
                  type="button"
                  title={label}
                  aria-label={`${label}${overdueTasks.length ? `: ${overdueTasks.length} atrasadas` : ""}`}
                  onClick={() => setIsNotificationsOpen((previous) => !previous)}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    border: isLightTheme ? "1px solid rgba(15,23,42,0.08)" : "1px solid var(--bg-border-soft)",
                    background: isLightTheme ? "rgba(15,23,42,0.04)" : "var(--bg-panel-strong)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: isLightTheme ? "#0f172a" : "var(--text-secondary)",
                    position: "relative",
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d={path} />
                  </svg>
                  {overdueTasks.length > 0 && (
                    <span
                      style={{
                        position: "absolute",
                        top: -5,
                        right: -5,
                        minWidth: 16,
                        height: 16,
                        padding: "0 4px",
                        borderRadius: 999,
                        background: "#ef4444",
                        color: "#fff",
                        fontSize: 9,
                        fontWeight: 800,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: isLightTheme ? "2px solid #f8fafc" : "2px solid #0f172a",
                      }}
                    >
                      {overdueTasks.length > 99 ? "99+" : overdueTasks.length}
                    </span>
                  )}
                </button>

                {isNotificationsOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 8px)",
                      right: 0,
                      width: isMobile ? 250 : 300,
                      maxWidth: "calc(100vw - 24px)",
                      background: "var(--bg-page)",
                      border: "1px solid var(--bg-border)",
                      borderRadius: 10,
                      boxShadow: "0 12px 32px var(--shadow-soft)",
                      overflow: "hidden",
                      zIndex: 60,
                    }}
                  >
                    <div
                      style={{
                        padding: "11px 13px",
                        borderBottom: "1px solid var(--bg-border-soft)",
                        color: "var(--text-primary)",
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      Notificações
                    </div>
                    {overdueTasks.length === 0 ? (
                      <p style={{ margin: 0, padding: "18px 13px", color: "var(--text-secondary)", fontSize: 12 }}>
                        Nenhuma tarefa pendente atrasada.
                      </p>
                    ) : (
                      <div style={{ maxHeight: 260, overflowY: "auto" }}>
                        {overdueTasks.map((task) => (
                          <div
                            key={task.id}
                            style={{
                              padding: "10px 13px",
                              borderBottom: "1px solid var(--bg-border-soft)",
                              display: "flex",
                              flexDirection: "column",
                              gap: 3,
                            }}
                          >
                            <strong style={{ color: "var(--text-primary)", fontSize: 12 }}>
                              {task.title || task.location || "Tarefa pendente"}
                            </strong>
                            <span style={{ color: "var(--text-secondary)", fontSize: 11 }}>
                              Atrasada desde {taskDateLabel(task.date)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          }

          return href ? (
            <Link key={label} href={href} aria-label={label} style={{ textDecoration: "none" }}>
              {iconButton}
            </Link>
          ) : (
            <button
              key={label}
              title={label}
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                border: isLightTheme ? "1px solid rgba(15,23,42,0.08)" : "1px solid var(--bg-border-soft)",
                background: isLightTheme ? "rgba(15,23,42,0.04)" : "var(--bg-panel-strong)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: isLightTheme ? "#0f172a" : "var(--text-secondary)",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d={path} />
              </svg>
            </button>
          );
        })}

        {/* PERFIL / LOGIN */}
        <div style={{ position: "relative" }}>
          <div
            onClick={handleProfileClick}
            title={user ? user.email : "Entrar"}
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: isLightTheme ? "linear-gradient(135deg, #cbd5e1, #94a3b8)" : "linear-gradient(135deg, #475569, #334155)",
              border: isLightTheme ? "2px solid rgba(15,23,42,0.08)" : "2px solid rgba(255,255,255,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 700,
              color: isLightTheme ? "#0f172a" : "#e2e8f0",
              cursor: "pointer",
              userSelect: "none",
            }}
          >
            {user ? user.email.charAt(0).toUpperCase() : "→"}
          </div>

          {user && isProfileMenuOpen && (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: "calc(100% + 8px)",
                minWidth: 150,
                background: "var(--bg-page)",
                border: "1px solid var(--bg-border)",
                borderRadius: 10,
                boxShadow: "0 12px 32px var(--shadow-soft)",
                overflow: "hidden",
                zIndex: 50,
              }}
            >
              <div
                style={{
                  padding: "10px 12px",
                  borderBottom: isLightTheme ? "1px solid rgba(15,23,42,0.08)" : "1px solid rgba(255,255,255,0.08)",
                  color: isLightTheme ? "#0f172a" : "#e2e8f0",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                {user.email}
              </div>

              <button
                onClick={handleLogout}
                style={{
                  width: "100%",
                  border: "none",
                  background: "transparent",
                  color: "#ef4444",
                  textAlign: "left",
                  padding: "10px 12px",
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// TAB
type TabProps = {
  label: string;
  active: boolean;
  isLightTheme: boolean;
  onClick: () => void;
};

function Tab({ label, active, isLightTheme, onClick }: TabProps) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "5px 10px",
        borderRadius: 6,
        border: "none",
        cursor: "pointer",
        background: active ? (isLightTheme ? "#dbeafe" : "#1e293b") : "transparent",
        color: active ? (isLightTheme ? "#0f172a" : "#f1f5f9") : (isLightTheme ? "#475569" : "rgba(148,163,184,0.6)"),
        fontWeight: active ? 600 : 400,
        fontSize: 12,
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}
    >
      {label}
    </button>
  );
}

function taskDateLabel(date: string) {
  return parseDateLocal(date).toLocaleDateString("pt-BR");
}