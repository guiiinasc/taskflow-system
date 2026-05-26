"use client";

type FilterType = "todas" | "pendente" | "concluido";

type Props = {
  filter: FilterType;
  setFilter: (value: FilterType) => void;
};

export function Header({ filter, setFilter }: Props) {
  return (
    <div
      style={{
        width: "100%",
        padding: "0 24px",
        height: 56,
        background: "#0F172A",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        boxShadow: "0 1px 0 rgba(0,0,0,0.2), 0 4px 16px rgba(0,0,0,0.15)",
      }}
    >
      {/* ESQUERDA */}
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        {/* NOME DO APP */}
        <h2
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: "#f8fafc",
            letterSpacing: "-0.03em",
            whiteSpace: "nowrap",
          }}
        >
          TaskFlow
        </h2>

        {/* DIVIDER */}
        <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.1)" }} />

        {/* TABS */}
        <div
          style={{
            display: "flex",
            gap: 2,
            background: "rgba(255,255,255,0.05)",
            borderRadius: 8,
            padding: "3px",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <Tab label="Total"     active={filter === "todas"}   onClick={() => setFilter("todas")} />
          <Tab label="Pendentes" active={filter === "pendente"} onClick={() => setFilter("pendente")} />
          <Tab label="Concluídos" active={filter === "concluido"} onClick={() => setFilter("concluido")} />
        </div>
      </div>

      {/* DIREITA */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {/* SEARCH */}
        <div style={{ position: "relative" }}>
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(148,163,184,0.5)"
            strokeWidth="2.5"
            strokeLinecap="round"
            style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            placeholder="Buscar tarefas..."
            style={{
              padding: "7px 12px 7px 30px",
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.05)",
              color: "#e2e8f0",
              fontSize: 12.5,
              outline: "none",
              width: 180,
              transition: "all 0.18s ease",
            }}
            onFocus={e => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
              e.currentTarget.style.background = "rgba(255,255,255,0.08)";
              e.currentTarget.style.width = "220px";
            }}
            onBlur={e => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
              e.currentTarget.style.background = "rgba(255,255,255,0.05)";
              e.currentTarget.style.width = "180px";
            }}
          />
        </div>

        {/* ICON BUTTONS */}
        {[
          {
            label: "Calendário",
            path: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
          },
          {
            label: "Notificações",
            path: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
          },
          {
            label: "Ajuda",
            path: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
          },
        ].map(({ label, path }) => (
          <button
            key={label}
            title={label}
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.07)",
              background: "rgba(255,255,255,0.04)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.15s ease",
              color: "rgba(148,163,184,0.7)",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.08)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.14)";
              (e.currentTarget as HTMLButtonElement).style.color = "#e2e8f0";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.07)";
              (e.currentTarget as HTMLButtonElement).style.color = "rgba(148,163,184,0.7)";
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d={path} />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── TAB ────────────────────────────────────────────────────
type TabProps = {
  label: string;
  active: boolean;
  onClick: () => void;
};

function Tab({ label, active, onClick }: TabProps) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "5px 12px",
        borderRadius: 6,
        border: "none",
        cursor: "pointer",
        background: active ? "#1e293b" : "transparent",
        color: active ? "#f1f5f9" : "rgba(148,163,184,0.6)",
        fontWeight: active ? 600 : 400,
        fontSize: 12.5,
        letterSpacing: "-0.01em",
        transition: "all 0.15s ease",
        whiteSpace: "nowrap",
        boxShadow: active ? "0 1px 3px rgba(0,0,0,0.3), 0 1px 0 rgba(255,255,255,0.06) inset" : "none",
        outline: "none",
      }}
      onMouseEnter={e => {
        if (!active) {
          (e.currentTarget as HTMLButtonElement).style.color = "#cbd5e1";
          (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)";
        }
      }}
      onMouseLeave={e => {
        if (!active) {
          (e.currentTarget as HTMLButtonElement).style.color = "rgba(148,163,184,0.6)";
          (e.currentTarget as HTMLButtonElement).style.background = "transparent";
        }
      }}
    >
      {label}
    </button>
  );
}
