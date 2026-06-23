export function parseDateLocal(dateStr: string): Date {
  const normalized = dateStr?.trim();
  if (!normalized) return new Date(NaN);

  const match = normalized.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return new Date(NaN);

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  return new Date(year, month - 1, day); 
}

export function toLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}