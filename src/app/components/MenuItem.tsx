"use client";

type Props = {
  label: string;
  active?: boolean;
  onClick?: () => void;
};

const icons: Record<string, string> = {
  Dashboard: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  Calendário: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
};

export function MenuItem({ label, active, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      style={{
        position: "relative",
        padding: "9px 10px",
        borderRadius: 9,
        background: active
          ? "rgba(255,255,255,0.08)"
          : "transparent",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 10,
        transition: "all 0.15s ease",
        border: active
          ? "1px solid rgba(255,255,255,0.1)"
          : "1px solid transparent",
      }}
      onMouseEnter={e => {
        if (!active) {
          (e.currentTarget as HTMLDivElement).style.background =
            "rgba(255,255,255,0.04)";
          (e.currentTarget as HTMLDivElement).style.borderColor =
            "rgba(255,255,255,0.06)";
        }
      }}
      onMouseLeave={e => {
        if (!active) {
          (e.currentTarget as HTMLDivElement).style.background = "transparent";
          (e.currentTarget as HTMLDivElement).style.borderColor = "transparent";
        }
      }}
    >
      {/* ÍCONE SVG */}
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke={active ? "#e2e8f0" : "rgba(148,163,184,0.55)"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ flexShrink: 0, transition: "stroke 0.15s ease" }}
      >
        <path d={icons[label] ?? icons["Dashboard"]} />
      </svg>

      {/* TEXTO */}
      <span
        style={{
          fontSize: 13,
          fontWeight: active ? 600 : 400,
          color: active ? "#f1f5f9" : "rgba(148,163,184,0.65)",
          letterSpacing: "-0.01em",
          transition: "color 0.15s ease",
        }}
      >
        {label}
      </span>

      {/* BARRA LATERAL ATIVA */}
      {active && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: "20%",
            bottom: "20%",
            width: 3,
            background: "#e2e8f0",
            borderRadius: "0 3px 3px 0",
          }}
        />
      )}
    </div>
  );
}
