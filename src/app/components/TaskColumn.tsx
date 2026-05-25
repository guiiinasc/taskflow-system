import { Task } from "../features/tasks/task.types";
import { TaskCard } from "./TaskCard";

type Props = {
    title: string;
    icon: string;
    tasks: Task[];
    highlight?: boolean;

};

export function TaskColumn({ title, icon, tasks, highlight }: Props) {
    return (
        <div
            style={{
                flex: 1,
                height: "100%",
                background: "#f9fafb",
                borderRadius: 10,
                padding: 12,
                minHeight: 300,
            }}
        >
            {/* HEADER */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 10,
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span>{icon}</span>
                    <h3 style={{ fontSize: 14 }}>{title}</h3>
                </div>

                <span
                    style={{
                        fontSize: 12,
                        padding: "4px 8px",
                        borderRadius: 6,
                        background: highlight ? "#1e293b" : "#e5e7eb",
                        color: highlight ? "#fff" : "#000",
                    }}
                >
                    {tasks.length}
                </span>
            </div>

            {/* TASKS */}
            <div>
                {tasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                ))}
            </div>
        </div>
    );
}