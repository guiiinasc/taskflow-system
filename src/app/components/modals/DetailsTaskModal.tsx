"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { Task } from "../../features/tasks/task.types";
import { useTasks } from "../../hooks/useTasks";

// ─── Types ────────────────────────────────────────────────────────────────────

type TaskType = Task["type"];
type TaskStatus = Task["status"];

type Props = {
  isOpen:       boolean;
  task:         Task | null;
  onClose:      () => void;
};

// ─── Animation CSS ────────────────────────────────────────────────────────────

const MODAL_ANIM_ID  = "__tdm_anims__";
const MODAL_ANIM_CSS = `
  @keyframes _tdm_overlayIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes _tdm_overlayOut {
    from { opacity: 1; }
    to   { opacity: 0; }
  }
  @keyframes _tdm_modalIn {
    from { opacity: 0; transform: scale(0.95) translateY(8px); }
    to   { opacity: 1; transform: scale(1)    translateY(0); }
  }
  @keyframes _tdm_modalOut {
    from { opacity: 1; transform: scale(1)    translateY(0); }
    to   { opacity: 0; transform: scale(0.96) translateY(6px); }
  }
  @keyframes _tdm_slideIn {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes _tdm_fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  input[type="date"]::-webkit-calendar-picker-indicator {
    filter: invert(0.6);
    cursor: pointer;
    opacity: 0.5;
  }
  input[type="date"]::-webkit-calendar-picker-indicator:hover {
    opacity: 0.8;
  }
`;

function useInjectModalStyles() {
  useEffect(() => {
    if (document.getElementById(MODAL_ANIM_ID)) return;
    const el = document.createElement("style");
    el.id      = MODAL_ANIM_ID;
    el.textContent = MODAL_ANIM_CSS;
    document.head.appendChild(el);
  }, []);
}

// ─── Design tokens (identical to NewTaskModal) ────────────────────────────────

const TOKEN = {
  bg:           "#0F172A",
  bgCard:       "rgba(255,255,255,0.03)",
  bgInput:      "rgba(255,255,255,0.05)",
  bgInputHover: "rgba(255,255,255,0.07)",
  border:       "rgba(255,255,255,0.08)",
  borderFocus:  "rgba(56,189,248,0.5)",
  textPrimary:  "#f1f5f9",
  textMuted:    "rgba(148,163,184,0.6)",
  textSubtle:   "rgba(148,163,184,0.4)",
  radius:       12,
  radiusSm:     8,
} as const;

// ─── Config maps (mirrored from TaskCard) ─────────────────────────────────────

const TYPE_CONFIG: Record<TaskType, { bg: string; color: string; border: string; label: string; accentLine: string }> = {
  entrega: {
    bg:         "rgba(14,165,233,0.1)",
    color:      "#38bdf8",
    border:     "rgba(14,165,233,0.2)",
    label:      "Entrega",
    accentLine: "rgba(56,189,248,0.6)",
  },
  manutencao: {
    bg:         "rgba(251,146,60,0.1)",
    color:      "#fb923c",
    border:     "rgba(251,146,60,0.2)",
    label:      "Manutenção",
    accentLine: "rgba(251,146,60,0.6)",
  },
  outro: {
    bg:         "rgba(167,139,250,0.1)",
    color:      "#a78bfa",
    border:     "rgba(167,139,250,0.2)",
    label:      "Outro",
    accentLine: "rgba(167,139,250,0.6)",
  },
};

const STATUS_CONFIG: Record<TaskStatus, { color: string; bg: string; border: string; label: string; dot: string }> = {
  pendente: {
    color:  "#fca5a5",
    bg:     "rgba(239,68,68,0.1)",
    border: "rgba(239,68,68,0.2)",
    label:  "Pendente",
    dot:    "#f87171",
  },
  em_andamento: {
    color:  "#93c5fd",
    bg:     "rgba(59,130,246,0.1)",
    border: "rgba(59,130,246,0.2)",
    label:  "Em andamento",
    dot:    "#60a5fa",
  },
  concluido: {
    color:  "#86efac",
    bg:     "rgba(34,197,94,0.1)",
    border: "rgba(34,197,94,0.2)",
    label:  "Concluído",
    dot:    "#4ade80",
  },
  cancelado: {
    color:  "#9ca3af",
    bg:     "rgba(156,163,175,0.1)",
    border: "rgba(156,163,175,0.2)",
    label:  "Cancelado",
    dot:    "#9ca3af",
  },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label
      style={{
        fontSize:      11,
        fontWeight:    600,
        letterSpacing: "0.07em",
        textTransform: "uppercase",
        color:         TOKEN.textSubtle,
        display:       "block",
        marginBottom:  6,
      }}
    >
      {children}
    </label>
  );
}

