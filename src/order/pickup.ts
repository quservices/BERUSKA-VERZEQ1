import { business, type LocationId, type SpecialDay } from '../data/business';
import { LEAD_DAYS } from '../data/orderRules';
import { getProduct } from '../data/products';
import { addDays, parseISODate } from '../lib/dates';
import { hasFavors, needsCake, type OrderState } from './types';

export interface DayAvailability {
  open: boolean;
  intervals: Array<[string, string]>;
  /** Na webu je u dne „???“ – nelze ověřit. */
  unknown: boolean;
  special?: SpecialDay;
}

export function dayAvailability(place: LocationId, iso: string): DayAvailability {
  const date = parseISODate(iso);
  if (!date) return { open: false, intervals: [], unknown: false };
  const special = business.specialDays.find((d) => d.date === iso && d.location === place);
  if (special) {
    if (special.hours === 'unknown') {
      return { open: true, intervals: business.locations[place].hours[date.getDay()] ?? [], unknown: true, special };
    }
    if (special.hours === null) return { open: false, intervals: [], unknown: false, special };
    return { open: true, intervals: special.hours, unknown: false, special };
  }
  const intervals = business.locations[place].hours[date.getDay()] ?? [];
  return { open: intervals.length > 0, intervals, unknown: false };
}

const toMinutes = (t: string) => {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};
const fromMinutes = (n: number) => `${String(Math.floor(n / 60)).padStart(2, '0')}:${String(n % 60).padStart(2, '0')}`;

/** Časy vyzvednutí po 30 minutách v otevírací době (poslední 30 min před zavřením). */
export function pickupSlots(place: LocationId, iso: string): string[] {
  const { open, intervals } = dayAvailability(place, iso);
  if (!open) return [];
  const slots: string[] = [];
  for (const [from, to] of intervals) {
    for (let t = toMinutes(from); t <= toMinutes(to) - 30; t += 30) slots.push(fromMinutes(t));
  }
  return slots;
}

export interface LeadReason {
  days: number;
  reason: string;
}

/** Minimální předstih podle obsahu objednávky – vrací nejpřísnější důvod. */
export function leadTime(state: OrderState): LeadReason {
  const reasons: LeadReason[] = [{ days: LEAD_DAYS.default, reason: 'Objednávky vyřizujeme nejdříve na následující den.' }];
  if (needsCake(state) && state.details.cake.ediblePaper) {
    reasons.push({ days: LEAD_DAYS.ediblePaper, reason: 'Dort s jedlým papírem je nutné objednat alespoň 14 dní předem.' });
  }
  if (hasFavors(state) && state.details.favors.some((f) => f.packaging === 'krabicka')) {
    reasons.push({ days: LEAD_DAYS.favorBoxes, reason: 'Výslužky do krabiček přijímáme nejpozději týden před vyzvednutím.' });
  }
  if (state.items.some((l) => getProduct(l.productId)?.rule === 'ozdoba')) {
    reasons.push({ days: LEAD_DAYS.cakeDecorations, reason: 'Ozdoby na dort objednávejte nejlépe týden před vyzvednutím.' });
  }
  return reasons.reduce((a, b) => (b.days > a.days ? b : a));
}

export function earliestPickupDate(state: OrderState, today: string): string {
  return addDays(today, leadTime(state).days);
}

export type PickupIssue = { field: 'place' | 'date' | 'time'; message: string };

export function validatePickup(state: OrderState, today: string): PickupIssue[] {
  const { place, date, time } = state.pickup;
  const issues: PickupIssue[] = [];
  if (!place) issues.push({ field: 'place', message: 'Vyberte místo vyzvednutí.' });
  if (!date || !parseISODate(date)) {
    issues.push({ field: 'date', message: 'Vyberte datum vyzvednutí.' });
    return issues;
  }
  const lead = leadTime(state);
  if (date < addDays(today, lead.days)) {
    issues.push({ field: 'date', message: lead.reason });
    return issues;
  }
  if (!place) return issues;
  const day = dayAvailability(place, date);
  if (!day.open) {
    issues.push({
      field: 'date',
      message: `${business.locations[place].name} má v tento den zavřeno${day.special ? ` (${day.special.label})` : ''}. Zvolte jiný den.`,
    });
    return issues;
  }
  if (!time) issues.push({ field: 'time', message: 'Vyberte preferovaný čas vyzvednutí.' });
  else if (!pickupSlots(place, date).includes(time)) {
    issues.push({ field: 'time', message: 'Zvolený čas je mimo otevírací dobu. Vyberte čas ze seznamu.' });
  }
  return issues;
}
