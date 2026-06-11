"use client";

import { useState, useCallback } from "react";

/**
 * useNewTaskModal
 *
 * Controla o estado de abertura/fechamento do NewTaskModal.
 * Uso:
 *   const modal = useNewTaskModal();
 *   <button onClick={modal.open}>Nova Task</button>
 *   <NewTaskModal isOpen={modal.isOpen} onClose={modal.close} onCreate={handleCreate} />
 */
export function useNewTaskModal(defaultDate?: string) {
  const [isOpen,    setIsOpen]    = useState(false);
  const [prefillDate, setPrefillDate] = useState(defaultDate ?? "");

  const open = useCallback((date?: string) => {
    setPrefillDate(date ?? "");
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  return { isOpen, open, close, prefillDate };
}