function CloseButton({ onClick }: { onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label="Fechar"
      style={{
        width:      28,
        height:     28,
        borderRadius: 7,
        border:     `1px solid ${hovered ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.07)"}`,
        background: hovered ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.03)",
        color:      hovered ? "#e2e8f0" : "rgba(148,163,184,0.5)",
        display:    "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor:     "pointer",
        flexShrink: 0,
        transition: "all 0.15s ease",
        marginTop:  2,
      }}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <line x1="18" y1="6"  x2="6"  y2="18" />
        <line x1="6"  y1="6"  x2="18" y2="18" />
      </svg>
    </button>
  );
}

function TypeOptionButton({
  label, value, current, activeBg, activeColor, activeBorder, dotColor, onClick,
}: {
  label: string; value: TaskType; current: TaskType;
  activeBg: string; activeColor: string; activeBorder: string; dotColor: string;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const isActive = current === value;
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex:       1,
        padding:    "8px 12px",
        borderRadius: 6,
        border:     `1px solid ${isActive ? activeBorder : "transparent"}`,
        background: isActive ? activeBg : hovered ? "rgba(255,255,255,0.04)" : "transparent",
        color:      isActive ? activeColor : "rgba(148,163,184,0.55)",
        fontSize:   12,
        fontWeight: isActive ? 600 : 400,
        cursor:     "pointer",
        fontFamily: "inherit",
        display:    "flex",
        alignItems: "center",
        justifyContent: "center",
        gap:        6,
        transition: "all 0.15s ease",
        outline:    "none",
      }}
    >
      <div style={{ width: 6, height: 6, borderRadius: "50%", background: isActive ? dotColor : "rgba(148,163,184,0.3)", transition: "background 0.15s ease", flexShrink: 0 }} />
      {label}
    </button>
  );
}

function StatusToggleButton({
  label, value, current, dotColor, activeBg, activeColor, activeBorder, onClick,
}: {
  label: string; value: TaskStatus; current: TaskStatus;
  dotColor: string; activeBg: string; activeColor: string; activeBorder: string;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const isActive = current === value;
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex:       1,
        padding:    "8px 12px",
        borderRadius: 6,
        border:     `1px solid ${isActive ? activeBorder : "transparent"}`,
        background: isActive ? activeBg : hovered ? "rgba(255,255,255,0.04)" : "transparent",
        color:      isActive ? activeColor : "rgba(148,163,184,0.55)",
        fontSize:   12,
        fontWeight: isActive ? 600 : 400,
        cursor:     "pointer",
        fontFamily: "inherit",
        display:    "flex",
        alignItems: "center",
        justifyContent: "center",
        gap:        6,
        transition: "all 0.15s ease",
        outline:    "none",
      }}
    >
      <div style={{ width: 6, height: 6, borderRadius: "50%", background: isActive ? dotColor : "rgba(148,163,184,0.3)", transition: "background 0.15s ease", flexShrink: 0 }} />
      {label}
    </button>
  );
}

// ─── ActionButton helper ──────────────────────────────────────────────────────

function ActionButton({
  onClick, disabled = false, variant, children,
}: {
  onClick: () => void; disabled?: boolean; variant: "ghost" | "conclude" | "pending" | "cancel";
  children: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);

  const styles: Record<string, React.CSSProperties> = {
    ghost: {
      border:     `1px solid ${hovered ? "rgba(255,255,255,0.12)" : TOKEN.border}`,
      background: hovered ? "rgba(255,255,255,0.06)" : "transparent",
      color:      hovered ? "#e2e8f0" : TOKEN.textMuted,
    },
    conclude: {
      border:     `1px solid ${hovered ? "rgba(74,222,128,0.4)" : "rgba(74,222,128,0.2)"}`,
      background: hovered ? "rgba(74,222,128,0.14)" : "rgba(74,222,128,0.08)",
      color:      "#4ade80",
      boxShadow:  hovered ? "0 0 0 3px rgba(74,222,128,0.08)" : "none",
    },
    pending: {
      border:     `1px solid ${hovered ? "rgba(251,191,36,0.4)" : "rgba(251,191,36,0.2)"}`,
      background: hovered ? "rgba(251,191,36,0.14)" : "rgba(251,191,36,0.08)",
      color:      "#fbbf24",
      boxShadow:  hovered ? "0 0 0 3px rgba(251,191,36,0.08)" : "none",
    },
    cancel: {
      border:     `1px solid ${hovered ? "rgba(248,113,113,0.4)" : "rgba(248,113,113,0.15)"}`,
      background: hovered ? "rgba(248,113,113,0.1)"  : "transparent",
      color:      hovered ? "#f87171" : "rgba(248,113,113,0.5)",
    },
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding:    "9px 16px",
        borderRadius: TOKEN.radiusSm,
        fontSize:   13,
        fontWeight: 500,
        cursor:     disabled ? "not-allowed" : "pointer",
        fontFamily: "inherit",
        display:    "flex",
        alignItems: "center",
        gap:        7,
        transition: "all 0.15s ease",
        opacity:    disabled ? 0.4 : 1,
        ...styles[variant],
      }}
    >
      {children}
    </button>
  );
}

