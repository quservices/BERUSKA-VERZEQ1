import { describe, expect, it } from 'vitest';
import { buildPayload, orderPayloadSchema } from '../payload';
import { validateCustomer, validateDetails, validateItems, validateOrder } from '../validation';
import { line, order } from './helpers';

const TODAY = '2026-10-11';

describe('výrobky', () => {
  it('běžná objednávka musí obsahovat výrobek', () => {
    expect(validateItems(order((s) => (s.type = 'bezna')), TODAY)['f-items']).toBeDefined();
  });

  it('cukroví během roku jen s koláči', () => {
    const only = order((s) => {
      s.type = 'bezna';
      s.items = [line('cukrovi-kremove', 1)];
    });
    expect(validateItems(only, TODAY)['f-items']).toMatch(/pouze společně s koláči/);
    only.items.push(line('kolac-tvarohovy', 20));
    expect(validateItems(only, TODAY)['f-items']).toBeUndefined();
  });

  it('cukroví jen po 0,5 kg, koláče jen celé kusy', () => {
    const s = order((o) => {
      o.type = 'bezna';
      o.items = [line('kolac-tvarohovy', 2.5), line('cukrovi-kremove', 1.2)];
    });
    const errors = validateItems(s, TODAY);
    expect(errors['f-qty-kolac-tvarohovy|']).toMatch(/celý počet/);
    expect(errors['f-qty-cukrovi-kremove|']).toMatch(/0,5 kg/);
  });

  it('vánoční cukroví po 15. 11. 2026 nelze objednat', () => {
    const s = order((o) => {
      o.type = 'bezna';
      o.items = [line('vanocni-cukrovi-mix', 1, '1kg')];
    });
    expect(validateItems(s, '2026-11-15')).toEqual({});
    expect(Object.values(validateItems(s, '2026-11-16'))[0]).toMatch(/15\. 11\. 2026/);
  });

  it('sezónní velikonoční výrobky nelze objednat', () => {
    const s = order((o) => {
      o.type = 'bezna';
      o.items = [line('mazanec', 1)];
    });
    expect(Object.values(validateItems(s, TODAY))[0]).toMatch(/Sezónní/);
  });
});

describe('podrobnosti', () => {
  it('dort vyžaduje velikost, tvar, korpus a krém', () => {
    const errors = validateDetails(order((s) => (s.type = 'dort')));
    expect(Object.keys(errors)).toEqual(['f-cake-persons', 'f-cake-shape', 'f-cake-sponge', 'f-cake-cream']);
  });

  it('výslužka: celofán 4–25 koláčů a součet složení', () => {
    const s = order((o) => {
      o.type = 'vysluzky';
      o.details.favors = [
        {
          id: 'x',
          count: 5,
          perPack: 30,
          composition: { 'kolac-tvarohovy': 10 },
          packaging: 'celofan',
          boxId: '',
          ribbon: 'Zlatá',
          marzipanHeart: '',
          gingerHeart: false,
          gingerHeartText: '',
          cookies: 0,
          frgal: false,
        },
      ];
    });
    const errors = validateDetails(s);
    expect(errors['f-favor-0-perPack']).toMatch(/4 až 25/);
    expect(errors['f-favor-0-composition']).toMatch(/musí odpovídat/);
  });
});

describe('zákazník', () => {
  it('česká chybová hlášení pro jméno, telefon, e-mail a souhlas', () => {
    const errors = validateCustomer(
      order((s) => (s.customer = { name: 'Jana', phone: '12345', email: 'jana@', note: '', consent: false, website: '' })),
    );
    expect(errors['f-customer-name']).toMatch(/příjmení/);
    expect(errors['f-customer-phone']).toMatch(/775 982 575/);
    expect(errors['f-customer-email']).toMatch(/platný e-mail/);
    expect(errors['f-customer-consent']).toMatch(/souhlasu/);
  });

  it('přijme běžné formáty českého telefonu', () => {
    for (const phone of ['775982575', '775 982 575', '+420 775 982 575', '00420775982575']) {
      const errors = validateCustomer(
        order((s) => (s.customer = { name: 'Jana Nováková', phone, email: 'jana@seznam.cz', note: '', consent: true, website: '' })),
      );
      expect(errors).toEqual({});
    }
  });

  it('vyplněný honeypot zablokuje odeslání', () => {
    const errors = validateCustomer(
      order((s) => (s.customer = { name: 'Jana Nováková', phone: '775982575', email: 'jana@seznam.cz', note: '', consent: true, website: 'spam' })),
    );
    expect(errors['f-customer-website']).toBeDefined();
  });
});

describe('celá objednávka', () => {
  const valid = () =>
    order((s) => {
      s.type = 'bezna';
      s.items = [line('kolac-tvarohovy', 10)];
      s.pickup = { place: 'paskov', date: '2026-10-13', time: '08:00' };
      s.customer = { name: 'Jana Nováková', phone: '775 982 575', email: 'jana@seznam.cz', note: '', consent: true, website: '' };
    });

  it('platná objednávka projde a payload odpovídá schématu', () => {
    const s = valid();
    expect(validateOrder(s, TODAY)).toBeNull();
    const parsed = orderPayloadSchema.safeParse(buildPayload(s));
    expect(parsed.success).toBe(true);
    expect(parsed.data?.items[0]).toMatchObject({ productId: 'kolac-tvarohovy', qty: 10, unitPrice: 27, total: 270 });
    expect(parsed.data?.pricing.complete).toBe(true);
  });

  it('příliš rychlé odeslání je považováno za spam', () => {
    const s = valid();
    s.startedAt = Date.now();
    expect(validateOrder(s, TODAY)?.errors['f-submit']).toBeDefined();
  });
});
