"use client";

import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import { Summary } from "../components/Summary";
import { TaskColumn } from "../components/TaskColumn";

import { useTasks } from "../hooks/useTasks";
import { groupTasks, getTaskStats } from "../features/tasks/task.utils";

export default function Dashboard() {
  const { tasks, allTasks, filter, setFilter } = useTasks();

  const grouped = groupTasks(tasks);
  const stats = getTaskStats(allTasks);

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "#0B1120",
        overflow: "hidden",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      {/* SIDEBAR */}
      <Sidebar />

      {/* CONTEÚDO PRINCIPAL */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          background: "linear-gradient(160deg, #0F172A 0%, #0B1120 60%, #0d1117 100%)",
        }}
      >
        {/* HEADER */}
        <Header filter={filter} setFilter={setFilter} />

        {/* ÁREA SCROLLÁVEL */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "24px 28px",
            display: "flex",
            flexDirection: "column",
            gap: 0,
            /* scrollbar discreta */
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(255,255,255,0.08) transparent",
          }}
        >
          {/* PAGE TITLE */}
          <div style={{ marginBottom: 20 }}>
            <h1
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: "#f1f5f9",
                letterSpacing: "-0.03em",
                lineHeight: 1,
                marginBottom: 4,
              }}
            >
              Operational Dashboard
            </h1>
            <p
              style={{
                fontSize: 12.5,
                color: "rgba(148,163,184,0.5)",
                letterSpacing: "-0.01em",
              }}
            >
              Acompanhe e gerencie todas as tarefas operacionais
            </p>
          </div>

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
        </div>
      </div>
    </div>
  );
}