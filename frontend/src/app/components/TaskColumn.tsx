import React from "react";
import { Task } from "../features/tasks/task.types";
import { TaskCard } from "./TaskCard";

type Props = {
  title: string;
  icon: string;
  tasks: Task[];
  highlight?: boolean;
  holidayLabel?: string;
  holidayDate?: string;
  onTaskClick?: (task: Task) => void;
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

export function TaskColumn({ title, icon, tasks, highlight, holidayLabel, holidayDate, onTaskClick }: Props) {
  const svgIcon = columnIcons[title];
  const isHolidayColumn = Boolean(holidayLabel);
  const formattedHolidayDate = holidayDate
    ? new Date(`${holidayDate.slice(0, 10)}T12:00:00`).toLocaleDateString("pt-BR")
    : "";

  return (
    <div
      style={{
        flex: 1,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        background: isHolidayColumn ? "rgba(250,204,21,0.08)" : "var(--bg-panel)",
        borderRadius: 13,
        padding: "14px 12px",
        border: isHolidayColumn ? "1px solid rgba(250,204,21,0.35)" : "1px solid var(--bg-border-soft)",
        boxShadow: isHolidayColumn ? "inset 0 0 0 1px rgba(250,204,21,0.08)" : "none",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          marginBottom: 12,
          paddingBottom: 12,
          borderBottom: "1px solid var(--bg-border-soft)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <span
            style={{
              color: isHolidayColumn ? "#facc15" : highlight ? "var(--text-secondary)" : "var(--text-muted)",
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
              color: isHolidayColumn ? "#854d0e" : highlight ? "var(--text-primary)" : "var(--text-secondary)",
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
            background:
              isHolidayColumn
                ? "rgba(250,204,21,0.18)"
                : highlight && tasks.length > 0
                  ? "var(--bg-panel-strong)"
                  : "var(--bg-soft)",
            color:
              isHolidayColumn
                ? "#facc15"
                : highlight && tasks.length > 0
                  ? "var(--text-primary)"
                  : "var(--text-muted)",
            border:
              isHolidayColumn
                ? "1px solid rgba(250,204,21,0.35)"
                : highlight && tasks.length > 0
                  ? "1px solid var(--bg-border)"
                  : "1px solid var(--bg-border-soft)",
            minWidth: 26,
            textAlign: "center",
          }}
        >
          {tasks.length}
        </span>
      </div>

      {isHolidayColumn && holidayLabel && (
        <div
          style={{
            marginBottom: 10,
            padding: "6px 8px",
            borderRadius: 8,
            background: "rgba(250,204,21,0.12)",
            border: "1px solid rgba(250,204,21,0.25)",
            color: "#a16207",
            fontSize: 10,
            fontWeight: 700,
            lineHeight: 1.3,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
          }}
        >
          <span style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            🇧🇷 {holidayLabel}
          </span>
          {formattedHolidayDate && <span style={{ flexShrink: 0 }}>{formattedHolidayDate}</span>}
        </div>
      )}

      {/* LISTA DE TASKS (COM SCROLL) */}
      <div
        style={{
          flex: 1,
          minHeight: 0, // 🔥 ESSENCIAL
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          paddingRight: 4,
        }}
      >
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
              stroke="var(--text-muted)"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
              <rect x="9" y="3" width="6" height="4" rx="2" />
            </svg>

            <span
              style={{
                fontSize: 11.5,
                color: "var(--text-muted)",
                fontWeight: 500,
              }}
            >
              Nenhuma tarefa
            </span>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard key={task.id} task={task} onClick={onTaskClick} />
          ))
        )}
      </div>
    </div>
  );
}