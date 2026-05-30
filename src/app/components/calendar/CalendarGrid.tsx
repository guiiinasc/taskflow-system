"use client";

import { CalendarDayCell } from "./CalendarDayCell";

type Props = {
  currentDate: Date;
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  tasks: any[];
};

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export function CalendarGrid({
  currentDate,
  selectedDate,
  onSelectDate,
  tasks,
}: Props) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const days: (Date | null)[] = [];

  // Preencher células vazias antes do primeiro dia
  for (let i = 0; i < firstDayOfWeek; i++) {
    days.push(null);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i));
  }

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: 6,
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 13,
        padding: "14px 14px 16px",
        overflow: "hidden",
      }}
    >
      {/* Cabeçalho dos dias da semana */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 6,
          marginBottom: 4,
        }}
      >
        {WEEKDAYS.map((wd) => (
          <div
            key={wd}
            style={{
              textAlign: "center",
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.07em",
              textTransform: "uppercase",
              color: "rgba(148,163,184,0.45)",
              padding: "4px 0",
            }}
          >
            {wd}
          </div>
        ))}
      </div>

      {/* Grid dos dias */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 6,
          flex: 1,
        }}
      >
        {days.map((day, index) =>
          day === null ? (
            <div key={`empty-${index}`} />
          ) : (
            <CalendarDayCell
              key={day.toISOString()}
              date={day}
              tasks={tasks}
              isSelected={selectedDate?.toDateString() === day.toDateString()}
              onClick={() => onSelectDate(day)}
            />
          )
        )}
      </div>
    </div>
  );
}
