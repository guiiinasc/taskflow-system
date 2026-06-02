"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { tasks as initialTasks } from "../mocks/tasks";
import type { Task } from "../features/tasks/task.types";

type TaskFilter = "todas" | "pendente" | "concluido";

type TasksContextValue = {
  tasks: Task[];
  allTasks: Task[];
  filter: TaskFilter;
  setFilter: (filter: TaskFilter) => void;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  addTask: (task: Omit<Task, "id">) => void;

  // 🔥 NOVOS
  updateTask: (id: Task["id"], data: Partial<Omit<Task, "id">>) => void;
  toggleTaskStatus: (id: Task["id"], status: Task["status"]) => void;
  deleteTask: (id: Task["id"]) => void;
};

const TasksContext = createContext<TasksContextValue | undefined>(undefined);

export function TasksProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [filter, setFilter] = useState<TaskFilter>("todas");

  const filteredTasks = useMemo(() => {
    if (filter === "todas") return tasks;
    return tasks.filter((task) => task.status === filter);
  }, [filter, tasks]);

  // ✅ ADD TASK
  const addTask = (task: Omit<Task, "id">) => {
    const idNum = Date.now() + Math.floor(Math.random() * 1000);

    const newTask: Task = {
      ...task,
      id: idNum,
    };

    setTasks((prev) => [...prev, newTask]);
  };

  // 🔥 UPDATE TASK
  const updateTask = (id: Task["id"], data: Partial<Omit<Task, "id">>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...data } : t))
    );
  };

  // 🔥 CORRIGIDO: AGORA ACEITA STATUS
  const toggleTaskStatus = (
    id: Task["id"],
    status: Task["status"]
  ) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status } : t
      )
    );
  };

  // 🔥 DELETE
  const deleteTask = (id: Task["id"]) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // 💾 persistência
  useEffect(() => {
    try {
      window.localStorage.setItem("taskflow-tasks", JSON.stringify(tasks));
    } catch {}
  }, [tasks]);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("taskflow-tasks");
      if (stored) {
        setTasks(JSON.parse(stored) as Task[]);
      }
    } catch {}
  }, []);

  const value = useMemo(
    () => ({
      tasks: filteredTasks,
      allTasks: tasks,
      filter,
      setFilter,
      setTasks,
      addTask,

      // 🔥 novos
      updateTask,
      toggleTaskStatus,
      deleteTask,
    }),
    [filteredTasks, tasks, filter]
  );

  return (
    <TasksContext.Provider value={value}>
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error("useTasks must be used within a TasksProvider");
  }
  return context;
}