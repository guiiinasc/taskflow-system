"use client";

import { useEffect, useRef, useState } from "react";
import { parseDateLocal } from "../../lib/date";
import { useTaskDetailsModal } from "../../hooks/useDetailsTaskModal";
import { TaskDetailsModal } from "../modals/DetailsTaskModal";
import type { Task } from "../../features/tasks/task.types";
import type { Holiday } from "../../features/holidays/holiday.types";
import type { TaskFilter } from "../../utils/task";
import { getTaskDisplayId } from "../../utils/task";
import { getHolidayByDate } from "../../features/holidays/holiday.utils";

type Props = {
  selectedDate: Date | null;
  tasks: Task[];
  holidays?: Holiday[];
  isMobile?: boolean;
  isTablet?: boolean;
  filter?: TaskFilter;
  onTaskClick?: (task: Task) => void;
};

function getStatusStyle(status: Task["status"]): { bg: string; color: string; label: string } {
  if (status === "pendente") return { bg: "rgba(248,113,113,0.14)", color: "#f87171", label: "Pendente" };
  if (status === "concluido") return { bg: "rgba(74,222,128,0.14)", color: "#4ade80", label: "Concluído" };
  if (status === "cancelado") return { bg: "rgba(156,163,175,0.12)", color: "#9ca3af", label: "Cancelado" };
  return { bg: "rgba(56,189,248,0.12)", color: "#38bdf8", label: "Em andamento" };
}

function getFilterBadge(filter: TaskFilter): { label: string; bg: string; color: string } {
  if (filter === "pendente") return { label: "Pendentes", bg: "rgba(251,191,36,0.12)", color: "#fbbf24" };
  if (filter === "concluido") return { label: "Concluídos", bg: "rgba(74,222,128,0.12)", color: "#4ade80" };
  return { label: "Todas", bg: "rgba(148,163,184,0.08)", color: "rgba(148,163,184,0.7)" };
}

function IconClock() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconCalendar() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

