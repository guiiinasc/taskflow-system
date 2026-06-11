"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { Task } from "../../features/tasks/task.types";
import { toLocalDateString } from "../../utils/date";

// ─── Types ───────────────────────────────────────────────────────────────────

type TaskStatus = Task["status"];
type TaskType = Task["type"];
type NewTask = Omit<Task, "id" | "userId" | "createdAt" | "updatedAt">;

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (task: NewTask) => void;
  defaultDate?: string; // pre-fill date from calendar selection
};

function getTodayDateString() {
  return toLocalDateString(new Date());
}

// ─── Animation CSS ────────────────────────────────────────────────────────────

const MODAL_ANIM_ID = "__ntm_anims__";
const MODAL_ANIM_CSS = `
  @keyframes _ntm_overlayIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes _ntm_overlayOut {
    from { opacity: 1; }
    to   { opacity: 0; }
  }
  @keyframes _ntm_modalIn {
    from { opacity: 0; transform: scale(0.95) translateY(8px); }
    to   { opacity: 1; transform: scale(1)    translateY(0); }
  }
  @keyframes _ntm_modalOut {
    from { opacity: 1; transform: scale(1)    translateY(0); }
    to   { opacity: 0; transform: scale(0.96) translateY(6px); }
  }
  @keyframes _ntm_shake {
    0%,100% { transform: translateX(0); }
    20%     { transform: translateX(-5px); }
    40%     { transform: translateX(5px); }
    60%     { transform: translateX(-4px); }
    80%     { transform: translateX(4px); }
  }
  @keyframes _ntm_slideIn {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  /* Date input color fix for webkit */
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
    el.id = MODAL_ANIM_ID;
    el.textContent = MODAL_ANIM_CSS;
    document.head.appendChild(el);
  }, []);
}

// ─── Shared design tokens ─────────────────────────────────────────────────────

const TOKEN = {
  bg:           "#0F172A",
  bgCard:       "rgba(255,255,255,0.03)",
  bgInput:      "rgba(255,255,255,0.05)",
  bgInputHover: "rgba(255,255,255,0.07)",
  border:       "rgba(255,255,255,0.08)",
  borderFocus:  "rgba(56,189,248,0.5)",
  borderError:  "rgba(248,113,113,0.55)",
  textPrimary:  "#f1f5f9",
  textMuted:    "rgba(148,163,184,0.6)",
  textSubtle:   "rgba(148,163,184,0.4)",
  radius:       12,
  radiusSm:     8,
} as const;

// ─── Sub-components ───────────────────────────────────────────────────────────

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label
      style={{
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.07em",
        textTransform: "uppercase",
        color: TOKEN.textSubtle,
        display: "block",
        marginBottom: 6,
      }}
    >
      {children}
    </label>
  );
}

function FieldError({ message }: { message: string }) {
  return (
    <span
      style={{
        fontSize: 11,
        color: "#f87171",
        marginTop: 4,
        display: "block",
        animation: "_ntm_shake 300ms ease-out",
      }}
    >
      {message}
    </span>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function NewTaskModal({ isOpen, onClose, onCreate, defaultDate = "" }: Props) {
  useInjectModalStyles();

  // Form state
  const [location,    setLocation]    = useState("");
  const [description, setDescription] = useState("");
  const [taskType,    setTaskType]    = useState<TaskType>("entrega");
  const [customType,  setCustomType]  = useState("");
  const [quantity,    setQuantity]    = useState("");
  const [date,        setDate]        = useState(defaultDate || getTodayDateString());
  const [status,      setStatus]      = useState<TaskStatus>("pendente");

  // UI state
  const [errors,    setErrors]    = useState<{ location?: string; type?: string; customType?: string; quantity?: string; date?: string }>({});
  const [closing,   setClosing]   = useState(false);
  const [locationFocus, setLocationFocus] = useState(false);
  const [descFocus,  setDescFocus]  = useState(false);
  const [customTypeFocus, setCustomTypeFocus] = useState(false);
  const [dateFocus,  setDateFocus]  = useState(false);
  const [quantityFocus, setQuantityFocus] = useState(false);
  const [submitHover, setSubmitHover] = useState(false);
  const [cancelHover, setCancelHover] = useState(false);

  const locationRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Sync defaultDate prop
  useEffect(() => {
    if (defaultDate) {
      setDate(defaultDate);
    } else {
      setDate(getTodayDateString());
    }
  }, [defaultDate]);

  // Autofocus location on open
  useEffect(() => {
    if (isOpen) {
      setClosing(false);
      // Reset form on each open
      setLocation("");
      setDescription("");
      setTaskType("entrega");
      setCustomType("");
      setQuantity("");
      setDate(defaultDate || getTodayDateString());
      setStatus("pendente");
      setErrors({});
      setTimeout(() => locationRef.current?.focus(), 80);
    }
  }, [isOpen, defaultDate]);

  // ESC to close
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") triggerClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen]);

  // Animated close
  const triggerClose = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose();
    }, 180);
  }, [onClose]);

  // Click outside
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) triggerClose();
  };

  // Validation
  function validate(): boolean {
    const newErrors: { location?: string; type?: string; customType?: string; quantity?: string; date?: string } = {};
    if (!location.trim())  newErrors.location = "O local da task é obrigatório";
    if (!taskType)         newErrors.type  = "O tipo da task é obrigatório";
    if (taskType === "outro" && !customType.trim()) {
      newErrors.customType = "Descreva o tipo da task";
    }
    if (taskType === "entrega") {
      const quantityNumber = Number(quantity);
      if (!quantity.trim() || Number.isNaN(quantityNumber) || quantityNumber <= 0) {
        newErrors.quantity = "Informe a quantidade de unidades";
      }
    }
    if (!date)             newErrors.date  = "A data é obrigatória";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // Submit
  function handleSubmit() {
    if (!validate()) return;
    onCreate({
      location:    location.trim(),
      description: description.trim() || undefined,
      quantity:    taskType === "entrega" ? Number(quantity) : undefined,
      date,
      status,
      type: taskType,
      customType: taskType === "outro" ? customType.trim() || undefined : undefined,
    });
    triggerClose();
  }

  if (!isOpen && !closing) return null;

  const isValid =
    location.trim().length > 0 &&
    (taskType !== "entrega" || quantity.trim().length > 0) &&
    date.length > 0 &&
    taskType.length > 0 &&
    (taskType !== "outro" || customType.trim().length > 0);

  return (
    /* ── Overlay ─────────────────────────────────────────────────────────── */
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        padding: "16px",
        animation: closing
          ? "_ntm_overlayOut 180ms ease-in both"
          : "_ntm_overlayIn 200ms ease-out both",
      }}
    >
      {/* ── Modal container ───────────────────────────────────────────────── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Nova Task"
        style={{
          width: "100%",
          maxWidth: 440,
          background: TOKEN.bg,
          border: `1px solid ${TOKEN.border}`,
          borderRadius: TOKEN.radius + 2,
          boxShadow: "0 24px 64px rgba(0,0,0,0.55), 0 4px 16px rgba(0,0,0,0.3), 0 1px 0 rgba(255,255,255,0.05) inset",
          overflow: "hidden",
          animation: closing
            ? "_ntm_modalOut 180ms ease-in both"
            : "_ntm_modalIn 220ms ease-out both",
        }}
      >
        {/* ── Top accent line ──────────────────────────────────────────── */}
        <div
          style={{
            height: 2,
            background: "linear-gradient(90deg, rgba(56,189,248,0.6) 0%, rgba(56,189,248,0.15) 60%, transparent 100%)",
          }}
        />

        {/* ── Header ───────────────────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            padding: "20px 20px 0",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: TOKEN.textPrimary,
                letterSpacing: "-0.02em",
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              Nova Task
            </h2>
            <p
              style={{
                fontSize: 12,
                color: TOKEN.textMuted,
                marginTop: 4,
              }}
            >
              Adicione uma nova tarefa ao seu fluxo
            </p>
          </div>

          {/* Close button */}
          <CloseButton onClick={triggerClose} />
        </div>

        {/* ── Divider ──────────────────────────────────────────────────── */}
        <div
          style={{
            height: 1,
            background: "rgba(255,255,255,0.06)",
            margin: "16px 0 0",
          }}
        />

        {/* ── Form ─────────────────────────────────────────────────────── */}
        <div style={{ padding: "20px 20px 0" }}>

          {/* Location */}
          <div style={{ marginBottom: 16 }}>
            <FieldLabel>Localização <span style={{ color: "#f87171" }}>*</span></FieldLabel>
            <input
              ref={locationRef}
              type="text"
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                if (errors.location) setErrors((p) => ({ ...p, location: undefined }));
              }}
              onFocus={() => setLocationFocus(true)}
              onBlur={() => setLocationFocus(false)}
              placeholder="Local da tarefa"
              maxLength={100}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: TOKEN.radiusSm,
                border: `1px solid ${errors.location ? TOKEN.borderError : locationFocus ? TOKEN.borderFocus : TOKEN.border}`,
                background: locationFocus ? TOKEN.bgInputHover : TOKEN.bgInput,
                color: TOKEN.textPrimary,
                fontSize: 13,
                fontFamily: "inherit",
                outline: "none",
                transition: "border-color 0.15s ease, background 0.15s ease",
                boxShadow: locationFocus ? "0 0 0 3px rgba(56,189,248,0.08)" : "none",
              }}
            />
            {errors.location && <FieldError message={errors.location} />}
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
                width: "100%",
                padding: "10px 12px",
                borderRadius: TOKEN.radiusSm,
                border: `1px solid ${descFocus ? TOKEN.borderFocus : TOKEN.border}`,
                background: descFocus ? TOKEN.bgInputHover : TOKEN.bgInput,
                color: TOKEN.textPrimary,
                fontSize: 13,
                fontFamily: "inherit",
                outline: "none",
                resize: "vertical",
                minHeight: 72,
                transition: "border-color 0.15s ease, background 0.15s ease",
                boxShadow: descFocus ? "0 0 0 3px rgba(56,189,248,0.08)" : "none",
                lineHeight: 1.5,
              }}
            />
          </div>

          {/* Task Type */}
          <div style={{ marginBottom: 16 }}>
            <FieldLabel>Tipo de Task <span style={{ color: "#f87171" }}>*</span></FieldLabel>
            <div
              style={{
                display: "flex",
                gap: 0,
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${TOKEN.border}`,
                borderRadius: TOKEN.radiusSm,
                padding: 3,
              }}
            >
              <TypeOptionButton
                label="Entrega"
                value="entrega"
                current={taskType}
                activeBg="rgba(56,189,248,0.12)"
                activeColor="#38bdf8"
                activeBorder="rgba(56,189,248,0.25)"
                dotColor="#38bdf8"
                onClick={() => {
                  setTaskType("entrega");
                  setErrors((p) => ({ ...p, type: undefined, customType: undefined }));
                }}
              />
              <TypeOptionButton
                label="Manutenção"
                value="manutencao"
                current={taskType}
                activeBg="rgba(59,130,246,0.12)"
                activeColor="#60a5fa"
                activeBorder="rgba(59,130,246,0.25)"
                dotColor="#60a5fa"
                onClick={() => {
                  setTaskType("manutencao");
                  setErrors((p) => ({ ...p, type: undefined, customType: undefined }));
                }}
              />
              <TypeOptionButton
                label="Outro"
                value="outro"
                current={taskType}
                activeBg="rgba(248,113,113,0.12)"
                activeColor="#f87171"
                activeBorder="rgba(248,113,113,0.25)"
                dotColor="#f87171"
                onClick={() => {
                  setTaskType("outro");
                  setErrors((p) => ({ ...p, type: undefined }));
                }}
              />
            </div>
            {errors.type && <FieldError message={errors.type} />}
          </div>

          {taskType === "entrega" && (
            <div style={{ marginBottom: 16, animation: "_ntm_slideIn 180ms ease-out both" }}>
              <FieldLabel>Quantidade de unidades <span style={{ color: "#f87171" }}>*</span></FieldLabel>
              <input
                type="number"
                min={1}
                step={1}
                value={quantity}
                onChange={(e) => {
                  setQuantity(e.target.value);
                  if (errors.quantity) setErrors((p) => ({ ...p, quantity: undefined }));
                }}
                onFocus={() => setQuantityFocus(true)}
                onBlur={() => setQuantityFocus(false)}
                placeholder="Número de unidades"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: TOKEN.radiusSm,
                  border: `1px solid ${errors.quantity ? TOKEN.borderError : quantityFocus ? TOKEN.borderFocus : TOKEN.border}`,
                  background: quantityFocus ? TOKEN.bgInputHover : TOKEN.bgInput,
                  color: TOKEN.textPrimary,
                  fontSize: 13,
                  fontFamily: "inherit",
                  outline: "none",
                  transition: "border-color 0.15s ease, background 0.15s ease",
                  boxShadow: quantityFocus ? "0 0 0 3px rgba(56,189,248,0.08)" : "none",
                }}
              />
              {errors.quantity && <FieldError message={errors.quantity} />}
            </div>
          )}

          {taskType === "outro" && (
            <div
              style={{
                marginBottom: 16,
                animation: "_ntm_slideIn 180ms ease-out both",
              }}
            >
              <FieldLabel>Descreva o tipo da task <span style={{ color: "#f87171" }}>*</span></FieldLabel>
              <input
                type="text"
                value={customType}
                onChange={(e) => {
                  setCustomType(e.target.value);
                  if (errors.customType) setErrors((p) => ({ ...p, customType: undefined }));
                }}
                onFocus={() => setCustomTypeFocus(true)}
                onBlur={() => setCustomTypeFocus(false)}
                placeholder="Descreva o tipo da task..."
                maxLength={80}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: TOKEN.radiusSm,
                  border: `1px solid ${errors.customType ? TOKEN.borderError : customTypeFocus ? TOKEN.borderFocus : TOKEN.border}`,
                  background: customTypeFocus ? TOKEN.bgInputHover : TOKEN.bgInput,
                  color: TOKEN.textPrimary,
                  fontSize: 13,
                  fontFamily: "inherit",
                  outline: "none",
                  transition: "border-color 0.15s ease, background 0.15s ease",
                  boxShadow: customTypeFocus ? "0 0 0 3px rgba(56,189,248,0.08)" : "none",
                }}
              />
              {errors.customType && <FieldError message={errors.customType} />}
            </div>
          )}

          {/* Date */}
          <div style={{ marginBottom: 16 }}>
            <FieldLabel>Data <span style={{ color: "#f87171" }}>*</span></FieldLabel>
            <input
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                if (errors.date) setErrors((p) => ({ ...p, date: undefined }));
              }}
              onFocus={() => setDateFocus(true)}
              onBlur={() => setDateFocus(false)}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: TOKEN.radiusSm,
                border: `1px solid ${errors.date ? TOKEN.borderError : dateFocus ? TOKEN.borderFocus : TOKEN.border}`,
                background: dateFocus ? TOKEN.bgInputHover : TOKEN.bgInput,
                color: date ? TOKEN.textPrimary : TOKEN.textMuted,
                fontSize: 13,
                fontFamily: "inherit",
                outline: "none",
                colorScheme: "dark",
                transition: "border-color 0.15s ease, background 0.15s ease",
                boxShadow: dateFocus ? "0 0 0 3px rgba(56,189,248,0.08)" : "none",
              }}
            />
            {errors.date && <FieldError message={errors.date} />}
          </div>

          {/* Status toggle */}
          <div style={{ marginBottom: 24 }}>
            <FieldLabel>Status</FieldLabel>
            <div
              style={{
                display: "flex",
                gap: 0,
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${TOKEN.border}`,
                borderRadius: TOKEN.radiusSm,
                padding: 3,
              }}
            >
              <StatusToggleButton
                label="Pendente"
                value="pendente"
                current={status}
                dotColor="#fbbf24"
                activeBg="rgba(251,191,36,0.1)"
                activeColor="#fbbf24"
                activeBorder="rgba(251,191,36,0.25)"
                onClick={() => setStatus("pendente")}
              />
              <StatusToggleButton
                label="Concluído"
                value="concluido"
                current={status}
                dotColor="#4ade80"
                activeBg="rgba(74,222,128,0.1)"
                activeColor="#4ade80"
                activeBorder="rgba(74,222,128,0.25)"
                onClick={() => setStatus("concluido")}
              />
            </div>
          </div>
        </div>

        {/* ── Divider ──────────────────────────────────────────────────── */}
        <div style={{ height: 1, background: "rgba(255,255,255,0.06)" }} />

        {/* ── Footer ───────────────────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            gap: 8,
            padding: "14px 20px 18px",
            justifyContent: "flex-end",
          }}
        >
          {/* Cancel */}
          <button
            onClick={triggerClose}
            onMouseEnter={() => setCancelHover(true)}
            onMouseLeave={() => setCancelHover(false)}
            style={{
              padding: "9px 16px",
              borderRadius: TOKEN.radiusSm,
              border: `1px solid ${cancelHover ? "rgba(255,255,255,0.12)" : TOKEN.border}`,
              background: cancelHover ? "rgba(255,255,255,0.06)" : "transparent",
              color: cancelHover ? "#e2e8f0" : TOKEN.textMuted,
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.15s ease",
            }}
          >
            Cancelar
          </button>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!isValid}
            onMouseEnter={() => setSubmitHover(true)}
            onMouseLeave={() => setSubmitHover(false)}
            style={{
              padding: "9px 20px",
              borderRadius: TOKEN.radiusSm,
              border: "1px solid rgba(56,189,248,0.3)",
              background: !isValid
                ? "rgba(255,255,255,0.05)"
                : submitHover
                ? "rgba(56,189,248,0.22)"
                : "rgba(56,189,248,0.14)",
              color: !isValid
                ? "rgba(148,163,184,0.35)"
                : "#38bdf8",
              fontSize: 13,
              fontWeight: 600,
              cursor: isValid ? "pointer" : "not-allowed",
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              gap: 7,
              transition: "all 0.15s ease",
              borderColor: !isValid
                ? "rgba(255,255,255,0.06)"
                : submitHover
                ? "rgba(56,189,248,0.45)"
                : "rgba(56,189,248,0.3)",
              boxShadow: isValid && submitHover
                ? "0 0 0 3px rgba(56,189,248,0.1)"
                : "none",
            }}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Criar Task
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── CloseButton ──────────────────────────────────────────────────────────────

function CloseButton({ onClick }: { onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label="Fechar"
      style={{
        width: 28,
        height: 28,
        borderRadius: 7,
        border: `1px solid ${hovered ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.07)"}`,
        background: hovered ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.03)",
        color: hovered ? "#e2e8f0" : "rgba(148,163,184,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        flexShrink: 0,
        transition: "all 0.15s ease",
        marginTop: 2,
      }}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>
  );
}

