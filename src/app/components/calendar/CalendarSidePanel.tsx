"use client";

type Props = {
  selectedDate: Date | null;
  tasks: any[];
};

export function CalendarSidePanel({ selectedDate }: Props) {
  if (!selectedDate) {
    return (
      <div style={{ width: 280, color: "#64748b" }}>
        Selecione um dia
      </div>
    );
  }

  return (
    <div
      style={{
        width: 280,
        background: "#0f172a",
        borderRadius: 10,
        padding: 12,
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <h3 style={{ color: "#fff", marginBottom: 8 }}>
        {selectedDate.toLocaleDateString("pt-BR")}
      </h3>

      <p style={{ fontSize: 12, color: "#94a3b8" }}>
        Tasks do dia aqui...
      </p>
    </div>
  );
}