const ANIM_STYLE = `
  @keyframes _sfp_fadeSlideIn {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes _sfp_cardIn {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

function useInjectStyles() {
  useEffect(() => {
    const id = "__sfp_animations__";
    if (document.getElementById(id)) return;
    const el = document.createElement("style");
    el.id = id;
    el.textContent = ANIM_STYLE;
    document.head.appendChild(el);
  }, []);
}

function EmptyPrompt({ isMobile }: { isMobile: boolean }) {
  return (
    <div
      style={{
        width: isMobile ? "100%" : undefined,
        background: "var(--bg-panel)",
        border: "1px solid var(--bg-border-soft)",
        borderRadius: 13,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: isMobile ? "28px 24px" : "40px 24px",
        gap: 10,
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.07)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "rgba(148,163,184,0.35)",
        }}
      >
        <IconCalendar />
      </div>
      <p style={{ fontSize: 13, color: "rgba(148,163,184,0.4)", textAlign: "center", lineHeight: 1.5 }}>
        Selecione um dia para<br />ver as tarefas
      </p>
    </div>
  );
}

function TaskCard({
  task,
  index,
  isMobile,
  animKey,
  onClick,
  onDragStart,
}: {
  task: Task;
  index: number;
  isMobile: boolean;
  animKey: string;
  onClick?: (task: Task) => void;
  onDragStart?: (event: React.DragEvent<HTMLDivElement>, task: Task) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const status = getStatusStyle(task.status);
  const typeLabel =
    task.type === "outro"
      ? task.customType || "Outro"
      : task.type === "entrega"
        ? "Entrega"
        : "Manutenção";

  const secondaryText =
    task.type === "entrega"
      ? task.quantity != null
        ? `${task.quantity} unidades`
        : "Quantidade não definida"
      : task.description || "Sem descrição";

  return (
    <div
      key={animKey + index}
      draggable={task.status !== "concluido"}
      onDragStart={(event) => {
        if (task.status === "concluido") {
          event.preventDefault();
          return;
        }
        event.dataTransfer.setData("text/task-id", task.id);
        event.dataTransfer.effectAllowed = "move";
        onDragStart?.(event, task);
      }}
      onClick={() => onClick?.(task)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "var(--bg-panel-strong)" : "var(--bg-panel)",
        border: `1px solid ${hovered ? "var(--bg-border)" : "var(--bg-border-soft)"}`,
        borderRadius: 14,
        padding: isMobile ? "14px 14px" : "16px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        cursor: "pointer",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 12px 35px var(--shadow-soft)"
          : "0 1px 0 var(--bg-border-soft) inset",
        transition: "transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease, background 180ms ease",
        animation: `_sfp_cardIn 220ms ease-out both`,
        animationDelay: `${index * 36}ms`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}>
          <span
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
              lineHeight: 1.35,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {task?.location ?? "Local desconhecido"}
          </span>
          <p
            style={{
              fontSize: 12,
              color: "var(--text-secondary)",
              lineHeight: 1.5,
              margin: 0,
              minHeight: 18,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {secondaryText}
          </p>
        </div>

        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: "var(--text-secondary)",
            background: "var(--bg-soft)",
            border: "1px solid var(--bg-border-soft)",
            borderRadius: 999,
            padding: "6px 10px",
            textTransform: "capitalize",
            whiteSpace: "nowrap",
          }}
        >
          {typeLabel}
        </span>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          borderTop: "1px solid var(--bg-border-soft)",
          paddingTop: 10,
          marginTop: 2,
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            color: "var(--text-secondary)",
            fontSize: 11,
            fontWeight: 500,
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" />
            <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
          </svg>
          {getTaskDisplayId(task.id)}
        </span>

        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            color: status.color,
            background: status.bg,
            borderRadius: 999,
            padding: "5px 9px",
            fontSize: 10,
            fontWeight: 600,
            textTransform: "capitalize",
          }}
        >
          {task.status === "concluido" ? <IconCheck /> : <IconClock />}
          {status.label}
        </span>
      </div>
    </div>
  );
}

export function CalendarSidePanel({
  selectedDate,
  tasks,
  holidays = [],
  isMobile = false,
  isTablet = false,
  filter = "todas",
  onTaskClick,
}: Props) {
  useInjectStyles();

  const {
    isOpen: isDetailsOpen,
    selectedTask,
    open: openDetails,
    close: closeDetails
  } = useTaskDetailsModal();

  const shouldRenderInternalDetails = !onTaskClick;

  const [animKey, setAnimKey] = useState("");
  const prevDateRef = useRef<string>("");

  useEffect(() => {
    const key = selectedDate?.toDateString() ?? "";
    if (key !== prevDateRef.current) {
      prevDateRef.current = key;
      setAnimKey(key + Date.now());
    }
  }, [selectedDate]);

  if (!selectedDate) return <EmptyPrompt isMobile={isMobile} />;

  const holiday = getHolidayByDate(selectedDate, holidays);

  const dayTasks = tasks.filter((t) => {
    if (!t?.date) return false;
    const d = parseDateLocal(t.date);
    return d.toDateString() === selectedDate.toDateString();
  });

  const filteredTasks = dayTasks.filter((t) => {
    if (filter === "pendente") return t.status === "pendente";
    if (filter === "concluido") return t.status === "concluido";
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const order: Record<Task["status"], number> = {
      pendente: 0,
      em_andamento: 1,
      concluido: 2,
      cancelado: 3,
    };
    return order[a.status] - order[b.status];
  });

  const weekday = selectedDate.toLocaleString("pt-BR", { weekday: "long" });
  const dateLabel = selectedDate.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const today = new Date();
  const isToday = today.toDateString() === selectedDate.toDateString();
  const filterBadge = getFilterBadge(filter);

  const panelWidth = isMobile ? "100%" : isTablet ? 240 : 288;

  return (
    <div
      style={{
        width: panelWidth,
        flexShrink: 0,
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 13,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        maxHeight: isMobile ? 420 : undefined,
        animation: animKey ? "_sfp_fadeSlideIn 200ms ease-out both" : undefined,
      }}
    >
      <div
        style={{
          padding: isMobile ? "14px 16px 13px" : "16px 18px 14px",
          borderBottom: "1px solid var(--bg-border-soft)",
          background: "var(--bg-soft)",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 4,
          }}
        >
          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--text-secondary)",
            }}
          >
            {weekday}
          </span>
          {isToday && (
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                background: "rgba(56,189,248,0.1)",
                color: "#38bdf8",
                borderRadius: 6,
                padding: "2px 8px",
                letterSpacing: "0.04em",
              }}
            >
              Hoje
            </span>
          )}
        </div>

        <h3
          style={{
            fontSize: isMobile ? 14 : 15,
            fontWeight: 600,
            color: "var(--text-primary)",
            letterSpacing: "-0.01em",
            marginBottom: 10,
          }}
        >
          {dateLabel}
        </h3>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
          }}
        >
          <span
            style={{
              fontSize: 11,
              color: "var(--text-secondary)",
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: 18,
                height: 18,
                borderRadius: 5,
                background: sortedTasks.length > 0
                  ? "rgba(56,189,248,0.1)"
                  : "rgba(255,255,255,0.04)",
                color: sortedTasks.length > 0
                  ? "#38bdf8"
                  : "rgba(148,163,184,0.3)",
                fontSize: 10,
                fontWeight: 700,
                padding: "0 4px",
              }}
            >
              {sortedTasks.length}
            </span>
            {sortedTasks.length === 1 ? "tarefa" : "tarefas"}
            {dayTasks.length !== sortedTasks.length && (
              <span style={{ color: "rgba(148,163,184,0.3)" }}>
                de {dayTasks.length}
              </span>
            )}
          </span>

          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              background: filterBadge.bg,
              color: filterBadge.color,
              borderRadius: 6,
              padding: "3px 8px",
              letterSpacing: "0.04em",
              flexShrink: 0,
            }}
          >
            {filterBadge.label}
          </span>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: isMobile ? "10px 12px 14px" : "12px 14px 16px",
          display: "flex",
          flexDirection: "column",
          gap: isMobile ? 7 : 8,
          scrollBehavior: "smooth",
        }}
      >
        {holiday && (
          <div
            style={{
              background: "rgba(250,204,21,0.1)",
              border: "1px solid rgba(250,204,21,0.28)",
              borderRadius: 12,
              padding: "10px 12px",
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: "#facc15",
              fontSize: 12,
              fontWeight: 600,
              lineHeight: 1.4,
            }}
          >
            <span aria-label="feriado">🇧🇷</span>
            <span>{holiday.name}</span>
          </div>
        )}

        {sortedTasks.length === 0 ? (
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "28px 0",
              gap: 8,
              animation: "_sfp_fadeSlideIn 200ms ease-out both",
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 9,
                background: "var(--bg-soft)",
                border: "1px solid var(--bg-border-soft)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "rgba(148,163,184,0.2)",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
                <rect x="9" y="3" width="6" height="4" rx="2" />
              </svg>
            </div>
            <p style={{ fontSize: 12, color: "var(--text-muted)", textAlign: "center", lineHeight: 1.5 }}>
              {dayTasks.length > 0
                ? "Nenhuma tarefa\nneste filtro"
                : "Dia livre"}
            </p>
          </div>
        ) : (
          sortedTasks.map((task, i: number) => (
            <TaskCard
              key={task.id + animKey}
              task={task}
              index={i}
              isMobile={isMobile}
              animKey={animKey}
              onClick={onTaskClick ?? openDetails}
              onDragStart={(event) => {
                event.dataTransfer.setData("text/task-id", task.id);
                event.dataTransfer.effectAllowed = "move";
              }}
            />
          ))
        )}

        {shouldRenderInternalDetails && (
          <TaskDetailsModal
            isOpen={isDetailsOpen}
            task={selectedTask}
            onClose={closeDetails}
          />
        )}
      </div>
    </div>
  );
}
