"use client";

import { useEffect, useRef, useState } from "react";

type FilterType = "todas" | "pendente" | "concluido";

type Props = {
  selectedDate: Date | null;
  tasks: any[];
  isMobile?: boolean;
  isTablet?: boolean;
  filter?: FilterType;
};

// ─── Helpers de status ──────────────────────────────────────────────────────

function getStatusStyle(status: string): { bg: string; color: string; label: string } {
  const s = status?.toLowerCase() ?? "";
  if (s === "pending")   return { bg: "rgba(251,191,36,0.14)",  color: "#fbbf24", label: "Pendente" };
  if (s === "completed") return { bg: "rgba(74,222,128,0.14)",  color: "#4ade80", label: "Concluído" };
  if (s === "priority")  return { bg: "rgba(248,113,113,0.14)", color: "#f87171", label: "Prioridade" };
  return { bg: "rgba(56,189,248,0.12)", color: "#38bdf8", label: "Em andamento" };
}

function getFilterBadge(filter: FilterType): { label: string; bg: string; color: string } {
  if (filter === "pendente")  return { label: "Pendentes",   bg: "rgba(251,191,36,0.12)",  color: "#fbbf24" };
  if (filter === "concluido") return { label: "Concluídos",  bg: "rgba(74,222,128,0.12)",  color: "#4ade80" };
  return                              { label: "Todas",       bg: "rgba(148,163,184,0.08)", color: "rgba(148,163,184,0.7)" };
}

// ─── Ícones ──────────────────────────────────────────────────────────────────

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

// ─── CSS de animações (injetado uma vez) ─────────────────────────────────────

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

// ─── Estado vazio (nenhum dia selecionado) ────────────────────────────────────

