"use client";

import { useState, useEffect } from "react";

import { CalendarHeader } from "../components/calendar/CalendarHeader";
import { CalendarGrid } from "../components/calendar/CalendarGrid";
import { CalendarSidePanel } from "../components/calendar/CalendarSidePanel";

import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import { NewTaskModal } from "../components/modals/NewTaskModal";
import { TaskDetailsModal } from "../components/modals/DetailsTaskModal";
import { useNewTaskModal } from "../hooks/useNewTaskModal";
import { useTaskDetailsModal } from "../hooks/useDetailsTaskModal";

import { useTasks } from "../hooks/useTasks";

export default function CalendarPage() {
  const { tasks, filter, setFilter, addTask } = useTasks();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { isOpen, open, close } = useNewTaskModal();
  const {
    isOpen: isDetailsOpen,
    selectedTask,
    open: openDetails,
    close: closeDetails,
  } = useTaskDetailsModal();

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      setIsMobile(w < 768);
      setIsTablet(w >= 768 && w < 1100);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fechar menu ao clicar fora no mobile
  useEffect(() => {
    if (!menuOpen) return;
    const close = () => setMenuOpen(false);
    window.addEventListener("resize", close);
    return () => window.removeEventListener("resize", close);
  }, [menuOpen]);

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "#0B1120",
        overflow: "hidden",
      }}
    >
      {/* SIDEBAR — desktop e tablet visível, mobile oculto por padrão */}
      {!isMobile && (
        <Sidebar view="calendar" setView={() => {}} onNewTask={open} />
      )}

      {/* SIDEBAR MOBILE — overlay */}
      {isMobile && menuOpen && (
        <>
          <div
            onClick={() => setMenuOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.55)",
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
            <Sidebar view="calendar" setView={() => {}} onNewTask={open} />
          </div>
        </>
      )}

      {/* CONTEÚDO PRINCIPAL */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          overflow: "hidden",
          background: "linear-gradient(160deg, #0F172A 0%, #0B1120 60%, #0d1117 100%)",
        }}
      >
        {/* HEADER */}
        <Header
          filter={filter}
          setFilter={setFilter}
          onMenuClick={() => setMenuOpen((prev) => !prev)}
          isMobile={isMobile}
        />

        {/* ÁREA DO CALENDÁRIO */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            padding: isMobile ? "12px 12px 16px" : isTablet ? "16px 16px 20px" : "20px 24px 24px",
            gap: isMobile ? 12 : 20,
            minHeight: 0,
            overflowY: isMobile ? "auto" : "hidden",
            overflowX: "hidden",
          }}
        >
          {/* COLUNA ESQUERDA — header + grid */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: isMobile ? 10 : 14,
              minWidth: 0,
              // No mobile, não deixar encolher indefinidamente
              minHeight: isMobile ? "auto" : 0,
            }}
          >
            <CalendarHeader
              currentDate={currentDate}
              setCurrentDate={setCurrentDate}
              isMobile={isMobile}
            />

            <CalendarGrid
              currentDate={currentDate}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              tasks={tasks}
              isMobile={isMobile}
              isTablet={isTablet}
            />
          </div>

          {/* PAINEL LATERAL — direita no desktop/tablet, abaixo no mobile */}
          <CalendarSidePanel
            selectedDate={selectedDate}
            tasks={tasks}
            isMobile={isMobile}
            isTablet={isTablet}
            filter={filter}
            onTaskClick={openDetails}
          />
        </div>
      </div>
      <TaskDetailsModal
        isOpen={isDetailsOpen}
        task={selectedTask}
        onClose={closeDetails}
      />
      <NewTaskModal
        isOpen={isOpen}
        onClose={close}
        onCreate={(task) => {
          addTask(task);
          close();
        }}
      />
    </div>
  );
}