// ─── StatusToggleButton ───────────────────────────────────────────────────────

type StatusToggleProps = {
  label: string;
  value: TaskStatus;
  current: TaskStatus;
  dotColor: string;
  activeBg: string;
  activeColor: string;
  activeBorder: string;
  onClick: () => void;
};

function StatusToggleButton({
  label,
  value,
  current,
  dotColor,
  activeBg,
  activeColor,
  activeBorder,
  onClick,
}: StatusToggleProps) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const isActive = current === value;

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        flex: 1,
        padding: "8px 12px",
        borderRadius: 6,
        border: `1px solid ${isActive ? activeBorder : "transparent"}`,
        background: isActive ? activeBg : hovered ? "rgba(255,255,255,0.04)" : "transparent",
        color: isActive ? activeColor : "rgba(148,163,184,0.55)",
        fontSize: 12,
        fontWeight: isActive ? 600 : 400,
        cursor: "pointer",
        fontFamily: "inherit",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        transition: "all 0.15s ease",
        outline: "none",
        boxShadow: focused ? "0 0 0 2px rgba(56,189,248,0.25)" : "none",
      }}
    >
      <div
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: isActive ? dotColor : "rgba(148,163,184,0.3)",
          transition: "background 0.15s ease",
          flexShrink: 0,
        }}
      />
      {label}
    </button>
  );
}

function TypeOptionButton({
  label,
  value,
  current,
  activeBg,
  activeColor,
  activeBorder,
  dotColor,
  onClick,
}: {
  label: string;
  value: TaskType;
  current: TaskType;
  activeBg: string;
  activeColor: string;
  activeBorder: string;
  dotColor: string;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const isActive = current === value;

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        flex: 1,
        padding: "8px 12px",
        borderRadius: 6,
        border: `1px solid ${isActive ? activeBorder : "transparent"}`,
        background: isActive ? activeBg : hovered ? "rgba(255,255,255,0.04)" : "transparent",
        color: isActive ? activeColor : "rgba(148,163,184,0.55)",
        fontSize: 12,
        fontWeight: isActive ? 600 : 400,
        cursor: "pointer",
        fontFamily: "inherit",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        transition: "all 0.15s ease",
        outline: "none",
        boxShadow: focused ? "0 0 0 2px rgba(56,189,248,0.25)" : "none",
      }}
    >
      <div
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: isActive ? dotColor : "rgba(148,163,184,0.3)",
          transition: "background 0.15s ease",
          flexShrink: 0,
        }}
      />
      {label}
    </button>
  );
}
