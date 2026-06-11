"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

import { useAuth } from "../contexts/AuthContext";
import { tasks as initialTasks } from "./tasks.seed";
import type { Task } from "../features/tasks/task.types";
import {
  normalizeTask,
  normalizeTaskList,
  type TaskFilter,
  type TaskTypeFilter,
} from "../utils/task";
import { toLocalDateString } from "../lib/date";

type TasksContextValue = {
  tasks: Task[];
  allTasks: Task[];
  filter: TaskFilter;
  setFilter: (filter: TaskFilter) => void;
  typeFilter: TaskTypeFilter;
  setTypeFilter: (filter: TaskTypeFilter) => void;
  setTasks: Dispatch<SetStateAction<Task[]>>;
  addTask: (
    task: Omit<Task, "id" | "userId" | "createdAt" | "updatedAt">
  ) => void;
  updateTask: (
    id: Task["id"],
    data: Partial<Omit<Task, "id" | "userId" | "createdAt" | "updatedAt">>
  ) => void;
  toggleTaskStatus: (
    id: Task["id"],
    status: Task["status"]
  ) => void;
  deleteTask: (id: Task["id"]) => void;
};

const TasksContext = createContext<TasksContextValue | undefined>(undefined);
const STORAGE_KEY = "taskflow-tasks";

export function TasksProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  const [tasks, setTasks] = useState<Task[]>(() =>
    normalizeTaskList(initialTasks, "local-user")
  );
  const [filter, setFilter] = useState<TaskFilter>("todas");
  const [typeFilter, setTypeFilter] = useState<TaskTypeFilter>("todas");

  const currentUserId = user?.id ?? "local-user";

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setTasks(normalizeTaskList(JSON.parse(stored), currentUserId));
        return;
      }

      setTasks(normalizeTaskList(initialTasks, currentUserId));
    } catch {
      setTasks(normalizeTaskList(initialTasks, currentUserId));
    }
  }, [currentUserId]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {}
  }, [tasks]);

  const addTask = useCallback(
    (task: Omit<Task, "id" | "userId" | "createdAt" | "updatedAt">) => {
      const nowIso = toLocalDateString(new Date());
      const newTask = normalizeTask(
        {
          ...task,
          id: `task_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          userId: currentUserId,
          createdAt: nowIso,
          updatedAt: nowIso,
        },
        currentUserId
      );

      setTasks((prev) => [...prev, newTask]);
    },
    [currentUserId]
  );

  const updateTask = useCallback(
    (
      id: Task["id"],
      data: Partial<Omit<Task, "id" | "userId" | "createdAt" | "updatedAt">>
    ) => {
      const nowIso = toLocalDateString(new Date());

      setTasks((prev) =>
        prev.map((task) => {
          if (task.id !== id) return task;

          return normalizeTask(
            {
              ...task,
              ...data,
              id: task.id,
              userId: task.userId,
              createdAt: task.createdAt,
              updatedAt: nowIso,
            },
            currentUserId
          );
        })
      );
    },
    [currentUserId]
  );

  const toggleTaskStatus = useCallback(
    (id: Task["id"], status: Task["status"]) => {
      updateTask(id, { status });
    },
    [updateTask]
  );

  const deleteTask = useCallback((id: Task["id"]) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const statusOk = filter === "todas" || task.status === filter;
      const typeOk = typeFilter === "todas" || task.type === typeFilter;
      return statusOk && typeOk;
    });
  }, [tasks, filter, typeFilter]);

  const value = useMemo(
    () => ({
      tasks: filteredTasks,
      allTasks: tasks,
      filter,
      setFilter,
      typeFilter,
      setTypeFilter,
      setTasks,
      addTask,
      updateTask,
      toggleTaskStatus,
      deleteTask,
    }),
    [filteredTasks, tasks, filter, typeFilter, addTask, updateTask, toggleTaskStatus, deleteTask]
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
