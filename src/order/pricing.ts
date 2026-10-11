import { CAKE_DEPOSIT, CUKROVI_RULES, FAVOR_BOXES, FAVOR_BOX_PACKING_FEE, KOLACE_RULES, WEDDING } from '../data/orderRules';
import { getProduct, type Product, type Variant } from '../data/products';
import { formatCzk, formatNumber } from '../lib/format';
import { hasFavors, needsCake, type CartLine, type FavorPack, type OrderState } from './types';

export interface PricedLine {
  line: CartLine;
  product: Product;
  variant?: Variant;
  /** Cena za jednotku objednávky (u vánočního cukroví za jedno balení). */
  unitPrice?: number;
  total?: number;
  unitLabel: string;
  qtyLabel: string;
}

export function priceLine(line: CartLine): PricedLine | null {
  const product = getProduct(line.productId);
  if (!product) return null;
  const variant = product.variants?.find((v) => v.id === line.variantId);
  const isKgBox = product.rule === 'cukrovi-vanocni' && variant?.kg !== undefined;
  const unitLabel = product.price?.unit === 'kg' && !isKgBox ? 'kg' : isKgBox ? 'bal.' : product.price?.unit === 'sada' ? 'sada' : 'ks';
  let unitPrice: number | undefined;
  if (product.price) unitPrice = isKgBox ? product.price.amount * (variant!.kg as number) : product.price.amount;
  return {
    line,
    product,
    variant,
    unitPrice,
    total: unitPrice !== undefined ? round(unitPrice * line.qty) : undefined,
    unitLabel,
    qtyLabel: `${formatNumber(line.qty)} ${unitLabel}`,
  };
}

export interface FavorPricing {
  pack: FavorPack;
  kolaceCount: number;
  kolaceCost: number;
  boxCost: number;
  /** Položky výslužky, jejichž cena na webu není uvedena. */
  unpriced: string[];
}

export function priceFavorPack(pack: FavorPack): FavorPricing {
  const perPackKolaceCost = Object.entries(pack.composition).reduce(
    (sum, [id, n]) => sum + (getProduct(id)?.price?.amount ?? 0) * n,
    0,
  );
  const unpriced: string[] = [];
  let boxCost = 0;
  if (pack.packaging === 'krabicka') {
    const box = FAVOR_BOXES.find((b) => b.id === pack.boxId);
    if (box) boxCost = (box.price + FAVOR_BOX_PACKING_FEE) * pack.count;
  } else {
    unpriced.push('zabalení do celofánu');
  }
  if (pack.marzipanHeart && pack.marzipanHeart !== 'Bez srdíčka') unpriced.push('marcipánové srdíčko');
  if (pack.gingerHeart) unpriced.push('perníkové srdíčko');
  if (pack.cookies > 0) unpriced.push('cukrátka');
  if (pack.frgal) unpriced.push('frgál');
  return {
    pack,
    kolaceCount: pack.perPack * pack.count,
    kolaceCost: perPackKolaceCost * pack.count,
    boxCost,
    unpriced,
  };
}

export interface OrderTotals {
  lines: PricedLine[];
  favors: FavorPricing[];
  /** Celkový počet koláčů (košík + výslužky) – pro slevu a zálohy. */
  kolaceCount: number;
  discount: number;
  /** Součet položek s ověřenou cenou po slevě. */
  knownTotal: number;
  /** V objednávce jsou položky bez ověřené ceny – celkovou cenu nelze spočítat. */
  hasUnpriced: boolean;
  notes: string[];
}

export function computeTotals(state: OrderState): OrderTotals {
  const lines = state.items.map(priceLine).filter((l): l is PricedLine => l !== null);
  const favors = hasFavors(state) ? state.details.favors.map(priceFavorPack) : [];

  const cartKolace = lines.filter((l) => l.product.rule === 'kolac').reduce((s, l) => s + l.line.qty, 0);
  const kolaceCount = cartKolace + favors.reduce((s, f) => s + f.kolaceCount, 0);
  const discount = kolaceCount > KOLACE_RULES.discountThreshold ? kolaceCount * KOLACE_RULES.discountPerPiece : 0;

  const linesTotal = lines.reduce((s, l) => s + (l.total ?? 0), 0);
  const favorsTotal = favors.reduce((s, f) => s + f.kolaceCost + f.boxCost, 0);
  const knownTotal = round(linesTotal + favorsTotal - discount);

  const hasUnpriced =
    lines.some((l) => l.total === undefined) ||
    favors.some((f) => f.unpriced.length > 0) ||
    needsCake(state) ||
    (lines.length === 0 && favors.length === 0) ||
    lines.some((l) => l.product.price?.note?.includes('krabička'));

  const notes: string[] = [];
  if (discount > 0) {
    notes.push(`Sleva ${KOLACE_RULES.discountPerPiece} Kč/ks za objednávku nad ${KOLACE_RULES.discountThreshold} koláčů je započtena.`);
  }
  if (kolaceCount > KOLACE_RULES.depositThreshold) {
    notes.push(`U objednávky nad ${KOLACE_RULES.depositThreshold} koláčů přijímáme zálohu cca ${formatCzk(KOLACE_RULES.depositApprox)} v hotovosti na prodejně.`);
  }
  if (cartKolace >= KOLACE_RULES.crateSize) {
    notes.push(
      `Koláče připravíme v přepravkách (${KOLACE_RULES.crateSize} ks) nebo v krabicích – podle velikosti objednávky. Záloha na přepravku: ${formatCzk(KOLACE_RULES.crateDepositSingle)} za 1 ks, od 2 ks ${formatCzk(KOLACE_RULES.crateDepositMulti)}/ks.`,
    );
  }
  const christmasKg = lines
    .filter((l) => l.product.rule === 'cukrovi-vanocni' && l.variant?.kg)
    .reduce((s, l) => s + (l.variant!.kg as number) * l.line.qty, 0);
  if (christmasKg > 0) {
    notes.push(
      `Záloha na vánoční cukroví: ${formatCzk(CUKROVI_RULES.christmasDepositPerKg)}/kg, tj. ${formatCzk(christmasKg * CUKROVI_RULES.christmasDepositPerKg)}.`,
    );
  }
  if (lines.some((l) => l.product.price?.note?.includes('krabička'))) {
    notes.push('K cukroví se připočítává cena krabičky (na webu neuvedena).');
  }
  if (needsCake(state)) {
    notes.push(`Pro potvrzení objednávky dortu je potřeba uhradit zálohu ${formatCzk(CAKE_DEPOSIT.min)}–${formatCzk(CAKE_DEPOSIT.max)} dle velikosti dortu.`);
  }
  if (state.type === 'svatba' && state.details.wedding.interests.includes('dort')) {
    notes.push(
      `Svatební dort předáváme v chladicím termoboxu – vratná záloha ${formatCzk(WEDDING.thermoboxDeposit)}, na přepravku ${formatCzk(WEDDING.crateDeposit)}.`,
    );
  }

  return { lines, favors, kolaceCount, discount, knownTotal, hasUnpriced, notes };
}

function round(n: number) {
  return Math.round(n * 100) / 100;
}
