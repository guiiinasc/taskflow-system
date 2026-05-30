"use client";

type Props = {
  selectedDate: Date | null;
  tasks: any[];
};

function getStatusStyle(status: string): {
  bg: string;
  color: string;
  label: string;
} {
  const s = status?.toLowerCase() ?? "";
  if (s === "pending")   return { bg: "rgba(251,191,36,0.12)",  color: "#fbbf24", label: "Pendente" };
  if (s === "completed") return { bg: "rgba(74,222,128,0.12)",  color: "#4ade80", label: "Concluído" };
  if (s === "priority")  return { bg: "rgba(248,113,113,0.12)", color: "#f87171", label: "Prioridade" };
  return { bg: "rgba(56,189,248,0.1)", color: "#38bdf8", label: "Em andamento" };
}

function EmptyState() {
  return (
    <div
      style={{
        width: 288,
        flexShrink: 0,
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 13,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
        gap: 10,
      }}
    >
      {/* Ícone placeholder */}
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
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(148,163,184,0.4)" strokeWidth="1.5" strokeLinecap="round">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      </div>
      <p style={{ fontSize: 13, color: "rgba(148,163,184,0.4)", textAlign: "center", lineHeight: 1.5 }}>
        Selecione um dia para ver as tarefas
      </p>
    </div>
  );
}

export function CalendarSidePanel({ selectedDate, tasks }: Props) {
  if (!selectedDate) return <EmptyState />;

  const dayTasks = tasks.filter((t: any) => {
    if (!t?.date) return false;
    return new Date(t.date).toDateString() === selectedDate.toDateString();
  });

  const weekday = selectedDate.toLocaleString("pt-BR", { weekday: "long" });
  const dateLabel = selectedDate.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const today = new Date();
  const isToday = today.toDateString() === selectedDate.toDateString();

  return (
    <div
      style={{
        width: 288,
        flexShrink: 0,
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 13,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Cabeçalho do painel */}
      <div
        style={{
          padding: "18px 20px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.015)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 2 }}>
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.07em",
              textTransform: "uppercase",
              color: "rgba(148,163,184,0.45)",
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
            fontSize: 16,
            fontWeight: 600,
            color: "#f1f5f9",
            letterSpacing: "-0.01em",
          }}
        >
          {dateLabel}
        </h3>

        {/* Contador de tasks */}
        <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 6 }}>
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 5,
              background: dayTasks.length > 0 ? "rgba(56,189,248,0.12)" : "rgba(255,255,255,0.04)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={dayTasks.length > 0 ? "#38bdf8" : "rgba(148,163,184,0.3)"} strokeWidth="2.5" strokeLinecap="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <span style={{ fontSize: 12, color: "rgba(148,163,184,0.55)" }}>
            {dayTasks.length === 0
              ? "Nenhuma tarefa"
              : `${dayTasks.length} tarefa${dayTasks.length > 1 ? "s" : ""}`}
          </span>
        </div>
      </div>

      {/* Lista de tasks */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "12px 14px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {dayTasks.length === 0 ? (
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "32px 0",
              gap: 8,
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(148,163,184,0.18)" strokeWidth="1.5" strokeLinecap="round">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
              <rect x="9" y="3" width="6" height="4" rx="2" />
            </svg>
            <p style={{ fontSize: 12, color: "rgba(148,163,184,0.3)", textAlign: "center" }}>
              Dia livre
            </p>
          </div>
        ) : (
          dayTasks.map((task: any, i: number) => {
            const { bg, color, label } = getStatusStyle(task?.status ?? "");
            return (
              <div
                key={task?.id ?? i}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 10,
                  padding: "10px 12px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  transition: "background 0.15s ease, border-color 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.05)";
                  (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.1)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.03)";
                  (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.07)";
                }}
              >
                {/* Título da task */}
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: "#e2e8f0",
                    lineHeight: 1.4,
                    margin: 0,
                  }}
                >
                  {task?.title ?? "Tarefa"}
                </p>

                {/* Badge de status */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      background: bg,
                      color,
                      borderRadius: 5,
                      padding: "2px 7px",
                      letterSpacing: "0.03em",
                    }}
                  >
                    {label}
                  </span>
                  {task?.time && (
                    <span style={{ fontSize: 11, color: "rgba(148,163,184,0.4)" }}>
                      {task.time}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
