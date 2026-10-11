/** Práce s daty v lokálním čase ve formátu YYYY-MM-DD (bez časových pásem). */

export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function parseISODate(s: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return toISODate(d) === s ? d : null;
}

export function addDays(iso: string, days: number): string {
  const d = parseISODate(iso);
  if (!d) return iso;
  d.setDate(d.getDate() + days);
  return toISODate(d);
}

export function todayISO(): string {
  return toISODate(new Date());
}

const WEEKDAYS_SHORT = ['ne', 'po', 'út', 'st', 'čt', 'pá', 'so'];

/** „út 13. 10. 2026“ */
export function formatCzDate(iso: string, withWeekday = true): string {
  const d = parseISODate(iso);
  if (!d) return iso;
  const base = `${d.getDate()}. ${d.getMonth() + 1}. ${d.getFullYear()}`;
  return withWeekday ? `${WEEKDAYS_SHORT[d.getDay()]} ${base}` : base;
}
