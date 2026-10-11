import { describe, expect, it } from 'vitest';
import { dayAvailability, earliestPickupDate, pickupSlots, validatePickup } from '../pickup';
import { line, order } from './helpers';

// 2026-10-13 = úterý, 2026-10-12 = pondělí, 2026-10-18 = neděle
describe('otevírací doba a časy vyzvednutí', () => {
  it('Paskov v úterý: dopoledne + odpoledne, bez polední pauzy', () => {
    const slots = pickupSlots('paskov', '2026-10-13');
    expect(slots[0]).toBe('07:00');
    expect(slots).toContain('11:30');
    expect(slots).not.toContain('12:00');
    expect(slots).toContain('12:30');
    expect(slots.at(-1)).toBe('16:30');
  });

  it('v pondělí je zavřeno, Žabeň v neděli také', () => {
    expect(dayAvailability('paskov', '2026-10-12').open).toBe(false);
    expect(dayAvailability('zaben', '2026-10-18').open).toBe(false);
    expect(pickupSlots('zaben', '2026-10-13')).toEqual(['06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30']);
  });

  it('respektuje vánoční uzavření a zkrácený provoz', () => {
    expect(dayAvailability('paskov', '2026-12-24').open).toBe(false);
    expect(pickupSlots('paskov', '2026-12-23').at(-1)).toBe('11:30');
    expect(dayAvailability('paskov', '2026-10-28').unknown).toBe(true);
  });
});

describe('předstih a validace vyzvednutí', () => {
  it('jedlý papír vyžaduje 14 dní předem', () => {
    const s = order((o) => {
      o.type = 'dort';
      o.details.cake.ediblePaper = true;
    });
    expect(earliestPickupDate(s, '2026-10-11')).toBe('2026-10-25');
  });

  it('ozdoby na dort vyžadují týden předem', () => {
    const s = order((o) => (o.items = [line('ozdoby-sada-4', 1)]));
    expect(earliestPickupDate(s, '2026-10-11')).toBe('2026-10-18');
  });

  it('odmítne zavřený den a čas mimo otevírací dobu', () => {
    const closed = order((o) => (o.pickup = { place: 'paskov', date: '2026-10-12', time: '09:00' }));
    expect(validatePickup(closed, '2026-10-01')[0].field).toBe('date');
    const badTime = order((o) => (o.pickup = { place: 'zaben', date: '2026-10-13', time: '12:00' }));
    expect(validatePickup(badTime, '2026-10-01')[0].field).toBe('time');
    const ok = order((o) => (o.pickup = { place: 'paskov', date: '2026-10-13', time: '12:30' }));
    expect(validatePickup(ok, '2026-10-01')).toEqual([]);
  });

  it('nedovolí vyzvednutí ve stejný den', () => {
    const s = order((o) => (o.pickup = { place: 'paskov', date: '2026-10-13', time: '08:00' }));
    expect(validatePickup(s, '2026-10-13')[0].field).toBe('date');
  });
});
