"use client";

import React from "react";

type Props = {
  total: number;
  pending: number;
  completed: number;
};

type ItemProps = {
  label: string;
  value: number;
  accent?: string;
  icon: React.ReactNode;
};

export function Summary({ total, pending, completed }: Props) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "stretch",
        gap: 0,
        marginBottom: 28,
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 13,
        overflow: "hidden",
      }}
    >
      <Item
        label="Total Tasks"
        value={total}
        icon={
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
            <rect x="9" y="3" width="6" height="4" rx="2" />
            <line x1="9" y1="12" x2="15" y2="12" />
            <line x1="9" y1="16" x2="13" y2="16" />
          </svg>
        }
      />
      <Divider />
      <Item
        label="Pendentes"
        value={pending}
        accent="#fca5a5"
        icon={
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        }
      />
      <Divider />
      <Item
        label="Concluídos"
        value={completed}
        accent="#86efac"
        icon={
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        }
      />
    </div>
  );
}

function Item({ label, value, accent, icon }: ItemProps) {
  const color = accent ?? "rgba(226,232,240,0.5)";

  return (
    <div
      style={{
        flex: 1,
        padding: "18px 24px",
        display: "flex",
        flexDirection: "column",
        gap: 6,
        position: "relative",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ color, opacity: 0.8 }}>{icon}</span>
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: "rgba(148,163,184,0.55)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          {label}
        </span>
      </div>

      <span
        style={{
          fontSize: 36,
          fontWeight: 800,
          color: accent ?? "#f1f5f9",
          letterSpacing: "-0.04em",
          lineHeight: 1,
        }}
      >
        {String(value).padStart(2, "0")}
      </span>

      {accent && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 24,
            right: 24,
            height: 2,
            background: accent,
            opacity: 0.3,
            borderRadius: "0 0 3px 3px",
          }}
        />
      )}
    </div>
  );
}

function Divider() {
  return (
    <div
      style={{
        width: 1,
        background: "rgba(255,255,255,0.06)",
        flexShrink: 0,
      }}
    />
  );
}
