/**
 * Datový model odesílané objednávky. Schéma je záměrně nezávislé na Reactu,
 * aby jej mohl znovu použít budoucí Node server pro serverovou validaci.
 */
import { z } from 'zod';
import { FAVOR_BOXES } from '../data/orderRules';
import { getProduct } from '../data/products';
import { computeTotals } from './pricing';
import { hasFavors, needsCake, ORDER_TYPES, type OrderState } from './types';
import { PHONE_RE } from './validation';

const line = z.object({
  productId: z.string(),
  name: z.string(),
  variant: z.string().optional(),
  qty: z.number().positive(),
  unit: z.string(),
  unitPrice: z.number().nonnegative().optional(),
  total: z.number().nonnegative().optional(),
});

const favor = z.object({
  count: z.number().int().positive(),
  perPack: z.number().int().positive(),
  composition: z.array(z.object({ productId: z.string(), name: z.string(), qty: z.number().int().positive() })),
  packaging: z.enum(['celofan', 'krabicka']),
  box: z.string().optional(),
  ribbon: z.string().optional(),
  marzipanHeart: z.string().optional(),
  gingerHeartText: z.string().optional(),
  cookies: z.number().int().nonnegative(),
  frgal: z.boolean(),
});

export const orderPayloadSchema = z.object({
  version: z.literal(1),
  createdAt: z.string(),
  type: z.enum(['bezna', 'dort', 'oslava', 'svatba', 'vysluzky', 'firemni', 'jina']),
  typeName: z.string(),
  items: z.array(line),
  cake: z.record(z.string(), z.union([z.string(), z.boolean(), z.array(z.string())])).optional(),
  favors: z.array(favor).optional(),
  details: z.record(z.string(), z.string()),
  pickup: z.object({
    place: z.enum(['paskov', 'zaben']),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    time: z.string().regex(/^\d{2}:\d{2}$/),
  }),
  customer: z.object({
    name: z.string().min(3).max(120),
    phone: z.string().regex(PHONE_RE),
    email: z.email().max(200),
    note: z.string().max(2000),
  }),
  consent: z.literal(true),
  pricing: z.object({
    knownTotal: z.number().nonnegative(),
    discount: z.number().nonnegative(),
    complete: z.boolean(),
    notes: z.array(z.string()),
  }),
  /** Anti-spam: honeypot a doba vyplňování – server je musí znovu ověřit. */
  antiSpam: z.object({ website: z.string().max(0), fillTimeMs: z.number().int().nonnegative() }),
});

export type OrderPayload = z.infer<typeof orderPayloadSchema>;

export function buildPayload(s: OrderState, now = Date.now()): OrderPayload {
  const totals = computeTotals(s);
  const d = s.details;
  const details: Record<string, string> = {};
  if (s.type === 'oslava') Object.assign(details, { prilezitost: d.celebration.occasion, pocetHostu: d.celebration.guests });
  if (s.type === 'svatba') {
    Object.assign(details, {
      datumSvatby: d.wedding.date,
      vyzvednuti: d.wedding.pickupWhen === 'v-den' ? 'v den svatby' : 'den předem',
      pocetHostu: d.wedding.guests,
      zajem: d.wedding.interests.join(', '),
    });
  }
  if (s.type === 'firemni') Object.assign(details, { firma: d.company.name, pocetOsob: d.company.guests, akce: d.company.occasion });
  if (s.type === 'jina') details.popis = d.other.description;
  if (d.specialRequests) details.specialniPozadavky = d.specialRequests;

  return {
    version: 1,
    createdAt: new Date(now).toISOString(),
    type: s.type!,
    typeName: ORDER_TYPES.find((t) => t.id === s.type)?.name ?? '',
    items: totals.lines.map((l) => ({
      productId: l.product.id,
      name: l.product.name,
      variant: l.variant?.label,
      qty: l.line.qty,
      unit: l.unitLabel,
      unitPrice: l.unitPrice,
      total: l.total,
    })),
    cake: needsCake(s) ? { ...d.cake } : undefined,
    favors: hasFavors(s)
      ? d.favors.map((f) => ({
          count: f.count,
          perPack: f.perPack,
          composition: Object.entries(f.composition)
            .filter(([, n]) => n > 0)
            .map(([productId, qty]) => ({ productId, name: getProduct(productId)?.name ?? productId, qty })),
          packaging: f.packaging,
          box: f.packaging === 'krabicka' ? FAVOR_BOXES.find((b) => b.id === f.boxId)?.name : undefined,
          ribbon: f.packaging === 'celofan' ? f.ribbon : undefined,
          marzipanHeart: f.marzipanHeart,
          gingerHeartText: f.gingerHeart ? f.gingerHeartText : undefined,
          cookies: f.cookies,
          frgal: f.frgal,
        }))
      : undefined,
    details,
    pickup: { place: s.pickup.place as 'paskov' | 'zaben', date: s.pickup.date, time: s.pickup.time },
    customer: {
      name: s.customer.name.trim(),
      phone: s.customer.phone.trim(),
      email: s.customer.email.trim(),
      note: s.customer.note,
    },
    consent: s.customer.consent as true,
    pricing: { knownTotal: totals.knownTotal, discount: totals.discount, complete: !totals.hasUnpriced, notes: totals.notes },
    antiSpam: { website: s.customer.website, fillTimeMs: Math.max(0, now - s.startedAt) },
  };
}
