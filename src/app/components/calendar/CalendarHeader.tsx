"use client";

import { useTasks } from "../../hooks/useTasks";
import type { TaskTypeFilter } from "../../utils/task";

type Props = {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  isMobile?: boolean;
};

export function CalendarHeader({
  currentDate,
  setCurrentDate,
  isMobile = false,
}: Props) {
  const { typeFilter, setTypeFilter } = useTasks();

  const month = currentDate.toLocaleString("pt-BR", {
    month: "long",
    year: "numeric",
  });

  function prevMonth() {
    const d = new Date(currentDate);
    d.setMonth(d.getMonth() - 1);
    setCurrentDate(d);
  }

  function nextMonth() {
    const d = new Date(currentDate);
    d.setMonth(d.getMonth() + 1);
    setCurrentDate(d);
  }

  const navButtonStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: isMobile ? 30 : 32,
    height: isMobile ? 30 : 32,
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.03)",
    color: "#94a3b8",
    cursor: "pointer",
    fontSize: isMobile ? 16 : 14,
    transition: "all 0.15s ease",
  };

  const filterButton = (value: TaskTypeFilter, label: string) => {
    const active = typeFilter === value;

    return (
      <button
        onClick={() => setTypeFilter(value)}
        style={{
          padding: isMobile ? "5px 10px" : "6px 12px",
          borderRadius: 999,
          border: active
            ? "1px solid rgba(56,189,248,0.5)"
            : "1px solid rgba(255,255,255,0.08)",
          background: active
            ? "rgba(56,189,248,0.15)"
            : "rgba(255,255,255,0.03)",
          color: active ? "#38bdf8" : "#94a3b8",
          fontSize: isMobile ? 10 : 11,
          fontWeight: 600,
          cursor: "pointer",
          transition: "all 0.2s ease",
        }}
      >
        {label}
      </button>
    );
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        padding: isMobile ? "11px 14px" : "14px 18px",
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 13,
      }}
    >
      {/* LINHA SUPERIOR */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Título */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#38bdf8",
              opacity: 0.8,
            }}
          />
          <h2
            style={{
              fontSize: isMobile ? 13 : 15,
              fontWeight: 600,
              color: "#f1f5f9",
              textTransform: "capitalize",
            }}
          >
            {month}
          </h2>
        </div>

        {/* Navegação */}
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={prevMonth} style={navButtonStyle}>
            ‹
          </button>
          <button onClick={nextMonth} style={navButtonStyle}>
            ›
          </button>
        </div>
      </div>

      {/* 🔥 FILTRO DE TIPO */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {filterButton("todas", "Todas")}
        {filterButton("entrega", "Entrega")}
        {filterButton("manutencao", "Manutenção")}
      </div>
    </div>
  );
}