function EmptyPrompt({ isMobile }: { isMobile: boolean }) {
  return (
    <div
      style={{
        width: isMobile ? "100%" : undefined,
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.07)",
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

// ─── Card individual de task ──────────────────────────────────────────────────

function TaskCard({
  task,
  index,
  isMobile,
  animKey,
}: {
  task: any;
  index: number;
  isMobile: boolean;
  animKey: string;
}) {
  const [hovered, setHovered] = useState(false);
  const { bg, color, label } = getStatusStyle(task?.status ?? "");
  const isCompleted = task?.status?.toLowerCase() === "completed";

  return (
    <div
      key={animKey + index}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.03)",
        border: `1px solid ${hovered ? "rgba(255,255,255,0.11)" : "rgba(255,255,255,0.07)"}`,
        borderRadius: 10,
        padding: isMobile ? "10px 12px" : "12px 14px",
        display: "flex",
        flexDirection: "column",
        gap: 6,
        cursor: "default",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 4px 16px rgba(0,0,0,0.25), 0 1px 0 rgba(255,255,255,0.04) inset"
          : "0 1px 0 rgba(255,255,255,0.03) inset",
        transition: "background 0.15s ease, border-color 0.15s ease, transform 0.18s ease, box-shadow 0.18s ease",
        // Stagger de entrada
        animation: `_sfp_cardIn 220ms ease-out both`,
        animationDelay: `${index * 40}ms`,
      }}
    >
      {/* Título */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
        {/* Ícone de status */}
        <div
          style={{
            width: 18,
            height: 18,
            borderRadius: 5,
            background: bg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color,
            flexShrink: 0,
            marginTop: 1,
          }}
        >
          <IconCheck />
        </div>
        <p
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: isCompleted ? "rgba(148,163,184,0.55)" : "#e2e8f0",
            lineHeight: 1.35,
            margin: 0,
            textDecoration: isCompleted ? "line-through" : "none",
            flex: 1,
          }}
        >
          {task?.title ?? "Tarefa"}
        </p>
      </div>

      {/* Descrição opcional */}
      {task?.description && (
        <p
          style={{
            fontSize: 11,
            fontWeight: 400,
            color: "rgba(148,163,184,0.5)",
            lineHeight: 1.5,
            margin: "0 0 0 26px",
          }}
        >
          {task.description}
        </p>
      )}

      {/* Rodapé: metadata + badge */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 2,
          gap: 8,
          paddingLeft: 26,
        }}
      >
        {/* Esquerda: horário */}
        {task?.time ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              color: "rgba(148,163,184,0.38)",
              fontSize: 11,
            }}
          >
            <IconClock />
            <span>{task.time}</span>
          </div>
        ) : (
          <div />
        )}

        {/* Direita: badge */}
        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            background: bg,
            color,
            borderRadius: 5,
            padding: "2px 7px",
            letterSpacing: "0.03em",
            flexShrink: 0,
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function CalendarSidePanel({
  selectedDate,
  tasks,
  isMobile = false,
  isTablet = false,
  filter = "todas",
}: Props) {
  useInjectStyles();

  // Chave de animação: muda quando o dia selecionado muda, disparando re-animação
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

  // Filtrar tasks do dia
  const dayTasks = tasks.filter((t: any) => {
    if (!t?.date) return false;
    return new Date(t.date).toDateString() === selectedDate.toDateString();
  });

  // Aplicar filtro global
  const filteredTasks = dayTasks.filter((t: any) => {
    if (filter === "pendente")  return t?.status?.toLowerCase() === "pending";
    if (filter === "concluido") return t?.status?.toLowerCase() === "completed";
    return true;
  });

  const weekday   = selectedDate.toLocaleString("pt-BR", { weekday: "long" });
  const dateLabel = selectedDate.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const today    = new Date();
  const isToday  = today.toDateString() === selectedDate.toDateString();
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
        // Animação do painel inteiro ao trocar de dia
        animation: animKey ? "_sfp_fadeSlideIn 200ms ease-out both" : undefined,
      }}
    >
      {/* ── Cabeçalho fixo ───────────────────────────────────────────────── */}
      <div
        style={{
          padding: isMobile ? "14px 16px 13px" : "16px 18px 14px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.015)",
          flexShrink: 0,
        }}
      >
        {/* Linha 1: weekday + badge Hoje */}
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
              color: "rgba(148,163,184,0.4)",
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

        {/* Linha 2: data */}
        <h3
          style={{
            fontSize: isMobile ? 14 : 15,
            fontWeight: 600,
            color: "#f1f5f9",
            letterSpacing: "-0.01em",
            marginBottom: 10,
          }}
        >
          {dateLabel}
        </h3>

        {/* Linha 3: count + filtro ativo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
          }}
        >
          {/* Count */}
          <span
            style={{
              fontSize: 11,
              color: "rgba(148,163,184,0.5)",
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
                background: filteredTasks.length > 0
                  ? "rgba(56,189,248,0.1)"
                  : "rgba(255,255,255,0.04)",
                color: filteredTasks.length > 0
                  ? "#38bdf8"
                  : "rgba(148,163,184,0.3)",
                fontSize: 10,
                fontWeight: 700,
                padding: "0 4px",
              }}
            >
              {filteredTasks.length}
            </span>
            {filteredTasks.length === 1 ? "tarefa" : "tarefas"}
            {dayTasks.length !== filteredTasks.length && (
              <span style={{ color: "rgba(148,163,184,0.3)" }}>
                de {dayTasks.length}
              </span>
            )}
          </span>

          {/* Filtro ativo */}
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

      {/* ── Lista scrollável ──────────────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: isMobile ? "10px 12px 14px" : "12px 14px 16px",
          display: "flex",
          flexDirection: "column",
          gap: isMobile ? 7 : 8,
          // Scroll suave
          scrollBehavior: "smooth",
        }}
      >
        {filteredTasks.length === 0 ? (
          /* Estado vazio dentro do painel */
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
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
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
            <p style={{ fontSize: 12, color: "rgba(148,163,184,0.28)", textAlign: "center", lineHeight: 1.5 }}>
              {dayTasks.length > 0
                ? "Nenhuma tarefa\nneste filtro"
                : "Dia livre"}
            </p>
          </div>
        ) : (
          /* Cards com animação stagger por animKey */
          filteredTasks.map((task: any, i: number) => (
            <TaskCard
              key={(task?.id ?? i) + animKey}
              task={task}
              index={i}
              isMobile={isMobile}
              animKey={animKey}
            />
          ))
        )}
      </div>
    </div>
  );
}
