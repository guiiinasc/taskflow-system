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

  const navButtonStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 32,
    height: 32,
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.03)",
    color: "#94a3b8",
    cursor: "pointer",
    fontSize: 13,
    fontFamily: "inherit",
    transition: "background 0.15s ease, border-color 0.15s ease, color 0.15s ease",
    lineHeight: 1,
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 18px",
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 13,
      }}
    >
      {/* Título do mês */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "#38bdf8",
            opacity: 0.8,
            flexShrink: 0,
          }}
        />
        <h2
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: "#f1f5f9",
            letterSpacing: "-0.01em",
            textTransform: "capitalize",
          }}
        >
          {month}
        </h2>
      </div>

      {/* Navegação */}
      <div style={{ display: "flex", gap: 6 }}>
        <button
          onClick={prevMonth}
          style={navButtonStyle}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.07)";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.14)";
            (e.currentTarget as HTMLButtonElement).style.color = "#e2e8f0";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.03)";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.08)";
            (e.currentTarget as HTMLButtonElement).style.color = "#94a3b8";
          }}
        >
          ‹
        </button>
        <button
          onClick={nextMonth}
          style={navButtonStyle}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.07)";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.14)";
            (e.currentTarget as HTMLButtonElement).style.color = "#e2e8f0";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.03)";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.08)";
            (e.currentTarget as HTMLButtonElement).style.color = "#94a3b8";
          }}
        >
          ›
        </button>
      </div>
    </div>
  );
}
