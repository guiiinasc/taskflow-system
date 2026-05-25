"use client";

import { useState } from "react";
import { tasks as initialTasks } from "../mocks/tasks";
import { Task } from "../features/tasks/task.types";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [filter, setFilter] = useState<"todas" | "pendente" | "concluido">("todas");

  function filteredTasks() {
    if (filter === "todas") return tasks;
    return tasks.filter((task) => task.status === filter);
  }

  return {
    tasks: filteredTasks(),
    allTasks: tasks,
    setTasks,
    filter,
    setFilter,
  };
}