"use client";

import { MenuItem } from "./MenuItem";

export function Sidebar() {
  return (
    <div
      style={{
        width: 220,
        height: "100vh",
        background: "linear-gradient(180deg, #0F172A 0%, #111827 100%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "20px 12px",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "4px 0 24px rgba(0,0,0,0.25)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle background texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(99,102,241,0.04) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />

      {/* TOPO */}
      <div style={{ position: "relative" }}>
        {/* LOGO + NOME */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 11,
            padding: "8px 10px 20px",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            marginBottom: 8,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 9,
              background: "linear-gradient(135deg, #334155 0%, #1e293b 100%)",
              border: "1px solid rgba(255,255,255,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
            }}
          >
            <span style={{ fontSize: 15, fontWeight: 800, color: "#f8fafc", letterSpacing: -1 }}>
              TF
            </span>
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#f8fafc", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
              TaskFlow
            </p>
            <p style={{ fontSize: 10.5, color: "rgba(148,163,184,0.8)", marginTop: 1, letterSpacing: "0.01em" }}>
              Main Hub · Zone A1
            </p>
          </div>
        </div>

        {/* SECTION LABEL */}
        <p
          style={{
            fontSize: 9.5,
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "rgba(148,163,184,0.4)",
            padding: "0 10px",
            marginBottom: 6,
            marginTop: 8,
          }}
        >
          Menu
        </p>

        {/* MENU */}
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <MenuItem label="Dashboard" active />
          <MenuItem label="Calendário" />
        </div>
      </div>

      {/* PARTE DE BAIXO */}
      <div style={{ position: "relative" }}>
        {/* BOTÃO NOVA TASK */}
        <button
          style={{
            width: "100%",
            padding: "11px 16px",
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.1)",
            background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
            color: "#f8fafc",
            fontWeight: 600,
            fontSize: 13,
            cursor: "pointer",
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 7,
            letterSpacing: "-0.01em",
            boxShadow: "0 1px 0 rgba(255,255,255,0.06) inset, 0 4px 12px rgba(0,0,0,0.2)",
            transition: "all 0.18s ease",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "linear-gradient(135deg, #334155 0%, #1e293b 100%)";
            (e.currentTarget as HTMLButtonElement).style.borderColor =
              "rgba(255,255,255,0.18)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)";
            (e.currentTarget as HTMLButtonElement).style.borderColor =
              "rgba(255,255,255,0.1)";
          }}
        >
          <span style={{ fontSize: 16, lineHeight: 1 }}>+</span>
          Nova Task
        </button>

        {/* DIVIDER */}
        <div style={{ height: 1, background: "rgba(255,255,255,0.07)", marginBottom: 14 }} />

        {/* USUÁRIO */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 10px",
            borderRadius: 10,
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #475569, #334155)",
              border: "2px solid rgba(255,255,255,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              fontSize: 12,
              fontWeight: 700,
              color: "#e2e8f0",
            }}
          >
            G
          </div>
          <div style={{ overflow: "hidden" }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: "#f1f5f9", letterSpacing: "-0.01em", lineHeight: 1.3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              Guilherme
            </p>
            <p style={{ fontSize: 10, color: "rgba(148,163,184,0.6)", lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              Operations Leader
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
