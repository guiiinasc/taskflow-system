"use client";

type FilterType = "todas" | "pendente" | "concluido";

type Props = {
  filter: FilterType;
  setFilter: (value: FilterType) => void;
  onMenuClick?: () => void;
  isMobile?: boolean;
};

export function Header({ filter, setFilter, onMenuClick, isMobile }: Props) {
  return (
    <div
      style={{
        width: "100%",
        padding: isMobile ? "0 12px" : "0 24px",
        height: 56,
        background: "#0F172A",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        boxShadow: "0 1px 0 rgba(0,0,0,0.2), 0 4px 16px rgba(0,0,0,0.15)",
      }}
    >
      {/* ESQUERDA */}
      <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 10 : 24 }}>
        
        {/* MENU */}
        {isMobile && onMenuClick && (
          <button
            onClick={onMenuClick}
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.07)",
              background: "rgba(255,255,255,0.04)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path
                d="M3 6h18M3 12h18M3 18h18"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}

        {/* NOME */}
        <h2
          style={{
            fontSize: isMobile ? 14 : 15,
            fontWeight: 700,
            color: "#f8fafc",
            letterSpacing: "-0.03em",
            whiteSpace: "nowrap",
          }}
        >
          TaskFlow
        </h2>

        {/* DIVIDER */}
        {!isMobile && (
          <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.1)" }} />
        )}

        {/* TABS */}
        <div
          style={{
            display: "flex",
            gap: 2,
            background: "rgba(255,255,255,0.05)",
            borderRadius: 8,
            padding: "3px",
            border: "1px solid rgba(255,255,255,0.07)",
            overflowX: "auto",
            maxWidth: isMobile ? 180 : "none",
          }}
        >
          <Tab label={isMobile ? "Tot" : "Total"} active={filter === "todas"} onClick={() => setFilter("todas")} />
          <Tab label={isMobile ? "Pend" : "Pendentes"} active={filter === "pendente"} onClick={() => setFilter("pendente")} />
          <Tab label={isMobile ? "Conc" : "Concluídos"} active={filter === "concluido"} onClick={() => setFilter("concluido")} />
        </div>
      </div>

      {/* DIREITA */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        
        {/* SEARCH */}
        {!isMobile && (
          <div style={{ position: "relative" }}>
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgba(148,163,184,0.5)"
              strokeWidth="2.5"
              strokeLinecap="round"
              style={{
                position: "absolute",
                left: 10,
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
              }}
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
              }}
            />
          </div>
        )}

        {/* ICONES ORIGINAIS */}
        {[ 
          {
            label: "Calendário",
            path: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
          },
          {
            label: "Notificações",
            path: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
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
              color: "rgba(148,163,184,0.7)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d={path} />
            </svg>
          </button>
        ))}

        {/* PERFIL (NOVO) */}
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
            fontSize: 12,
            fontWeight: 700,
            color: "#e2e8f0",
            cursor: "pointer",
          }}
        >
          G
        </div>
      </div>
    </div>
  );
}

// TAB
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
        padding: "5px 10px",
        borderRadius: 6,
        border: "none",
        cursor: "pointer",
        background: active ? "#1e293b" : "transparent",
        color: active ? "#f1f5f9" : "rgba(148,163,184,0.6)",
        fontWeight: active ? 600 : 400,
        fontSize: 12,
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}
    >
      {label}
    </button>
  );
}