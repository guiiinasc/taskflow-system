"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { getHolidaysByYear } from "../features/holidays/holiday.service";
import type { Holiday } from "../features/holidays/holiday.types";
import { getHolidayByDate } from "../features/holidays/holiday.utils";

type HolidaysContextValue = {
  holidaysByYear: Record<number, Holiday[]>;
  holidays: Holiday[];
  loading: boolean;
  error: string | null;
  ensureYear: (year: number) => Promise<void>;
  getHolidayByDate: (date: Date | string) => Holiday | undefined;
};

const HolidaysContext = createContext<HolidaysContextValue | undefined>(undefined);

export function HolidaysProvider({ children }: { children: ReactNode }) {
  const [holidaysByYear, setHolidaysByYear] = useState<Record<number, Holiday[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestedYearsRef = useRef<Set<number>>(new Set());

  const fetchYear = useCallback(async (year: number) => {
    if (!Number.isInteger(year) || year < 1900 || year > 2100) {
      return;
    }

    if (requestedYearsRef.current.has(year)) {
      return;
    }

    requestedYearsRef.current.add(year);
    setLoading(true);
    setError(null);

    try {
      const response = await getHolidaysByYear(year);
      const nextHolidays = Array.isArray(response?.data) ? response.data : [];

      setHolidaysByYear((prev) => ({
        ...prev,
        [year]: nextHolidays,
      }));

      if (response?.error) {
        setError(response.message || response.error || "Não foi possível carregar os feriados.");
      }
    } catch (err: any) {
      setError(err?.message || "Não foi possível carregar os feriados.");
      setHolidaysByYear((prev) => ({
        ...prev,
        [year]: [],
      }));
    } finally {
      setLoading(false);
    }
  }, []);

  const ensureYear = useCallback(async (year: number) => {
    if (!Number.isInteger(year)) return;

    const hasYear = Object.prototype.hasOwnProperty.call(holidaysByYear, year);
    if (hasYear) {
      return;
    }

    await fetchYear(year);
  }, [fetchYear, holidaysByYear]);

  useEffect(() => {
    const now = new Date();
    void ensureYear(now.getFullYear());
  }, [ensureYear]);

  const holidays = useMemo(() => {
    return Object.values(holidaysByYear).flat();
  }, [holidaysByYear]);

  const contextValue = useMemo<HolidaysContextValue>(() => ({
    holidaysByYear,
    holidays,
    loading,
    error,
    ensureYear,
    getHolidayByDate: (date: Date | string) => getHolidayByDate(date, holidays),
  }), [holidaysByYear, holidays, loading, error, ensureYear]);

  return (
    <HolidaysContext.Provider value={contextValue}>
      {children}
    </HolidaysContext.Provider>
  );
}

export function useHolidays() {
  const context = useContext(HolidaysContext);
  if (!context) {
    throw new Error("useHolidays must be used within a HolidaysProvider");
  }
  return context;
}
