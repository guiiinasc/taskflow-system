"use client";

import { useState } from "react";

import { CalendarHeader } from "../components/calendar/CalendarHeader";
import { CalendarGrid } from "../components/calendar/CalendarGrid";
import { CalendarSidePanel } from "../components/calendar/CalendarSidePanel";

import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";

import { useTasks } from "../hooks/useTasks";

export default function CalendarPage() {
  const { tasks, filter, setFilter } = useTasks();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  return (
    <div style={{ display: "flex", height: "100vh", background: "#0B1120" }}>

      {/* SIDEBAR */}
      <Sidebar view="calendar" setView={() => {}} />

      {/* CONTEÚDO */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

        {/* HEADER GLOBAL */}
        <Header filter={filter} setFilter={setFilter} />

        {/* CONTEÚDO DO CALENDÁRIO */}
        <div
          style={{
            flex: 1,
            display: "flex",
            padding: "20px 24px 24px",
            gap: 20,
            minHeight: 0,
            overflow: "hidden",
          }}
        >

          {/* ESQUERDA — calendário */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 16,
              minWidth: 0,
            }}
          >
            <CalendarHeader
              currentDate={currentDate}
              setCurrentDate={setCurrentDate}
            />

            <CalendarGrid
              currentDate={currentDate}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              tasks={tasks}
            />
          </div>

          {/* DIREITA — painel lateral */}
          <CalendarSidePanel
            selectedDate={selectedDate}
            tasks={tasks}
          />
        </div>
      </div>
    </div>
  );
}
