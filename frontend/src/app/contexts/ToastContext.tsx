"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type ToastVariant = "success" | "error" | "info";

type Toast = {
  id: number;
  message: string;
  variant: ToastVariant;
};

type ToastContextType = {
  showToast: (message: string, variant?: ToastVariant) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, variant: ToastVariant = "success") => {
    const id = Date.now() + Math.random();

    setToasts((prev) => [...prev, { id, message, variant }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: "fixed",
          top: 20,
          right: 20,
          zIndex: 2000,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          pointerEvents: "none",
        }}
      >
        {toasts.map((toast) => {
          const accent =
            toast.variant === "error"
              ? "#f87171"
              : toast.variant === "info"
                ? "#60a5fa"
                : "#34d399";

          return (
            <div
              key={toast.id}
              style={{
                minWidth: 240,
                maxWidth: 320,
                padding: "12px 14px",
                borderRadius: 12,
                background: "rgba(15, 23, 42, 0.92)",
                border: `1px solid ${accent}33`,
                boxShadow: "0 12px 28px rgba(15, 23, 42, 0.35)",
                color: "#f8fafc",
                fontSize: 13,
                fontWeight: 600,
                lineHeight: 1.4,
                pointerEvents: "auto",
                borderLeft: `4px solid ${accent}`,
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                animation: "toast-in 180ms ease-out",
              }}
            >
              {toast.message}
            </div>
          );
        })}
      </div>
      <style>{`
        @keyframes toast-in {
          from {
            opacity: 0;
            transform: translateX(12px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
      `}</style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
}
