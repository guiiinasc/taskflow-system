"use client";

import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import { Summary } from "../components/Summary";
import { TaskColumn } from "../components/TaskColumn";
import { NewTaskModal } from "../components/modals/NewTaskModal";
import { useNewTaskModal } from "../hooks/useNewTaskModal";
import { useAuthModal } from "../hooks/useAuthModal";
import { useAuth } from "../contexts/AuthContext";
import { AuthModal } from "../components/modals/AuthModal";

import { useTaskDetailsModal } from "../hooks/useDetailsTaskModal";
import { TaskDetailsModal } from "../components/modals/DetailsTaskModal";

import { useTasks } from "../hooks/useTasks";
import { useHolidays } from "../providers/HolidaysProvider";
import { getHolidayByDate } from "../features/holidays/holiday.utils";
import { groupTasks, getTaskStats } from "../utils/task";
import { useEffect, useState } from "react";
import type { TaskTypeFilter } from "../utils/task";

const TYPE_FILTER_OPTIONS = ["todas", "entrega", "manutencao"] as const satisfies readonly TaskTypeFilter[];

function formatBrasiliaDateTime(date: Date) {
  return date.toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Dashboard() {
  const { tasks, allTasks, filter, setFilter, addTask, typeFilter, setTypeFilter } = useTasks();
  const { holidays, ensureYear } = useHolidays();

  const { user } = useAuth();
  const {
    isOpen: isAuthOpen,
    mode,
    openLogin,
    openRegister,
    close: closeAuth,
  } = useAuthModal();

  const [view, setView] = useState<"dashboard" | "calendar">("dashboard");
  const [brasiliaDateTime, setBrasiliaDateTime] = useState(() =>
    formatBrasiliaDateTime(new Date())
  );

  const grouped = groupTasks(tasks);
  const stats = getTaskStats(allTasks);
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // 🔥 Modal de criação
  const {
  isOpen: isNewTaskOpen,
  open: openNewTask,
  close: closeNewTask,
} = useNewTaskModal();

  // 🔥 Modal de detalhes (NOVO)
  const {
  isOpen: isDetailsOpen,
  selectedTask,
  open: openDetails,
  close: closeDetails,
} = useTaskDetailsModal();
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 900);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setBrasiliaDateTime(formatBrasiliaDateTime(new Date()));
    }, 60_000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    void ensureYear(new Date().getFullYear());
  }, [ensureYear]);

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const upcomingWindowEnd = new Date(today);
  upcomingWindowEnd.setDate(today.getDate() + 5);

  const todayHoliday = getHolidayByDate(today, holidays);
  const tomorrowHoliday = getHolidayByDate(tomorrow, holidays);

  const upcomingHoliday = Array.from({ length: 5 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index + 1);
    return getHolidayByDate(date, holidays);
  }).find(Boolean);

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
      {!isMobile && (
        <Sidebar
          view={view}
          setView={setView}
          onNewTask={openNewTask}
        />
      )}

      {/* SIDEBAR MOBILE */}
      {isMobile && menuOpen && (
        <>
          <div
            onClick={() => setMenuOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
              zIndex: 20,
            }}
          />

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
            <Sidebar
              view={view}
              setView={setView}
              onNewTask={openNewTask}
            />
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

        {/* MAIN */}
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
         {/* TITLE */}
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
      color: "rgba(148,163,184,0.65)",
      margin: 0,
      marginBottom: 4,
    }}
  >
    Brasília • {brasiliaDateTime}
  </p>

  <p
    style={{
      fontSize: 12,
      color: "rgba(148,163,184,0.5)",
      margin: 0,
      marginBottom: 12,
    }}
  >
    Acompanhe e gerencie todas as tarefas operacionais
  </p>

  {/* 🔥 FILTRO DE TIPO */}
  <div style={{ display: "flex", gap: 6 }}>
    {TYPE_FILTER_OPTIONS.map((type) => {
      const active = typeFilter === type;

      const label =
        type === "todas"
          ? "Todas"
          : type === "entrega"
          ? "Entrega"
          : "Manutenção";

      return (
        <button
          key={type}
          onClick={() => setTypeFilter(type)}
          style={{
            padding: "6px 12px",
            borderRadius: 999,
            border: active
              ? "1px solid rgba(56,189,248,0.5)"
              : "1px solid rgba(255,255,255,0.08)",
            background: active
              ? "rgba(56,189,248,0.15)"
              : "rgba(255,255,255,0.03)",
            color: active ? "#38bdf8" : "#94a3b8",
            fontSize: 11,
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          {label}
        </button>
      );
    })}
  </div>
</div>

          {view === "dashboard" && (
            <>
              <Summary
                total={stats.total}
                pending={stats.pending}
                completed={stats.completed}
              />

              <div
                style={{
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  gap: 14,
                  flex: 1,
                  minHeight: 0,
                }}
              >
                {/* 🔥 AQUI É O PONTO PRINCIPAL */}
                <TaskColumn
                  title="Hoje"
                  icon="📅"
                  tasks={grouped.today}
                  highlight
                  holidayLabel={todayHoliday?.name}
                  onTaskClick={openDetails}
                />

                <TaskColumn
                  title="Amanhã"
                  icon="📆"
                  tasks={grouped.tomorrow}
                  holidayLabel={tomorrowHoliday?.name}
                  onTaskClick={openDetails}
                />

                <TaskColumn
                  title="Próximos"
                  icon="➡️"
                  tasks={grouped.upcoming}
                  holidayLabel={upcomingHoliday?.name}
                  onTaskClick={openDetails}
                />
              </div>
            </>
          )}

          {view === "calendar" && (
            <div style={{ color: "#fff" }}>
              <h2>Calendário</h2>
            </div>
          )}

          {/* MODAL DE CRIAÇÃO */}
          <NewTaskModal
            isOpen={isNewTaskOpen}
            onClose={closeNewTask}
            onCreate={(task) => {
              addTask(task);
              closeNewTask();
            }}
          />

          {/* 🔥 MODAL DE DETALHES (NOVO) */}
          <TaskDetailsModal
            isOpen={isDetailsOpen}
            task={selectedTask}
            onClose={closeDetails}
          />
        </div>
      </div>
    </div>
  );
}