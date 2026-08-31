import type { Holiday } from "./holiday.types";

export function normalizeDateKey(date: Date | string): string {
  if (date instanceof Date && Number.isFinite(date.getTime())) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const raw = String(date ?? "").trim();
  if (!raw) return "";

  const [datePart] = raw.split("T");
  const match = datePart.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return raw;

  return `${match[1]}-${match[2]}-${match[3]}`;
}

export function getHolidayByDate(
  date: Date | string,
  holidays: Holiday[] = []
): Holiday | undefined {
  const normalized = normalizeDateKey(date);
  if (!normalized) return undefined;

  return holidays.find((holiday) => normalizeDateKey(holiday.date) === normalized);
}

export function isHoliday(date: Date | string, holidays: Holiday[] = []): boolean {
  return Boolean(getHolidayByDate(date, holidays));
}
