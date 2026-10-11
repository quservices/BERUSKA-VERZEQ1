import { describe, expect, it } from 'vitest';
import { computeTotals, priceFavorPack } from '../pricing';
import type { FavorPack } from '../types';
import { line, order } from './helpers';

describe('computeTotals', () => {
  it('sčítá jen položky s ověřenou cenou a označí neoceněné', () => {
    const totals = computeTotals(
      order((s) => {
        s.type = 'bezna';
        s.items = [line('kolac-tvarohovy', 3), line('chlebicek-sunka-salat', 2), line('tiramisu', 4)];
      }),
    );
    expect(totals.knownTotal).toBe(3 * 27 + 2 * 37);
    expect(totals.hasUnpriced).toBe(true);
    expect(totals.lines.find((l) => l.product.id === 'tiramisu')?.total).toBeUndefined();
  });

  it('bez neoceněných položek je cena kompletní', () => {
    const totals = computeTotals(order((s) => (s.items = [line('kolac-makovy-strihany', 10)])));
    expect(totals.knownTotal).toBe(280);
    expect(totals.hasUnpriced).toBe(false);
  });

  it('nad 1000 koláčů odečte 1 Kč/ks, do 1000 ne', () => {
    expect(computeTotals(order((s) => (s.items = [line('kolac-tvarohovy', 1000)]))).discount).toBe(0);
    const big = computeTotals(order((s) => (s.items = [line('kolac-tvarohovy', 1001)])));
    expect(big.discount).toBe(1001);
    expect(big.knownTotal).toBe(1001 * 27 - 1001);
  });

  it('vánoční cukroví počítá cenu za balení podle hmotnosti a zálohu', () => {
    const totals = computeTotals(order((s) => (s.items = [line('vanocni-cukrovi-mix', 2, '1.5kg')])));
    expect(totals.lines[0].unitPrice).toBe(1575);
    expect(totals.lines[0].total).toBe(3150);
    expect(totals.notes.some((n) => n.includes('cukroví') && n.includes('600'))).toBe(true);
  });

  it('upozorní na zálohu nad 100 koláčů', () => {
    const totals = computeTotals(order((s) => (s.items = [line('kolac-orechovy', 101)])));
    expect(totals.notes.some((n) => n.includes('nad 100 koláčů'))).toBe(true);
  });
});

describe('priceFavorPack', () => {
  const pack: FavorPack = {
    id: 'a',
    count: 10,
    perPack: 5,
    composition: { 'kolac-tvarohovy': 2, 'kolac-makovy-strihany': 3 },
    packaging: 'krabicka',
    boxId: 'k11',
    ribbon: '',
    marzipanHeart: '',
    gingerHeart: false,
    gingerHeartText: '',
    cookies: 0,
    frgal: false,
  };

  it('spočítá koláče a krabičky včetně balného', () => {
    const p = priceFavorPack(pack);
    expect(p.kolaceCount).toBe(50);
    expect(p.kolaceCost).toBe(10 * (2 * 27 + 3 * 28));
    expect(p.boxCost).toBe(10 * (17 + 20));
    expect(p.unpriced).toEqual([]);
  });

  it('celofán a doplňky bez ceny vrací jako položky na dotaz', () => {
    const p = priceFavorPack({ ...pack, packaging: 'celofan', marzipanHeart: 'Srdíčko č. 2 zlaté', cookies: 5 });
    expect(p.boxCost).toBe(0);
    expect(p.unpriced).toEqual(['zabalení do celofánu', 'marcipánové srdíčko', 'cukrátka']);
  });
});
