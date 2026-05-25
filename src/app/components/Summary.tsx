"use client";

type Props = {
  total: number;
  pending: number;
  completed: number;
};

export function Summary({ total, pending, completed }: Props) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 30, // 👈 mais espaço
        marginBottom: 24,
      }}
    >
      <Item label="Total Tasks" value={total} />

      <Divider />

      <Item label="Pendentes" value={pending} />

      <Divider />

      <Item label="Concluídos" value={completed} />
    </div>
  );
}

function Item({ label, value }: any) {
  return (
    <div style={{ minWidth: 100 }}> {/* 👈 mais largura */}
      <p
        style={{
          fontSize: 15, // 👈 levemente maior
          color: "#6b7280",
          marginBottom: 4,
        }}
      >
        {label}
      </p>

      <span
        style={{
          fontSize: 34, // 👈 número maior (principal mudança)
          fontWeight: "bold",
        }}
      >
        {String(value).padStart(2, "0")}
      </span>
    </div>
  );
}

function Divider() {
  return (
    <div
      style={{
        width: 1,
        height: 40, // 👈 maior
        background: "#e5e7eb",
      }}
    />
  );
}