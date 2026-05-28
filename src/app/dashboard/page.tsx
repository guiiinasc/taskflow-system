"use client";

import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import { Summary } from "../components/Summary";
import { TaskColumn } from "../components/TaskColumn";

import { useTasks } from "../hooks/useTasks";
import { groupTasks, getTaskStats } from "../features/tasks/task.utils";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { tasks, allTasks, filter, setFilter } = useTasks();
  const [view, setView] = useState<"dashboard" | "calendar">("dashboard");

  const grouped = groupTasks(tasks);
  const stats = getTaskStats(allTasks);

  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 900);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "#0B1120",
        overflow: "hidden",
      }}
    >
      {/* SIDEBAR DESKTOP */}
      {!isMobile && <Sidebar view={view} setView={setView} />}

      {/* SIDEBAR MOBILE (OVERLAY) */}
      {isMobile && menuOpen && (
        <>
          {/* BACKDROP */}
          <div
            onClick={() => setMenuOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
              zIndex: 20,
            }}
          />

          {/* MENU */}
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              height: "100%",
              width: 220,
              zIndex: 30,
            }}
          >
            <Sidebar view={view} setView={setView} />
          </div>
        </>
      )}

      {/* CONTEÚDO */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          background:
            "linear-gradient(160deg, #0F172A 0%, #0B1120 60%, #0d1117 100%)",
        }}
      >
        {/* HEADER */}
        <Header
          filter={filter}
          setFilter={setFilter}
          onMenuClick={() => setMenuOpen(!menuOpen)}
          isMobile={isMobile}
        />

        {/* CONTEÚDO PRINCIPAL */}
        <div
          style={{
            flex: 1,
            minHeight: 0,
            overflow: "hidden",
            padding: isMobile ? "16px" : "24px 28px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* TÍTULO */}
          <div style={{ marginBottom: 20 }}>
            <h1
              style={{
                fontSize: isMobile ? 16 : 20,
                fontWeight: 700,
                color: "#f1f5f9",
                letterSpacing: "-0.03em",
              }}
            >
              Operational Dashboard
            </h1>
            <p
              style={{
                fontSize: 12,
                color: "rgba(148,163,184,0.5)",
              }}
            >
              Acompanhe e gerencie todas as tarefas operacionais
            </p>
          </div>

          {view === "dashboard" && (
            <>
              {/* SUMMARY */}
              <Summary
                total={stats.total}
                pending={stats.pending}
                completed={stats.completed}
              />

              {/* COLUNAS */}
              <div
                style={{
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  gap: 14,
                  flex: 1,
                  minHeight: 0,
                }}
              >
                <TaskColumn
                  title="Hoje"
                  icon="📅"
                  tasks={grouped.today}
                  highlight
                />
                <TaskColumn
                  title="Amanhã"
                  icon="📆"
                  tasks={grouped.tomorrow}
                />
                <TaskColumn
                  title="Próximos"
                  icon="➡️"
                  tasks={grouped.upcoming}
                />
              </div>
            </>
          )}

          {view === "calendar" && (
            <div style={{ color: "#fff" }}>
              <h2>Calendário</h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}