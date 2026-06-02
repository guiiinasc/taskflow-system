import { Task } from "../features/tasks/task.types";

type Props = {
  task: Task;
  onClick?: (task: Task) => void;
};

// 🎨 CONFIG TYPE
const typeConfig: Record<
  string,
  { bg: string; color: string; border: string; label: string }
> = {
  entrega: {
    bg: "rgba(14, 165, 233, 0.1)",
    color: "#38bdf8",
    border: "rgba(14, 165, 233, 0.2)",
    label: "Entrega",
  },
  manutencao: {
    bg: "rgba(251, 146, 60, 0.1)",
    color: "#fb923c",
    border: "rgba(251, 146, 60, 0.2)",
    label: "Manutenção",
  },
  outro: {
    bg: "rgba(167, 139, 250, 0.1)",
    color: "#a78bfa",
    border: "rgba(167, 139, 250, 0.2)",
    label: "Outro",
  },
};

// 🎯 STATUS
const statusConfig: Record<
  string,
  { color: string; bg: string; border: string; label: string }
> = {
  pendente: {
    color: "#fca5a5",
    bg: "rgba(239, 68, 68, 0.1)",
    border: "rgba(239, 68, 68, 0.2)",
    label: "Pendente",
  },
  concluido: {
    color: "#86efac",
    bg: "rgba(34, 197, 94, 0.1)",
    border: "rgba(34, 197, 94, 0.2)",
    label: "Concluído",
  },
  "em_andamento": {
    color: "#93c5fd",
    bg: "rgba(59, 130, 246, 0.1)",
    border: "rgba(59, 130, 246, 0.2)",
    label: "Em andamento",
  },
  cancelado: { 
    color: "#9ca3af",
    bg: "rgba(156, 163, 175, 0.1)",
    border: "rgba(156, 163, 175, 0.2)",
    label: "Cancelado",
  },
};

// 🧠 SUBTITLE INTELIGENTE
function getSubtitle(task: Task) {
  if (task.type === "entrega") {
    if (task.quantity) return `${task.quantity} pacotes`;
    return "Entrega programada";
  }

  if (task.type === "manutencao") {
    return task.description || "Manutenção geral";
  }

  if (task.type === "outro") {
    return task.customType || "Outro";
  }

  return "";
}

export function TaskCard({ task, onClick }: Props) {
  const isCompleted = task.status === "concluido";

  const type = typeConfig[task.type] ?? typeConfig["outro"];
  const status = statusConfig[task.status] ?? statusConfig.pendente;
  const subtitle = getSubtitle(task);

  return (
    <div
      style={{
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 11,
        padding: "13px 14px",
        marginBottom: 8,
        background: isCompleted
          ? "rgba(255,255,255,0.02)"
          : "rgba(255,255,255,0.04)",
        opacity: isCompleted ? 0.65 : 1,
        transition: "all 0.18s ease",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        flexShrink: 0,
      }}
      onClick={() => onClick?.(task)}
      onMouseEnter={(e) => {
        if (!isCompleted) {
          const el = e.currentTarget;
          el.style.background = "rgba(255,255,255,0.07)";
          el.style.borderColor = "rgba(255,255,255,0.12)";
          el.style.transform = "translateY(-1px)";
          el.style.boxShadow = "0 4px 20px rgba(0,0,0,0.25)";
        }
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.background = isCompleted
          ? "rgba(255,255,255,0.02)"
          : "rgba(255,255,255,0.04)";
        el.style.borderColor = "rgba(255,255,255,0.07)";
        el.style.transform = "translateY(0)";
        el.style.boxShadow = "none";
      }}
    >
      {/* 🎨 BARRA LATERAL POR TIPO */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: "15%",
          bottom: "15%",
          width: 3,
          borderRadius: "0 3px 3px 0",
          background: type.color,
          opacity: 0.8,
        }}
      />

      {/* TOPO */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 9,
        }}
      >
        <span
          style={{
            fontSize: 10.5,
            fontWeight: 600,
            padding: "2.5px 8px",
            borderRadius: 5,
            background: type.bg,
            color: type.color,
            border: `1px solid ${type.border}`,
            letterSpacing: "0.03em",
          }}
        >
          {task.type === "outro"
            ? task.customType ?? "Outro"
            : type.label}
        </span>

        {/* 🚨 PRIORIDADE (CORRETO AGORA) */}
        {task.status === "pendente" && (
          <span
            style={{
              fontSize: 10.5,
              fontWeight: 600,
              color: "#f87171",
              display: "flex",
              alignItems: "center",
              gap: 3,
            }}
          >
            ● urgente
          </span>
        )}
      </div>

      {/* LOCATION */}
      <h3
        style={{
          fontSize: 13.5,
          fontWeight: 600,
          color: isCompleted ? "rgba(248,250,252,0.4)" : "#f1f5f9",
          textDecoration: isCompleted ? "line-through" : "none",
          letterSpacing: "-0.02em",
          lineHeight: 1.35,
          marginBottom: 5,
        }}
      >
        {task.location}
      </h3>

      {/* SUBTITLE + TIME */}
      <p
        style={{
          fontSize: 11.5,
          color: "rgba(148,163,184,0.55)",
          lineHeight: 1.4,
          marginBottom: 11,
        }}
      >
        {subtitle}
        {task.time && ` • ${task.time}`}
      </p>

      {/* FOOTER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: 9,
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* ICON + ID */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(148,163,184,0.5)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {task.type === "entrega" ? (
              <path d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
            ) : (
              <>
                <circle cx="12" cy="12" r="3" />
                <path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14" />
              </>
            )}
          </svg>

          <span
            style={{
              fontSize: 11,
              color: "rgba(148,163,184,0.45)",
              fontWeight: 500,
            }}
          >
            #{task.id}
          </span>
        </div>

        {/* STATUS */}
        <span
          style={{
            fontSize: 10.5,
            fontWeight: 600,
            padding: "2px 8px",
            borderRadius: 5,
            background: status.bg,
            color: status.color,
            border: `1px solid ${status.border}`,
            letterSpacing: "0.01em",
          }}
        >
          {status.label}
        </span>
      </div>
    </div>
  );
}