// ─── SaveIndicator ────────────────────────────────────────────────────────────

function SaveIndicator({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <span
      style={{
        fontSize:   11,
        color:      "#4ade80",
        display:    "flex",
        alignItems: "center",
        gap:        5,
        animation:  "_tdm_fadeIn 200ms ease-out both",
      }}
    >
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
      Salvo
    </span>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function TaskDetailsModal({ isOpen, task, onClose }: Props) {
  useInjectModalStyles();

  const { updateTask, toggleTaskStatus, deleteTask } = useTasks();

  // Local editable state — synced from `task` on open
  const [location,    setLocation]    = useState("");
  const [description, setDescription] = useState("");
  const [taskType,    setTaskType]    = useState<TaskType>("entrega");
  const [customType,  setCustomType]  = useState("");
  const [quantity,    setQuantity]    = useState("");
  const [date,        setDate]        = useState("");
  const [status,      setStatus]      = useState<TaskStatus>("pendente");

  // UI state
  const [closing,          setClosing]          = useState(false);
  const [saved,            setSaved]            = useState(false);
  const [locationFocus,    setLocationFocus]    = useState(false);
  const [descFocus,        setDescFocus]        = useState(false);
  const [customTypeFocus,  setCustomTypeFocus]  = useState(false);
  const [dateFocus,        setDateFocus]        = useState(false);
  const [quantityFocus,    setQuantityFocus]    = useState(false);
  const [confirmDelete,    setConfirmDelete]    = useState(false);

  const overlayRef  = useRef<HTMLDivElement>(null);
  const saveTimeout = useRef<ReturnType<typeof setTimeout>>(null);

  // Sync form state whenever the modal opens with a task
  useEffect(() => {
    if (isOpen && task) {
      setLocation(task.location ?? "");
      setDescription(task.description ?? "");
      setTaskType((task.type as TaskType) ?? "entrega");
      setCustomType(task.customType ?? "");
      setQuantity(task.quantity != null ? String(task.quantity) : "");
      setDate(task.date ?? "");
      setStatus((task.status as TaskStatus) ?? "pendente");
      setClosing(false);
      setSaved(false);
      setConfirmDelete(false);
    }
  }, [isOpen, task]);

  // ESC to close
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") triggerClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen]);

  const triggerClose = useCallback(() => {
    setClosing(true);
    setTimeout(() => { setClosing(false); onClose(); }, 180);
  }, [onClose]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) triggerClose();
  };

  // Auto-save after any field change (debounced 600ms)
  const scheduleSave = useCallback(() => {
    if (!task) return;
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      updateTask(task.id, {
        location:    location.trim() || task.location,
        description: description.trim() || undefined,
        type:        taskType,
        customType:  taskType === "outro" ? customType.trim() || undefined : undefined,
        quantity:    taskType === "entrega" ? (Number(quantity) || undefined) : undefined,
        date:        date || task.date,
        status,
        time:        task.time,      
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 600);
  }, [task, location, description, taskType, customType, quantity, date, status, updateTask]);

  // Trigger auto-save whenever editable fields change
  useEffect(() => {
    if (!isOpen || !task) return;
    scheduleSave();
    return () => { if (saveTimeout.current) clearTimeout(saveTimeout.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, description, taskType, customType, quantity, date, status]);

  // Manual status actions
  const handleMarkConcluded = () => {
    if (!task) return;
    setStatus("concluido");
    toggleTaskStatus(task.id, "concluido");
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleMarkPending = () => {
    if (!task) return;
    setStatus("pendente");
    toggleTaskStatus(task.id, "pendente");
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDelete = () => {
    if (!task) return;
    if (!confirmDelete) { setConfirmDelete(true); return; }
    deleteTask(task.id);
    triggerClose();
  };

  if ((!isOpen && !closing) || !task) return null;

  const typeConf   = TYPE_CONFIG[taskType]   ?? TYPE_CONFIG.outro;
  const statusConf = STATUS_CONFIG[status]   ?? STATUS_CONFIG.pendente;

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      style={{
        position:       "fixed",
        inset:          0,
        background:     "rgba(0,0,0,0.6)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        zIndex:         100,
        padding:        "16px",
        animation:      closing
          ? "_tdm_overlayOut 180ms ease-in both"
          : "_tdm_overlayIn 200ms ease-out both",
      }}
    >
      {/* ── Modal container ────────────────────────────────────────────────── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Detalhes da Task"
        style={{
          width:      "100%",
          maxWidth:   480,
          background: TOKEN.bg,
          border:     `1px solid ${TOKEN.border}`,
          borderRadius: TOKEN.radius + 2,
          boxShadow:  "0 24px 64px rgba(0,0,0,0.55), 0 4px 16px rgba(0,0,0,0.3), 0 1px 0 rgba(255,255,255,0.05) inset",
          overflow:   "hidden",
          animation:  closing
            ? "_tdm_modalOut 180ms ease-in both"
            : "_tdm_modalIn 220ms ease-out both",
          maxHeight:  "90vh",
          display:    "flex",
          flexDirection: "column",
        }}
      >
        {/* ── Accent line (type-colored) ──────────────────────────────────── */}
        <div
          style={{
            height:     2,
            background: `linear-gradient(90deg, ${typeConf.accentLine} 0%, ${typeConf.accentLine.replace("0.6", "0.15")} 60%, transparent 100%)`,
            transition: "background 0.3s ease",
          }}
        />

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div
          style={{
            display:        "flex",
            alignItems:     "flex-start",
            justifyContent: "space-between",
            padding:        "18px 20px 0",
            flexShrink:     0,
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Title row: location + badges */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
              {/* Task ID badge */}
              <span
                style={{
                  fontSize:   10,
                  fontWeight: 600,
                  color:      "rgba(148,163,184,0.4)",
                  letterSpacing: "0.06em",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                #{task.id}
              </span>

              {/* Type badge */}
              <span
                style={{
                  fontSize:      10.5,
                  fontWeight:    600,
                  padding:       "2.5px 8px",
                  borderRadius:  5,
                  background:    typeConf.bg,
                  color:         typeConf.color,
                  border:        `1px solid ${typeConf.border}`,
                  letterSpacing: "0.03em",
                  transition:    "all 0.2s ease",
                }}
              >
                {taskType === "outro" ? (customType || "Outro") : typeConf.label}
              </span>

              {/* Status badge */}
              <span
                style={{
                  fontSize:      10.5,
                  fontWeight:    600,
                  padding:       "2.5px 8px",
                  borderRadius:  5,
                  background:    statusConf.bg,
                  color:         statusConf.color,
                  border:        `1px solid ${statusConf.border}`,
                  letterSpacing: "0.03em",
                  display:       "flex",
                  alignItems:    "center",
                  gap:           4,
                  transition:    "all 0.2s ease",
                }}
              >
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: statusConf.dot }} />
                {statusConf.label}
              </span>
            </div>

            <h2
              style={{
                fontSize:      16,
                fontWeight:    700,
                color:         TOKEN.textPrimary,
                letterSpacing: "-0.02em",
                margin:        0,
                lineHeight:    1.2,
                overflow:      "hidden",
                textOverflow:  "ellipsis",
                whiteSpace:    "nowrap",
              }}
            >
              {location || task.location}
            </h2>
            <p style={{ fontSize: 12, color: TOKEN.textMuted, marginTop: 3 }}>
              Edite os campos abaixo — as alterações são salvas automaticamente
            </p>
          </div>

          <CloseButton onClick={triggerClose} />
        </div>

        {/* ── Divider ─────────────────────────────────────────────────────── */}
        <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "14px 0 0", flexShrink: 0 }} />

        {/* ── Scrollable form body ─────────────────────────────────────────── */}
        <div
          style={{
            padding:    "20px 20px 0",
            overflowY:  "auto",
            flex:       1,
          }}
        >
          {/* Location */}
          <div style={{ marginBottom: 16 }}>
            <FieldLabel>Localização <span style={{ color: "#f87171" }}>*</span></FieldLabel>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onFocus={() => setLocationFocus(true)}
              onBlur={() => setLocationFocus(false)}
              placeholder="Local da tarefa"
              maxLength={100}
              style={{
                width:      "100%",
                padding:    "10px 12px",
                borderRadius: TOKEN.radiusSm,
                border:     `1px solid ${locationFocus ? TOKEN.borderFocus : TOKEN.border}`,
                background: locationFocus ? TOKEN.bgInputHover : TOKEN.bgInput,
                color:      TOKEN.textPrimary,
                fontSize:   13,
                fontFamily: "inherit",
                outline:    "none",
                transition: "border-color 0.15s ease, background 0.15s ease",
                boxShadow:  locationFocus ? "0 0 0 3px rgba(56,189,248,0.08)" : "none",
              }}
            />
          </div>

          {/* Description */}
          <div style={{ marginBottom: 16 }}>
            <FieldLabel>Descrição</FieldLabel>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onFocus={() => setDescFocus(true)}
              onBlur={() => setDescFocus(false)}
              placeholder="Descrição (opcional)"
              rows={3}
              maxLength={400}
              style={{
                width:      "100%",
                padding:    "10px 12px",
                borderRadius: TOKEN.radiusSm,
                border:     `1px solid ${descFocus ? TOKEN.borderFocus : TOKEN.border}`,
                background: descFocus ? TOKEN.bgInputHover : TOKEN.bgInput,
                color:      TOKEN.textPrimary,
                fontSize:   13,
                fontFamily: "inherit",
                outline:    "none",
                resize:     "vertical",
                minHeight:  72,
                transition: "border-color 0.15s ease, background 0.15s ease",
                boxShadow:  descFocus ? "0 0 0 3px rgba(56,189,248,0.08)" : "none",
                lineHeight: 1.5,
              }}
            />
          </div>

          {/* Type selector */}
          <div style={{ marginBottom: 16 }}>
            <FieldLabel>Tipo de Task</FieldLabel>
            <div style={{ display: "flex", gap: 0, background: "rgba(255,255,255,0.04)", border: `1px solid ${TOKEN.border}`, borderRadius: TOKEN.radiusSm, padding: 3 }}>
              <TypeOptionButton label="Entrega"    value="entrega"    current={taskType} activeBg="rgba(56,189,248,0.12)"  activeColor="#38bdf8" activeBorder="rgba(56,189,248,0.25)"  dotColor="#38bdf8" onClick={() => setTaskType("entrega")} />
              <TypeOptionButton label="Manutenção" value="manutencao" current={taskType} activeBg="rgba(59,130,246,0.12)"  activeColor="#60a5fa" activeBorder="rgba(59,130,246,0.25)"  dotColor="#60a5fa" onClick={() => setTaskType("manutencao")} />
              <TypeOptionButton label="Outro"      value="outro"      current={taskType} activeBg="rgba(248,113,113,0.12)" activeColor="#f87171" activeBorder="rgba(248,113,113,0.25)" dotColor="#f87171" onClick={() => setTaskType("outro")} />
            </div>
          </div>

          {/* Quantity (entrega) */}
          {taskType === "entrega" && (
            <div style={{ marginBottom: 16, animation: "_tdm_slideIn 180ms ease-out both" }}>
              <FieldLabel>Quantidade de unidades</FieldLabel>
              <input
                type="number"
                min={1}
                step={1}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                onFocus={() => setQuantityFocus(true)}
                onBlur={() => setQuantityFocus(false)}
                placeholder="Número de unidades"
                style={{
                  width:      "100%",
                  padding:    "10px 12px",
                  borderRadius: TOKEN.radiusSm,
                  border:     `1px solid ${quantityFocus ? TOKEN.borderFocus : TOKEN.border}`,
                  background: quantityFocus ? TOKEN.bgInputHover : TOKEN.bgInput,
                  color:      TOKEN.textPrimary,
                  fontSize:   13,
                  fontFamily: "inherit",
                  outline:    "none",
                  transition: "border-color 0.15s ease, background 0.15s ease",
                  boxShadow:  quantityFocus ? "0 0 0 3px rgba(56,189,248,0.08)" : "none",
                }}
              />
            </div>
          )}

          {/* customType (outro) */}
          {taskType === "outro" && (
            <div style={{ marginBottom: 16, animation: "_tdm_slideIn 180ms ease-out both" }}>
              <FieldLabel>Tipo personalizado</FieldLabel>
              <input
                type="text"
                value={customType}
                onChange={(e) => setCustomType(e.target.value)}
                onFocus={() => setCustomTypeFocus(true)}
                onBlur={() => setCustomTypeFocus(false)}
                placeholder="Descreva o tipo da task..."
                maxLength={80}
                style={{
                  width:      "100%",
                  padding:    "10px 12px",
                  borderRadius: TOKEN.radiusSm,
                  border:     `1px solid ${customTypeFocus ? TOKEN.borderFocus : TOKEN.border}`,
                  background: customTypeFocus ? TOKEN.bgInputHover : TOKEN.bgInput,
                  color:      TOKEN.textPrimary,
                  fontSize:   13,
                  fontFamily: "inherit",
                  outline:    "none",
                  transition: "border-color 0.15s ease, background 0.15s ease",
                  boxShadow:  customTypeFocus ? "0 0 0 3px rgba(56,189,248,0.08)" : "none",
                }}
              />
            </div>
          )}

          {/* Date */}
          <div style={{ marginBottom: 16 }}>
            <FieldLabel>Data</FieldLabel>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              onFocus={() => setDateFocus(true)}
              onBlur={() => setDateFocus(false)}
              style={{
                width:       "100%",
                padding:     "10px 12px",
                borderRadius: TOKEN.radiusSm,
                border:      `1px solid ${dateFocus ? TOKEN.borderFocus : TOKEN.border}`,
                background:  dateFocus ? TOKEN.bgInputHover : TOKEN.bgInput,
                color:       date ? TOKEN.textPrimary : TOKEN.textMuted,
                fontSize:    13,
                fontFamily:  "inherit",
                outline:     "none",
                colorScheme: "dark",
                transition:  "border-color 0.15s ease, background 0.15s ease",
                boxShadow:   dateFocus ? "0 0 0 3px rgba(56,189,248,0.08)" : "none",
              }}
            />
          </div>

          {/* Status toggle */}
          <div style={{ marginBottom: 24 }}>
            <FieldLabel>Status</FieldLabel>
            <div style={{ display: "flex", gap: 0, background: "rgba(255,255,255,0.04)", border: `1px solid ${TOKEN.border}`, borderRadius: TOKEN.radiusSm, padding: 3 }}>
              <StatusToggleButton label="Pendente"  value="pendente"  current={status} dotColor="#fbbf24" activeBg="rgba(251,191,36,0.1)"  activeColor="#fbbf24" activeBorder="rgba(251,191,36,0.25)"  onClick={handleMarkPending} />
              <StatusToggleButton label="Concluído" value="concluido" current={status} dotColor="#4ade80" activeBg="rgba(74,222,128,0.1)" activeColor="#4ade80" activeBorder="rgba(74,222,128,0.25)" onClick={handleMarkConcluded} />
            </div>
          </div>
        </div>

        {/* ── Divider ─────────────────────────────────────────────────────── */}
        <div style={{ height: 1, background: "rgba(255,255,255,0.06)", flexShrink: 0 }} />

        {/* ── Footer ──────────────────────────────────────────────────────── */}
        <div
          style={{
            display:        "flex",
            alignItems:     "center",
            justifyContent: "space-between",
            padding:        "14px 20px 18px",
            flexShrink:     0,
            gap:            8,
          }}
        >
          {/* Left: delete + save indicator */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <ActionButton variant="cancel" onClick={handleDelete}>
              {confirmDelete ? (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  Confirmar exclusão
                </>
              ) : (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14H6L5 6" />
                    <path d="M10 11v6M14 11v6" />
                    <path d="M9 6V4h6v2" />
                  </svg>
                  Excluir task
                </>
              )}
            </ActionButton>

            <SaveIndicator show={saved} />
          </div>

          {/* Right: status quick-actions + close */}
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {status === "pendente" ? (
              <ActionButton variant="conclude" onClick={handleMarkConcluded}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Concluir
              </ActionButton>
            ) : (
              <ActionButton variant="pending" onClick={handleMarkPending}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                Reabrir
              </ActionButton>
            )}

            <ActionButton variant="ghost" onClick={triggerClose}>
              Fechar
            </ActionButton>
          </div>
        </div>
      </div>
    </div>
  );
}
