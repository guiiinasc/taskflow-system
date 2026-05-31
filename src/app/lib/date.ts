export function parseDateLocal(dateStr: string): Date {
  // dateStr expected in YYYY-MM-DD
  const parts = dateStr?.split("-")?.map((p) => Number(p));
  if (!parts || parts.length < 3 || parts.some((n) => Number.isNaN(n))) {
    return new Date(dateStr);
  }
  const [year, month, day] = parts;
  return new Date(year, month - 1, day);
}

export function toLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
