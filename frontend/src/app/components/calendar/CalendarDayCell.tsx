"use client";

import { useMemo, useState } from "react";
import type { Task } from "../../features/tasks/task.types";
import type { Holiday } from "../../features/holidays/holiday.types";
import { getHolidayByDate } from "../../features/holidays/holiday.utils";
import { parseDateLocal, toLocalDateString } from "../../lib/date";
import { useTasks } from "../../hooks/useTasks";
import { useToast } from "../../contexts/ToastContext";

type Props = {
  date: Date;
  tasks: Task[];
  holidays?: Holiday[];
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
  holidays = [],
  isSelected,
  onClick,
  isMobile = false,
  isTablet = false,
}: Props) {
  const [hovered, setHovered] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [pendingMove, setPendingMove] = useState<{
    taskId: string;
    taskLocation: string;
    fromDate: string;
    toDate: string;
  } | null>(null);
  const { updateTask } = useTasks();
  const { showToast } = useToast();

  const day = date.getDate();
  const today = new Date();
  const isToday = today.toDateString() === date.toDateString();
  const holiday = useMemo(() => getHolidayByDate(date, holidays), [date, holidays]);

  const dayTasks = tasks.filter((t) => {
    if (!t?.date) return false;
    const d = parseDateLocal(t.date);
    return d.toDateString() === date.toDateString();
  });

  const maxPills = isMobile ? 0 : 2;
  const visibleTasks = dayTasks.slice(0, maxPills);
  const extraCount = dayTasks.length - visibleTasks.length;

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const taskId = event.dataTransfer.getData("text/task-id");
    if (!taskId) {
      setIsDragOver(false);
      return;
    }

    const nextDate = toLocalDateString(date);
    const currentTask = tasks.find((task) => task.id === taskId);

    if (!currentTask || currentTask.date === nextDate || currentTask.status === "concluido") {
      setIsDragOver(false);
      return;
    }

    setPendingMove({
      taskId,
      taskLocation: currentTask.location || "Task",
      fromDate: currentTask.date,
      toDate: nextDate,
    });
    setIsDragOver(false);
  };

  const confirmMoveTask = async () => {
    if (!pendingMove) return;

    await updateTask(pendingMove.taskId, { date: pendingMove.toDate });
    showToast(
      `Task atualizada! Data: ${parseDateLocal(pendingMove.toDate).toLocaleDateString("pt-BR")}`,
      "success"
    );
    setPendingMove(null);
  };

  // 🔥 Inteligência UX
  const isBusy = dayTasks.length >= 4;
  const hasPending = dayTasks.some((t) => t.status === "pendente");
  const isHolidayDay = Boolean(holiday);

  // 🎨 Estados visuais
  let background = "rgba(255,255,255,0.02)";
  let borderColor = "rgba(255,255,255,0.06)";
  let boxShadow = "none";

  if (isSelected) {
    background = isHolidayDay ? "rgba(250,204,21,0.12)" : "rgba(56,189,248,0.08)";
    borderColor = isHolidayDay ? "rgba(250,204,21,0.5)" : "rgba(56,189,248,0.35)";
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

  if (isHolidayDay && !isSelected) {
    borderColor = "rgba(250,204,21,0.4)";
    background = "rgba(250,204,21,0.06)";
  }

  if (isDragOver) {
    background = "rgba(52, 211, 153, 0.12)";
    borderColor = "rgba(52, 211, 153, 0.6)";
    boxShadow = "0 0 0 1px rgba(52,211,153,0.3) inset, 0 0 0 3px rgba(52,211,153,0.08)";
  }

  const minHeight = isMobile ? 44 : isTablet ? 68 : 80;
  const padding = isMobile ? "6px 5px 4px" : "8px 8px 6px";

  return (
    <>
      {pendingMove && (
        <div
          onClick={() => setPendingMove(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(2, 6, 23, 0.72)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
            padding: 20,
          }}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            style={{
              width: "min(92vw, 420px)",
              background: "#0F172A",
              border: "1px solid rgba(148,163,184,0.2)",
              borderRadius: 18,
              padding: "22px 20px 18px",
              boxShadow: "0 32px 80px rgba(15, 23, 42, 0.6)",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 11,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#7dd3fc",
                fontWeight: 700,
              }}
            >
              Alterar data
            </p>
            <h3
              style={{
                margin: "10px 0 8px",
                fontSize: 22,
                color: "#f8fafc",
                fontWeight: 700,
              }}
            >
              Mover tarefa?
            </h3>
            <p
              style={{
                margin: 0,
                color: "rgba(148,163,184,0.8)",
                fontSize: 14,
                lineHeight: 1.6,
              }}
            >
              Deseja mover <strong style={{ color: "#f8fafc" }}>{pendingMove.taskLocation}</strong> de <strong style={{ color: "#f8fafc" }}>{parseDateLocal(pendingMove.fromDate).toLocaleDateString("pt-BR")}</strong> para <strong style={{ color: "#f8fafc" }}>{parseDateLocal(pendingMove.toDate).toLocaleDateString("pt-BR")}</strong>?
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 10,
                marginTop: 20,
              }}
            >
              <button
                onClick={() => setPendingMove(null)}
                style={{
                  background: "rgba(148,163,184,0.08)",
                  color: "#e2e8f0",
                  border: "1px solid rgba(148,163,184,0.18)",
                  borderRadius: 10,
                  padding: "10px 14px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Cancelar
              </button>
              <button
                onClick={confirmMoveTask}
                style={{
                  background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  padding: "10px 14px",
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 10px 24px rgba(59,130,246,0.35)",
                }}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

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
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
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

      {isHolidayDay && (
        <div
          style={{
            position: "absolute",
            top: 4,
            right: 6,
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#facc15",
            boxShadow: "0 0 8px rgba(250,204,21,0.75)",
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

      {isHolidayDay && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            fontSize: 9,
            fontWeight: 700,
            color: "#facc15",
            background: "rgba(250,204,21,0.12)",
            borderRadius: 5,
            padding: "2px 5px",
            lineHeight: 1.2,
          }}
        >
          <span>🇧🇷</span>
          <span>Feriado</span>
        </div>
      )}

      {/* 📌 Task pills */}
      {visibleTasks.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {visibleTasks.map((task, i: number) => {
            const { bg, color } = getTaskPillColor(task);
            return (
              <div
                key={task?.id ?? i}
                draggable={task.status !== "concluido"}
                onDragStart={(event) => {
                  if (task.status === "concluido") {
                    event.preventDefault();
                    return;
                  }
                  event.dataTransfer.setData("text/task-id", task.id);
                  event.dataTransfer.effectAllowed = "move";
                  event.stopPropagation();
                }}
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
                  cursor: "grab",
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
    </>
  );
}