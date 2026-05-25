"use client";

type FilterType = "todas" | "pendente" | "entregue";

type Props = {
  filter: FilterType;
  setFilter: (value: FilterType) => void;
};

export function Header({ filter, setFilter }: Props) {
  return (
    <div
      style={{
        width: "100%",
        padding: "12px 20px",
        borderBottom: "1px solid #e5e7eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* ESQUERDA */}
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <h2 style={{ fontSize: 18 }}>TaskFlow</h2>

        {/* TABS */}
        <div style={{ display: "flex", gap: 10 }}>
          <Tab
            label="Total"
            active={filter === "todas"}
            onClick={() => setFilter("todas")}
          />
          <Tab
            label="Pendentes"
            active={filter === "pendente"}
            onClick={() => setFilter("pendente")}
          />
          <Tab
            label="Concluídos"
            active={filter === "entregue"}
            onClick={() => setFilter("entregue")}
          />
        </div>
      </div>

      {/* DIREITA */}
      <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
        <input
          placeholder="Buscar tarefas..."
          style={{
            padding: "6px 10px",
            borderRadius: 6,
            border: "1px solid #ddd",
          }}
        />

        <span>📅</span>
        <span>🔔</span>
        <span>❓</span>
      </div>
    </div>
  );
}

type TabProps = {
  label: string;
  active: boolean;
  onClick: () => void;
};

function Tab({ label, active, onClick }: TabProps) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "6px 10px",
        borderRadius: 6,
        border: "none",
        cursor: "pointer",
        background: active ? "#2563eb" : "transparent",
        color: active ? "#fff" : "#000",
        fontWeight: active ? "bold" : "normal",
      }}
    >
      {label}
    </button>
  );
}