import React from "react";
import { Task } from "../features/tasks/task.types";
import { TaskCard } from "./TaskCard";

type Props = {
  title: string;
  icon: string;
  tasks: Task[];
  highlight?: boolean;
};

// Ícones SVG por coluna
const columnIcons: Record<string, React.ReactNode> = {
  Hoje: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Amanhã: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  Próximos: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="13 17 18 12 13 7" />
      <polyline points="6 17 11 12 6 7" />
    </svg>
  ),
};

export function TaskColumn({ title, icon, tasks, highlight }: Props) {
  const svgIcon = columnIcons[title];

  return (
    <div
      style={{
        flex: 1,
        height: "100%",
        background: "rgba(255,255,255,0.025)",
        borderRadius: 13,
        padding: "14px 12px",
        minHeight: 300,
        border: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        flexDirection: "column",
        gap: 0,
      }}
    >
      {/* HEADER DA COLUNA */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
          paddingBottom: 12,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          {/* Ícone SVG ou fallback emoji */}
          <span
            style={{
              color: highlight ? "#94a3b8" : "rgba(148,163,184,0.5)",
              display: "flex",
              alignItems: "center",
            }}
          >
            {svgIcon ?? <span style={{ fontSize: 13 }}>{icon}</span>}
          </span>

          <h3
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: highlight ? "#e2e8f0" : "rgba(226,232,240,0.7)",
              letterSpacing: "-0.01em",
            }}
          >
            {title}
          </h3>
        </div>

        {/* CONTADOR */}
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            padding: "3px 9px",
            borderRadius: 6,
            background: highlight && tasks.length > 0
              ? "rgba(241,245,249,0.12)"
              : "rgba(255,255,255,0.06)",
            color: highlight && tasks.length > 0 ? "#f1f5f9" : "rgba(148,163,184,0.5)",
            border: highlight && tasks.length > 0
              ? "1px solid rgba(241,245,249,0.15)"
              : "1px solid rgba(255,255,255,0.07)",
            minWidth: 26,
            textAlign: "center",
          }}
        >
          {tasks.length}
        </span>
      </div>

      {/* LISTA DE TASKS */}
      <div style={{ flex: 1 }}>
        {tasks.length === 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "32px 16px",
              gap: 8,
            }}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgba(148,163,184,0.2)"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
              <rect x="9" y="3" width="6" height="4" rx="2" />
            </svg>
            <span style={{ fontSize: 11.5, color: "rgba(148,163,184,0.25)", fontWeight: 500 }}>
              Nenhuma tarefa
            </span>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))
        )}
      </div>
    </div>
  );
}
