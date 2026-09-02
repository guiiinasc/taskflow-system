"use client";

import { CalendarDayCell } from "./CalendarDayCell";
import type { Task } from "../../features/tasks/task.types";
import type { Holiday } from "../../features/holidays/holiday.types";
import { toLocalDateString } from "../../utils/date";

type Props = {
  currentDate: Date;
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  tasks: Task[];
  holidays?: Holiday[];
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
  holidays = [],
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
        background: "var(--bg-panel)",
        border: "1px solid var(--bg-border-soft)",
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
              color: "var(--text-secondary)",
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
              key={toLocalDateString(day)}
              date={day}
              tasks={tasks}
              holidays={holidays}
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
