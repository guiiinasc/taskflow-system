"use client";

import { MenuItem } from "./MenuItem"; // 👈 IMPORT CORRETO

export function Sidebar() {
  return (
    <div
      style={{
        width: 240,
        height: "100vh",
        background: "#f3f4f6",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 16,
      }}
    >
      {/* TOPO */}
      <div>
        {/* LOGO + NOME */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              background: "#111827",
            }}
          />
          <div>
            <h2 style={{ fontSize: 14, fontWeight: "bold" }}>
              TaskFlow
            </h2>
            <p style={{ fontSize: 11, color: "#6b7280" }}>
              Main Hub
            </p>
            <p style={{ fontSize: 10, color: "#9ca3af" }}>
              Zone A1
            </p>
          </div>
        </div>

        {/* MENU */}
        {/* MENU */}
        <div style={{ marginTop: 30, display: "flex", flexDirection: "column", gap: 8 }}>
          <MenuItem label="Dashboard" active />
          <MenuItem label="Calendário" />
        </div>
      </div>

      {/* PARTE DE BAIXO */}
      <div>
        {/* BOTÃO NOVA TASK */}
        <button
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: 8,
            border: "none",
            background: "#111827",
            color: "#fff",
            fontWeight: "bold",
            cursor: "pointer",
            marginBottom: 20,
          }}
        >
          + Nova Task
        </button>

        {/* USUÁRIO */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "#d1d5db",
            }}
          />
          <div>
            <p style={{ fontSize: 12, fontWeight: "bold" }}>
              Guilherme
            </p>
            <p style={{ fontSize: 11, color: "#6b7280" }}>
              Operations Leader
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}