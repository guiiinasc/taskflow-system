"use client";

type Props = {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
};

export function CalendarHeader({ currentDate, setCurrentDate }: Props) {
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

  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      
      <h2 style={{ color: "#fff", fontSize: 18 }}>
        {month}
      </h2>

      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={prevMonth}>◀</button>
        <button onClick={nextMonth}>▶</button>
      </div>
    </div>
  );
}