import { z } from 'zod';
import { CUKROVI_RULES, FAVOR_BOXES, FAVOR_LIMITS } from '../data/orderRules';
import { getProduct } from '../data/products';
import { validatePickup } from './pickup';
import { hasFavors, needsCake, type OrderState } from './types';

export type StepId = 'typ' | 'vyrobky' | 'detaily' | 'vyzvednuti' | 'kontakt' | 'souhrn';

export const STEPS: Array<{ id: StepId; title: string }> = [
  { id: 'typ', title: 'Typ objednávky' },
  { id: 'vyrobky', title: 'Výrobky' },
  { id: 'detaily', title: 'Podrobnosti' },
  { id: 'vyzvednuti', title: 'Vyzvednutí' },
  { id: 'kontakt', title: 'Kontakt' },
  { id: 'souhrn', title: 'Souhrn' },
];

/** Chyby podle id pole formuláře (id prvku v DOM pro zaměření). */
export type Errors = Record<string, string>;

/** Český telefon: volitelně +420 / 00420, 9 číslic, mezery povoleny. */
export const PHONE_RE = /^(?:\+420|00420)?\s?[1-9]\d{2}\s?\d{3}\s?\d{3}$/;

/** Minimální doba vyplňování (ms) – rychlejší odeslání považujeme za robota. */
export const MIN_FILL_TIME_MS = 5000;

export const customerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, 'Vyplňte jméno a příjmení.')
    .max(120, 'Jméno je příliš dlouhé.')
    .refine((v) => v.split(/\s+/).length >= 2, 'Uveďte jméno i příjmení.'),
  phone: z.string().trim().regex(PHONE_RE, 'Zadejte telefon ve tvaru 775 982 575 nebo +420 775 982 575.'),
  email: z.string().trim().email('Zadejte platný e-mail, např. jana.novakova@seznam.cz.').max(200),
  note: z.string().max(2000, 'Poznámka může mít nejvýše 2000 znaků.'),
  consent: z.literal(true, { error: 'Bez souhlasu se zpracováním údajů nemůžeme objednávku vyřídit.' }),
  website: z.string().max(0, 'Formulář se nepodařilo ověřit.'),
});

function fromZod(result: { success: boolean; error?: z.ZodError }, prefix: string): Errors {
  if (result.success || !result.error) return {};
  const errors: Errors = {};
  for (const issue of result.error.issues) {
    const key = `${prefix}${issue.path.join('-')}`;
    errors[key] ??= issue.message;
  }
  return errors;
}

const kolaceInOrder = (s: OrderState) =>
  s.items.some((l) => getProduct(l.productId)?.rule === 'kolac') ||
  (hasFavors(s) && s.details.favors.some((f) => f.count > 0));

export function validateItems(s: OrderState, today: string): Errors {
  const errors: Errors = {};
  const requiresItems = s.type === 'bezna' || s.type === 'firemni';
  if (requiresItems && s.items.length === 0) {
    errors['f-items'] = 'Přidejte do objednávky alespoň jeden výrobek.';
  }
  for (const line of s.items) {
    const p = getProduct(line.productId);
    if (!p) {
      errors[`f-qty-${line.key}`] = 'Výrobek již není v nabídce – odeberte jej prosím.';
      continue;
    }
    if (!p.orderable) errors[`f-qty-${line.key}`] = p.notOrderableReason ?? 'Výrobek nyní nelze objednat.';
    const step = p.step ?? 1;
    const min = p.minQty ?? step;
    if (!(line.qty >= min) || Math.abs(line.qty / step - Math.round(line.qty / step)) > 1e-9) {
      errors[`f-qty-${line.key}`] =
        step === 1 ? 'Zadejte celý počet kusů.' : `Množství zadávejte po ${String(step).replace('.', ',')} kg.`;
    }
    if (p.maxQty && line.qty > p.maxQty) errors[`f-qty-${line.key}`] = `Maximálně ${p.maxQty} ks v jedné objednávce.`;
    if (p.variants?.length && !p.variants.some((v) => v.id === line.variantId)) {
      errors[`f-qty-${line.key}`] = 'Vyberte variantu výrobku.';
    }
    if (p.rule === 'cukrovi-vanocni' && today > CUKROVI_RULES.christmasDeadline) {
      errors[`f-qty-${line.key}`] = 'Objednávky vánočního cukroví přijímáme jen do 15. 11. 2026.';
    }
  }
  if (s.items.some((l) => getProduct(l.productId)?.rule === 'cukrovi-celorocni') && !kolaceInOrder(s)) {
    errors['f-items'] = 'Cukroví během roku lze objednat pouze společně s koláči. Přidejte prosím koláče.';
  }
  return errors;
}

