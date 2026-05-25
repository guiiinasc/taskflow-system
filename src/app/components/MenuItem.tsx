"use client";

type Props = {
  label: string;
  active?: boolean;
};

export function MenuItem({ label, active }: Props) {
  return (
    <div
      style={{
        position: "relative",
        padding: "12px",
        borderRadius: 10,
        background: active ? "#dbeafe" : "transparent", // 👈 mais forte
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 10,
        fontWeight: active ? "bold" : "normal",
      }}
    >
      {/* ÍCONE */}
      <span>
        {label === "Dashboard" ? "📊" : "📅"}
      </span>

      {/* TEXTO */}
      <span style={{ fontSize: 13 }}>{label}</span>

      {/* LINHA DIREITA */}
      {active && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 6,
            bottom: 6,
            width: 3,
            background: "#2563eb",
            borderRadius: 2,
          }}
        />
      )}
    </div>
  );
}