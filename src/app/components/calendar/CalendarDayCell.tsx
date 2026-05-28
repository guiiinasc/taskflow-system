"use client";

type Props = {
  date: Date;
  tasks: any[];
  isSelected: boolean;
  onClick: () => void;
};

export function CalendarDayCell({
  date,
  tasks,
  isSelected,
  onClick,
}: Props) {
  const day = date.getDate();

  return (
    <div
      onClick={onClick}
      style={{
        height: 90,
        borderRadius: 8,
        padding: 6,
        cursor: "pointer",
        background: isSelected ? "#1e293b" : "#0f172a",
        border: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      {/* DIA */}
      <span style={{ fontSize: 12, color: "#94a3b8" }}>
        {day}
      </span>

      {/* TASKS (placeholder por enquanto) */}
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <div style={{ fontSize: 10, color: "#38bdf8" }}>
          Task exemplo
        </div>
      </div>
    </div>
  );
}