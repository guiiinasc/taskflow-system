"use client";

import { useState } from "react";

type Props = {
  date: Date;
  tasks: any[];
  isSelected: boolean;
  onClick: () => void;
  isMobile?: boolean;
  isTablet?: boolean;
};

function getTaskPillColor(task: any): { bg: string; color: string } {
  const status = task?.status?.toLowerCase() ?? "";
  if (status === "pending")   return { bg: "rgba(251,191,36,0.15)",  color: "#fbbf24" };
  if (status === "completed") return { bg: "rgba(34,197,94,0.15)",   color: "#4ade80" };
  if (status === "priority")  return { bg: "rgba(248,113,113,0.15)", color: "#f87171" };
  return { bg: "rgba(56,189,248,0.12)", color: "#38bdf8" };
}

export function CalendarDayCell({
  date,
  tasks,
  isSelected,
  onClick,
  isMobile = false,
  isTablet = false,
}: Props) {
  const [hovered, setHovered] = useState(false);

  const day   = date.getDate();
  const today = new Date();
  const isToday = today.toDateString() === date.toDateString();

  const dayTasks = tasks.filter((t: any) => {
    if (!t?.date) return false;
    return new Date(t.date).toDateString() === date.toDateString();
  });

  // Mobile mostra 0 pills (só dot), tablet/desktop mostra até 2
  const maxPills    = isMobile ? 0 : 2;
  const visibleTasks = dayTasks.slice(0, maxPills);
  const extraCount   = dayTasks.length - visibleTasks.length;

  // Estados visuais
  let background  = "rgba(255,255,255,0.02)";
  let borderColor = "rgba(255,255,255,0.06)";
  let boxShadow   = "none";

  if (isSelected) {
    background  = "rgba(56,189,248,0.08)";
    borderColor = "rgba(56,189,248,0.35)";
    boxShadow   = "0 0 0 1px rgba(56,189,248,0.2) inset";
  } else if (isToday) {
    background  = "rgba(255,255,255,0.04)";
    borderColor = "rgba(148,163,184,0.2)";
  } else if (hovered) {
    background  = "rgba(255,255,255,0.05)";
    borderColor = "rgba(255,255,255,0.1)";
  }

  // Altura adaptativa
  const minHeight = isMobile ? 44 : isTablet ? 68 : 80;
  const padding   = isMobile ? "6px 5px 4px" : "8px 8px 6px";

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        minHeight,
        borderRadius: isMobile ? 8 : 10,
        padding,
        cursor: "pointer",
        background,
        border: `1px solid ${borderColor}`,
        boxShadow,
        display: "flex",
        flexDirection: "column",
        gap: isMobile ? 3 : 5,
        transition: "background 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Indicador de hoje */}
      {isToday && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: isMobile ? 5 : 8,
            right: isMobile ? 5 : 8,
            height: 2,
            borderRadius: "0 0 3px 3px",
            background: "rgba(148,163,184,0.4)",
          }}
        />
      )}

      {/* Número do dia + dot indicator */}
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <span
          style={{
            fontSize: isMobile ? 11 : 12,
            fontWeight: isSelected || isToday ? 600 : 400,
            color: isSelected
              ? "#38bdf8"
              : isToday
              ? "#e2e8f0"
              : "rgba(148,163,184,0.7)",
            lineHeight: 1,
          }}
        >
          {day}
        </span>

        {/* Dot no mobile quando há tasks */}
        {dayTasks.length > 0 && (
          <div
            style={{
              width: isMobile ? 3 : 4,
              height: isMobile ? 3 : 4,
              borderRadius: "50%",
              background: isSelected ? "rgba(56,189,248,0.8)" : "rgba(56,189,248,0.45)",
              flexShrink: 0,
            }}
          />
        )}
      </div>

      {/* Task pills — apenas tablet e desktop */}
      {visibleTasks.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {visibleTasks.map((task: any, i: number) => {
            const { bg, color } = getTaskPillColor(task);
            return (
              <div
                key={task?.id ?? i}
                style={{
                  fontSize: 10,
                  fontWeight: 500,
                  color,
                  background: bg,
                  borderRadius: 5,
                  padding: "2px 6px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  lineHeight: 1.4,
                }}
              >
                {task?.title ?? "Task"}
              </div>
            );
          })}
        </div>
      )}

      {/* +X mais — tablet/desktop */}
      {!isMobile && extraCount > 0 && (
        <span
          style={{
            fontSize: 10,
            color: "rgba(148,163,184,0.45)",
            marginTop: 1,
          }}
        >
          +{extraCount} mais
        </span>
      )}

      {/* Mobile: count badge quando tem muitas tasks */}
      {isMobile && dayTasks.length > 1 && isSelected && (
        <span
          style={{
            fontSize: 9,
            color: "#38bdf8",
            fontWeight: 600,
          }}
        >
          {dayTasks.length}
        </span>
      )}
    </div>
  );
}
