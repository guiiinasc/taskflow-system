import { useState, useCallback } from "react";
import type { Task } from "../features/tasks/task.types";

// ─── Types ────────────────────────────────────────────────────────────────────

type UseTaskDetailsModal = {
  isOpen:       boolean;
  selectedTask: Task | null;
  open:         (task: Task) => void;
  close:        () => void;
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useTaskDetailsModal(): UseTaskDetailsModal {
  const [isOpen,       setIsOpen]       = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const open = useCallback((task: Task) => {
    setSelectedTask(task);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    // Keep selectedTask mounted briefly so the close animation can run
    setTimeout(() => setSelectedTask(null), 200);
  }, []);

  return { isOpen, selectedTask, open, close };
}