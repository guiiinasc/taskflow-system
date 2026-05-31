"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
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
};

const TasksContext = createContext<TasksContextValue | undefined>(undefined);

export function TasksProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [filter, setFilter] = useState<TaskFilter>("todas");

  const filteredTasks = useMemo(() => {
    if (filter === "todas") return tasks;
    return tasks.filter((task) => task.status === filter);
  }, [filter, tasks]);

  const addTask = (task: Omit<Task, "id">) => {
    // Use a numeric id to match expectation; keep it simple and unique enough
    const idNum = Date.now() + Math.floor(Math.random() * 1000);
    const newTask: Task = {
      ...task,
      id: idNum,
    };
    setTasks((prev) => [...prev, newTask]);
  };

  useEffect(() => {
    try {
      window.localStorage.setItem("taskflow-tasks", JSON.stringify(tasks));
    } catch {
      // ignore write errors
    }
  }, [tasks]);

  // Load persisted tasks after hydration to avoid SSR/client markup mismatch
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("taskflow-tasks");
      if (stored) {
        setTasks(JSON.parse(stored) as Task[]);
      }
    } catch {
      // ignore
    }
  }, []);

  const value = useMemo(
    () => ({ tasks: filteredTasks, allTasks: tasks, filter, setFilter, setTasks, addTask }),
    [filteredTasks, tasks, filter],
  );

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
}

export function useTasks() {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error("useTasks must be used within a TasksProvider");
  }
  return context;
}
