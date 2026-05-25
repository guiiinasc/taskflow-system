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
        <div style={{ display: "flex", height: "100vh" }}>
            {/* SIDEBAR */}
            <Sidebar />

            {/* CONTEÚDO */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>

                {/* HEADER */}
                <Header filter={filter} setFilter={setFilter} />

                {/* CONTEÚDO PRINCIPAL */}
                <div style={{ padding: 20, flex: 1, display: "flex", flexDirection: "column" }}>

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
                            gap: 20,
                            flex: 1,
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