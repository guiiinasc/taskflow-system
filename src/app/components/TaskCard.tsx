import { Task } from "../features/tasks/task.types";

type Props = {
  task: Task;
};

const typeConfig: Record<string, { bg: string; color: string; border: string }> = {
  entrega: {
    bg: "rgba(14, 165, 233, 0.1)",
    color: "#38bdf8",
    border: "rgba(14, 165, 233, 0.2)",
  },
  manutencao: {
    bg: "rgba(251, 146, 60, 0.1)",
    color: "#fb923c",
    border: "rgba(251, 146, 60, 0.2)",
  },
};

const statusConfig: Record<string, { color: string; bg: string; border: string; label: string }> = {
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
  "em andamento": {
    color: "#93c5fd",
    bg: "rgba(59, 130, 246, 0.1)",
    border: "rgba(59, 130, 246, 0.2)",
    label: "Em andamento",
  },
};

export function TaskCard({ task }: Props) {
  const isCompleted = task.status === "concluido";
  const type = typeConfig[task.type] ?? typeConfig["entrega"];
  const status = statusConfig[task.status] ?? statusConfig["pendente"];

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
      }}
      onMouseEnter={e => {
        if (!isCompleted) {
          (e.currentTarget as HTMLDivElement).style.background =
            "rgba(255,255,255,0.07)";
          (e.currentTarget as HTMLDivElement).style.borderColor =
            "rgba(255,255,255,0.12)";
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(-1px)";
          (e.currentTarget as HTMLDivElement).style.boxShadow =
            "0 4px 20px rgba(0,0,0,0.25)";
        }
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.background = isCompleted
          ? "rgba(255,255,255,0.02)"
          : "rgba(255,255,255,0.04)";
        (e.currentTarget as HTMLDivElement).style.borderColor =
          "rgba(255,255,255,0.07)";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
      }}
    >
      {/* Borda colorida esquerda para itens urgentes */}
      {task.status === "pendente" && !isCompleted && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: "15%",
            bottom: "15%",
            width: 3,
            borderRadius: "0 3px 3px 0",
            background: "linear-gradient(180deg, #ef4444, #f97316)",
          }}
        />
      )}

      {/* TOPO: tipo + urgente */}
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
            textTransform: "capitalize",
          }}
        >
          {task.type}
        </span>

        {task.status === "pendente" && (
          <span
            style={{
              fontSize: 10.5,
              fontWeight: 600,
              color: "#f87171",
              display: "flex",
              alignItems: "center",
              gap: 3,
              letterSpacing: "0.01em",
            }}
          >
            <span style={{ fontSize: 10 }}>●</span> urgente
          </span>
        )}
      </div>

      {/* TÍTULO */}
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

      {/* SUBTÍTULO */}
      <p
        style={{
          fontSize: 11.5,
          color: "rgba(148,163,184,0.55)",
          lineHeight: 1.4,
          marginBottom: 11,
        }}
      >
        {task.type === "entrega"
          ? `${task.quantity} unidades`
          : task.description || "Manutenção geral"}
      </p>

      {/* RODAPÉ */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: 9,
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* ÍCONE + ID */}
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
          <span style={{ fontSize: 11, color: "rgba(148,163,184,0.45)", fontWeight: 500 }}>
            #{task.id}
          </span>
        </div>

        {/* STATUS BADGE */}
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
            textTransform: "capitalize",
          }}
        >
          {status.label}
        </span>
      </div>
    </div>
  );
}
