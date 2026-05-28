"use client";

import { CalendarDayCell } from "./CalendarDayCell";

type Props = {
  currentDate: Date;
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  tasks: any[];
};

export function CalendarGrid({
  currentDate,
  selectedDate,
  onSelectDate,
  tasks,
}: Props) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = [];

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i));
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        gap: 8,
        flex: 1,
      }}
    >
      {days.map((day) => (
        <CalendarDayCell
          key={day.toISOString()}
          date={day}
          tasks={tasks}
          isSelected={
            selectedDate?.toDateString() === day.toDateString()
          }
          onClick={() => onSelectDate(day)}
        />
      ))}
    </div>
  );
}