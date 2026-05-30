"use client";

import { CalendarDayCell } from "./CalendarDayCell";

type Props = {
  currentDate: Date;
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  tasks: any[];
  isMobile?: boolean;
  isTablet?: boolean;
};

const WEEKDAYS_FULL  = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const WEEKDAYS_SHORT = ["D",   "S",   "T",   "Q",   "Q",   "S",   "S"  ];

export function CalendarGrid({
  currentDate,
  selectedDate,
  onSelectDate,
  tasks,
  isMobile = false,
  isTablet = false,
}: Props) {
  const year  = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth    = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const days: (Date | null)[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));

  const weekdays = isMobile ? WEEKDAYS_SHORT : WEEKDAYS_FULL;
  const gap      = isMobile ? 4 : isTablet ? 5 : 6;
  const padding  = isMobile ? "10px 10px 12px" : isTablet ? "12px 12px 14px" : "14px 14px 16px";

  return (
    <div
      style={{
        flex: isMobile ? "none" : 1,
        display: "flex",
        flexDirection: "column",
        gap: gap,
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 13,
        padding,
        overflow: "hidden",
        minHeight: 0,
      }}
    >
      {/* Cabeçalho: nomes dos dias */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap,
          marginBottom: 2,
          flexShrink: 0,
        }}
      >
        {weekdays.map((wd, i) => (
          <div
            key={i}
            style={{
              textAlign: "center",
              fontSize: isMobile ? 9 : 10,
              fontWeight: 600,
              letterSpacing: isMobile ? "0.04em" : "0.07em",
              textTransform: "uppercase",
              color: "rgba(148,163,184,0.45)",
              padding: "3px 0",
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
          gap,
          flex: isMobile ? "none" : 1,
          minHeight: 0,
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
              isMobile={isMobile}
              isTablet={isTablet}
            />
          )
        )}
      </div>
    </div>
  );
}
