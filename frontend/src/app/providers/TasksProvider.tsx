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
import type { Task } from "../features/tasks/task.types";
import { normalizeTask, normalizeTaskList, type TaskFilter, type TaskTypeFilter } from "../utils/task";
import * as service from "../features/tasks/task.service";

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

export function TasksProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskFilter>("todas");
  const [typeFilter, setTypeFilter] = useState<TaskTypeFilter>("todas");

  // 🔥 CORREÇÃO PRINCIPAL AQUI
  useEffect(() => {
    async function load() {
      try {
        const data = await service.getTasks();
        const normalized = normalizeTaskList(data?.data ?? data ?? []);
        setTasks(normalized);
      } catch (err) {
        console.error("Erro ao carregar tasks", err);
        setTasks([]);
      }
    }

    if (user) {
      load();
    } else {
      setTasks([]);
    }
  }, [user]);

  const addTask = useCallback(
    async (
      taskData: Omit<Task, "id" | "userId" | "createdAt" | "updatedAt">
    ) => {
      try {
        const newTask = await service.createTask(taskData);
        const payload = newTask?.data ?? newTask;
        if (payload) {
          setTasks((prev) => [...prev, normalizeTask(payload)]);
        }
      } catch (err) {
        console.error(err);
      }
    },
    []
  );

  const updateTask = useCallback(
    async (
      id: Task["id"],
      data: Partial<Omit<Task, "id" | "userId" | "createdAt" | "updatedAt">>
    ) => {
      try {
        const updated = await service.updateTask(id, data);

        const payload = updated?.data ?? updated;
        setTasks((prev) =>
          prev.map((t) => (t.id === id ? normalizeTask(payload) : t))
        );
      } catch (err) {
        console.error(err);
      }
    },
    []
  );

  const toggleTaskStatus = useCallback(
    (id: Task["id"], status: Task["status"]) => {
      updateTask(id, { status });
    },
    [updateTask]
  );

  const deleteTask = useCallback(async (id: Task["id"]) => {
    try {
      await service.deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
    }
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
    [
      filteredTasks,
      tasks,
      filter,
      typeFilter,
      addTask,
      updateTask,
      toggleTaskStatus,
      deleteTask,
    ]
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