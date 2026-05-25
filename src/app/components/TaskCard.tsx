import { Task } from "../features/tasks/task.types";

type Props = {
  task: Task;
};

export function TaskCard({ task }: Props) {
  const isCompleted = task.status === "concluido"

  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 10,
        padding: 12,
        marginBottom: 10,
        background: "#fff",
        opacity: isCompleted ? 0.6 : 1,
      }}
    >
      {/* TOPO */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        {/* TIPO */}
        <span
          style={{
            fontSize: 11,
            padding: "2px 6px",
            borderRadius: 6,
            background:
              task.type === "entrega" ? "#e0f2fe" : "#fff7ed",
            color:
              task.type === "entrega" ? "#0369a1" : "#c2410c",
          }}
        >
          {task.type}
        </span>

        {/* PRIORIDADE (mock por enquanto) */}
        {task.status === "pendente" && (
          <span style={{ fontSize: 11, color: "#dc2626" }}>
            urgente !
          </span>
        )}
      </div>

      {/* TÍTULO */}
      <h3
        style={{
          fontSize: 14,
          fontWeight: "bold",
          textDecoration: isCompleted ? "line-through" : "none",
        }}
      >
        {task.location}
      </h3>

      {/* SUBTÍTULO */}
      <p style={{ fontSize: 12, color: "#6b7280" }}>
        {task.type === "entrega"
          ? `${task.quantity} unidades`
          : task.description || "Manutenção geral"}
      </p>

      {/* BASE */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 10,
          fontSize: 12,
        }}
      >
        {/* ESQUERDA (ÍCONE + ID) */}
        <span>
          {task.type === "entrega" ? "📦" : "🛠️"} #{task.id}
        </span>

        {/* STATUS */}
        <span
          style={{
            color:
              task.status === "pendente"
                ? "#dc2626"
                : task.status === "concluido"
                  ? "#16a34a"
                  : "#6b7280",
          }}
        >
          {task.status}
        </span>
      </div>
    </div>
  );
}