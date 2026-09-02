"use client";

import { useTasks } from "../../hooks/useTasks";
import type { TaskTypeFilter } from "../../utils/task";
import type { Holiday } from "../../features/holidays/holiday.types";
import { normalizeDateKey } from "../../features/holidays/holiday.utils";
import type { Task } from "../../features/tasks/task.types";

type Props = {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  holidays?: Holiday[];
  tasks?: Task[];
  isMobile?: boolean;
};

export function CalendarHeader({
  currentDate,
  setCurrentDate,
  holidays = [],
  tasks = [],
  isMobile = false,
}: Props) {
  const { typeFilter, setTypeFilter } = useTasks();

  const month = currentDate.toLocaleString("pt-BR", {
    month: "long",
    year: "numeric",
  });
  const monthHolidays = holidays
    .filter((holiday) => {
      const dateKey = normalizeDateKey(holiday.date);
      return dateKey.startsWith(
        `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}`
      );
    })
    .sort((first, second) => normalizeDateKey(first.date).localeCompare(normalizeDateKey(second.date)));
  const monthKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}`;
  const monthTaskCount = tasks.filter((task) => normalizeDateKey(task.date).startsWith(monthKey)).length;

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
    border: "1px solid var(--bg-border-soft)",
    background: "var(--bg-soft)",
    color: "var(--text-secondary)",
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
            : "1px solid var(--bg-border-soft)",
          background: active
            ? "rgba(56,189,248,0.15)"
            : "var(--bg-soft)",
          color: active ? "#0284c7" : "var(--text-secondary)",
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
        background: "var(--bg-panel)",
        border: "1px solid var(--bg-border-soft)",
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
              color: "var(--text-primary)",
              textTransform: "capitalize",
            }}
          >
            {month}
          </h2>
          <span
            style={{
              color: "var(--text-secondary)",
              background: "var(--bg-soft)",
              border: "1px solid var(--bg-border-soft)",
              borderRadius: 6,
              padding: "3px 7px",
              fontSize: 10,
              fontWeight: 700,
              whiteSpace: "nowrap",
            }}
          >
            {monthTaskCount} {monthTaskCount === 1 ? "task" : "tasks"}
          </span>
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

      {monthHolidays.length > 0 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 5,
            paddingTop: 4,
            borderTop: "1px solid var(--bg-border-soft)",
          }}
        >
          <div>
            <span
              style={{
                color: "#a16207",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              Feriados do mês
            </span>
          </div>
          {monthHolidays.map((holiday) => (
            <div
              key={`${holiday.date}-${holiday.name}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                color: "var(--text-secondary)",
                fontSize: 11,
                lineHeight: 1.3,
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "#facc15",
                  boxShadow: "0 0 0 2px rgba(250,204,21,0.18)",
                  flexShrink: 0,
                }}
              />
              <span>
                {holiday.name} · {new Date(`${normalizeDateKey(holiday.date)}T12:00:00`).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                })}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}