export function validateDetails(s: OrderState): Errors {
  const errors: Errors = {};
  const d = s.details;
  if (needsCake(s)) {
    const c = d.cake;
    const persons = Number(c.persons);
    if (!Number.isInteger(persons) || persons < 1 || persons > 500) errors['f-cake-persons'] = 'Uveďte počet porcí (osob).';
    if (!c.shape) errors['f-cake-shape'] = 'Vyberte tvar dortu.';
    if (!c.sponge) errors['f-cake-sponge'] = 'Vyberte korpus.';
    if (!c.cream) errors['f-cake-cream'] = 'Vyberte krém.';
    if (c.text.length > 80) errors['f-cake-text'] = 'Text na dort může mít nejvýše 80 znaků.';
  }
  if (s.type === 'oslava' && s.items.length === 0 && !d.wantsCake) {
    errors['f-wantsCake'] = 'Přidejte výrobky v předchozím kroku nebo zvolte dort.';
  }
  if (s.type === 'svatba') {
    if (!d.wedding.date) errors['f-wedding-date'] = 'Uveďte datum svatby.';
    if (!d.wedding.pickupWhen) errors['f-wedding-pickupWhen'] = 'Zvolte, zda vyzvednete v den svatby, nebo den předem.';
    if (d.wedding.interests.length === 0 && s.items.length === 0) {
      errors['f-wedding-interests'] = 'Zaškrtněte, o co máte zájem.';
    }
  }
  if (hasFavors(s)) {
    if (d.favors.length === 0) errors['f-favors'] = 'Přidejte alespoň jeden typ výslužky.';
    d.favors.forEach((f, i) => {
      const p = `f-favor-${i}-`;
      if (!Number.isInteger(f.count) || f.count < 1) errors[`${p}count`] = 'Zadejte počet balíčků.';
      if (f.packaging === 'celofan' && (f.perPack < FAVOR_LIMITS.min || f.perPack > FAVOR_LIMITS.max)) {
        errors[`${p}perPack`] = `Do celofánové výslužky lze zabalit ${FAVOR_LIMITS.min} až ${FAVOR_LIMITS.max} koláčů.`;
      }
      if (f.packaging === 'krabicka') {
        const box = FAVOR_BOXES.find((b) => b.id === f.boxId);
        if (!box) errors[`${p}boxId`] = 'Vyberte krabičku.';
        else if (f.perPack > box.maxKolace) errors[`${p}perPack`] = `Do ${box.name} se vejde nejvýše ${box.maxKolace} koláčů.`;
        if (f.perPack < 1) errors[`${p}perPack`] = 'Zadejte počet koláčů v balíčku.';
      }
      const sum = Object.values(f.composition).reduce((a, b) => a + b, 0);
      if (sum !== f.perPack) {
        errors[`${p}composition`] = `Součet druhů koláčů (${sum}) musí odpovídat počtu koláčů v balíčku (${f.perPack}).`;
      }
      if (f.gingerHeart && f.gingerHeartText.length > 40) errors[`${p}gingerHeartText`] = 'Text na srdíčko může mít nejvýše 40 znaků.';
    });
  }
  if (s.type === 'firemni' && !d.company.occasion.trim() && s.items.length === 0) {
    errors['f-company-occasion'] = 'Popište prosím akci.';
  }
  if (s.type === 'jina' && d.other.description.trim().length < 10) {
    errors['f-other-description'] = 'Popište prosím, co potřebujete (alespoň pár slov).';
  }
  if (d.specialRequests.length > 2000) errors['f-specialRequests'] = 'Text může mít nejvýše 2000 znaků.';
  return errors;
}

export function validateCustomer(s: OrderState): Errors {
  return fromZod(customerSchema.safeParse(s.customer), 'f-customer-');
}

export function validateStep(step: StepId, s: OrderState, today: string): Errors {
  switch (step) {
    case 'typ':
      return s.type ? {} : { 'f-type': 'Vyberte typ objednávky.' };
    case 'vyrobky':
      return validateItems(s, today);
    case 'detaily':
      return validateDetails(s);
    case 'vyzvednuti':
      return Object.fromEntries(validatePickup(s, today).map((i) => [`f-pickup-${i.field}`, i.message]));
    case 'kontakt':
      return validateCustomer(s);
    case 'souhrn':
      return {};
  }
}

/** Kompletní kontrola před odesláním. Vrací první krok s chybou. */
export function validateOrder(s: OrderState, today: string, now = Date.now()): { step: StepId; errors: Errors } | null {
  for (const { id } of STEPS) {
    const errors = validateStep(id, s, today);
    if (Object.keys(errors).length > 0) return { step: id, errors };
  }
  if (now - s.startedAt < MIN_FILL_TIME_MS) {
    return { step: 'souhrn', errors: { 'f-submit': 'Formulář byl odeslán příliš rychle. Zkuste to prosím znovu za chvíli.' } };
  }
  return null;
}
