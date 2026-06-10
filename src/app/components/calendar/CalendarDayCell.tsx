"use client";

import { useState } from "react";
import type { Task } from "../../features/tasks/task.types";
import { parseDateLocal } from "../../lib/date";

type Props = {
  date: Date;
  tasks: Task[];
  isSelected: boolean;
  onClick: () => void;
  isMobile?: boolean;
  isTablet?: boolean;
};

function getTaskPillColor(task: Task): { bg: string; color: string } {
  const status = task.status;

  if (status === "pendente")
    return { bg: "rgba(239,68,68,0.15)", color: "#fca5a5" };

  if (status === "concluido")
    return { bg: "rgba(34,197,94,0.15)", color: "#86efac" };

  if (status === "em_andamento")
    return { bg: "rgba(59,130,246,0.15)", color: "#93c5fd" };

  if (status === "cancelado")
    return { bg: "rgba(156,163,175,0.12)", color: "#9ca3af" };

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

  const day = date.getDate();
  const today = new Date();
  const isToday = today.toDateString() === date.toDateString();

  const dayTasks = tasks.filter((t) => {
    if (!t?.date) return false;
    const d = parseDateLocal(t.date);
    return d.toDateString() === date.toDateString();
  });

  const maxPills = isMobile ? 0 : 2;
  const visibleTasks = dayTasks.slice(0, maxPills);
  const extraCount = dayTasks.length - visibleTasks.length;

  // 🔥 Inteligência UX
  const isBusy = dayTasks.length >= 4;
  const hasPending = dayTasks.some((t) => t.status === "pendente");

  // 🎨 Estados visuais
  let background = "rgba(255,255,255,0.02)";
  let borderColor = "rgba(255,255,255,0.06)";
  let boxShadow = "none";

  if (isSelected) {
    background = "rgba(56,189,248,0.08)";
    borderColor = "rgba(56,189,248,0.35)";
    boxShadow = "0 0 0 1px rgba(56,189,248,0.2) inset";
  } else if (isToday) {
    background = "rgba(255,255,255,0.04)";
    borderColor = "rgba(148,163,184,0.2)";
  } else if (isBusy) {
    background = "rgba(56,189,248,0.04)";
  } else if (hovered) {
    background = "rgba(255,255,255,0.05)";
    borderColor = "rgba(255,255,255,0.1)";
  }

  if (hasPending && !isSelected) {
    borderColor = "rgba(239,68,68,0.2)";
  }

  const minHeight = isMobile ? 44 : isTablet ? 68 : 80;
  const padding = isMobile ? "6px 5px 4px" : "8px 8px 6px";

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseDown={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "scale(0.97)";
      }}
      onMouseUp={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "scale(1)";
      }}
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
        transition: "all 0.18s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* 🔹 Indicador de hoje */}
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

      {/* 🔢 Número do dia */}
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

        {/* 📱 Mobile → contador */}
        {isMobile && dayTasks.length > 0 && (
          <span
            style={{
              fontSize: 9,
              color: "#38bdf8",
              fontWeight: 600,
              marginLeft: 4,
            }}
          >
            {dayTasks.length}
          </span>
        )}

        {/* Desktop → dot */}
        {!isMobile && dayTasks.length > 0 && (
          <div
            style={{
              width: 4,
              height: 4,
              borderRadius: "50%",
              background: isSelected
                ? "rgba(56,189,248,0.8)"
                : "rgba(56,189,248,0.45)",
            }}
          />
        )}
      </div>

      {/* 📌 Task pills */}
      {visibleTasks.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {visibleTasks.map((task, i: number) => {
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
                }}
              >
                {task?.location ?? "Sem local"}
              </div>
            );
          })}
        </div>
      )}

      {/* ➕ +X mais */}
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
    </div>
  );
}