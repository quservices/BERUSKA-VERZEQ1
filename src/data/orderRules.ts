/**
 * Pravidla objednávek převzatá z oficiálního webu (sekce Koláče, Dort, Svatba, Cukroví, Vánoce).
 */

export const KOLACE_RULES = {
  /** Sleva −1 Kč/ks u objednávky nad 1000 ks. */
  discountThreshold: 1000,
  discountPerPiece: 1,
  /** Zálohy na koláče při objednávkách nad 100 ks, cca 2000 Kč. */
  depositThreshold: 100,
  depositApprox: 2000,
  crateSize: 25,
  crateDepositSingle: 200,
  crateDepositMulti: 100,
} as const;

export const CUKROVI_RULES = {
  /** Poslední den pro objednávky vánočního cukroví (včetně). */
  christmasDeadline: '2026-11-15',
  christmasDepositPerKg: 200,
  maxBoxKg: 3,
} as const;

/** Minimální předstih ve dnech pro konkrétní požadavky. */
export const LEAD_DAYS = {
  default: 1,
  ediblePaper: 14,
  favorBoxes: 7,
  cakeDecorations: 7,
} as const;

export const CAKE_DEPOSIT = { min: 500, max: 1000 } as const;

export const WEDDING = {
  thermoboxDeposit: 1200,
  crateDeposit: 100,
} as const;

/** Možnosti dortu na míru (sekce Dort). */
export const CAKE_OPTIONS = {
  shapes: ['Kulatý', 'Hranatý', 'Patrový'],
  sponges: ['Tmavý kakaový', 'Světlý', 'Ořechový', 'Kokosový', 'Red velvet'],
  creams: [
    'Pudinkový',
    'Pařížský (čokoládový)',
    'Karamelový',
    'Pistáciový',
    'Ořechový',
    'Tvarohový',
    'Žervé krém',
    'Kiwi krém',
    'Krém z bílé ganáže s malinami',
    'Krém z bílé ganáže s borůvkami',
    'Kávový krém',
  ],
  surfaces: [
    'Světlé čokoládové drobení',
    'Tmavé čokoládové drobení',
    'Obalený v mandlích',
    'Obalený v kokosu (bílý)',
    'Obalený v kokosu (pražený)',
    'Obalený v ořeších',
    'Potažený marcipánem',
    '„Nahý dort“',
  ],
  decorations: [
    'Čerstvé ovoce',
    'Čokoládové ozdoby',
    'Karamelizované dekorace',
    'Marcipánové ozdoby',
    'Jedlé květiny (dle sezóny)',
  ],
  recipients: ['Žena', 'Muž', 'Dítě – holčička', 'Dítě – chlapec', 'Bez určení'],
} as const;

export const RIBBON_COLORS = ['Zlatá', 'Stříbrná', 'Světle růžová'] as const;

export const MARZIPAN_HEARTS = [
  'Bez srdíčka',
  'Srdíčko č. 1 zlaté',
  'Srdíčko č. 2 zlaté',
  'Srdíčko č. 3 zlaté',
  'Srdíčko č. 4 zlaté',
  'Srdíčko č. 1 krémové',
  'Srdíčko č. 2 krémové',
  'Srdíčko č. 3 krémové',
  'Srdíčko č. 4 krémové',
] as const;

/** Celofánová výslužka: 4 až 25 koláčů. */
export const FAVOR_LIMITS = { min: 4, max: 25 } as const;

/** Orientační počet cukrátek do výslužky podle počtu koláčů (tabulka ze sekce Svatba). */
export const FAVOR_COOKIES_TABLE: Record<number, number> = {
  4: 4, 5: 5, 6: 5, 7: 6, 8: 6, 9: 6,
  10: 8, 11: 8, 12: 8, 13: 10, 14: 10, 15: 10,
  16: 12, 17: 12, 18: 12, 19: 12, 20: 12, 21: 12,
  22: 15, 23: 15, 24: 15, 25: 15,
};

export interface FavorBox {
  id: string;
  name: string;
  maxKolace: number;
  size: string;
  price: number;
  color: 'bílá' | 'hnědá přírodní';
  style: string;
}

/** Krabičky na výslužky (ceník „krabičky“ ze sekce Svatba). Zabalení naší obsluhou +20 Kč/ks. */
export const FAVOR_BOXES: FavorBox[] = [
  { id: 'k7', name: 'Krabička č. 7', maxKolace: 15, size: '250 × 250 × 100 mm', price: 15, color: 'bílá', style: 'klasická' },
  { id: 'k8', name: 'Krabička č. 8', maxKolace: 20, size: '300 × 300 × 100 mm', price: 20, color: 'bílá', style: 'klasická' },
  { id: 'k9', name: 'Krabička č. 9', maxKolace: 30, size: '450 × 300 × 100 mm', price: 20, color: 'bílá', style: 'klasická' },
  { id: 'k26', name: 'Krabička č. 26', maxKolace: 10, size: '200 × 200 × 100 mm', price: 15, color: 'hnědá přírodní', style: 'klasická' },
  { id: 'k27', name: 'Krabička č. 27', maxKolace: 20, size: '280 × 280 × 100 mm', price: 20, color: 'hnědá přírodní', style: 'klasická' },
  { id: 'k10', name: 'Krabička č. 10 (2dílná)', maxKolace: 40, size: '450 × 355 × 100 mm', price: 35, color: 'hnědá přírodní', style: 'dvoudílná' },
  { id: 'k25', name: 'Krabička č. 25', maxKolace: 35, size: '420 × 380 × 70 mm', price: 35, color: 'hnědá přírodní', style: 'klasická' },
  { id: 'k11', name: 'Krabička č. 11', maxKolace: 6, size: '180 × 180 × 100 mm', price: 17, color: 'bílá', style: 's uchem' },
  { id: 'k12', name: 'Krabička č. 12', maxKolace: 8, size: '210 × 210 × 80 mm', price: 18, color: 'bílá', style: 's uchem' },
  { id: 'k13', name: 'Krabička č. 13', maxKolace: 15, size: '260 × 260 × 110 mm', price: 27, color: 'bílá', style: 's uchem' },
  { id: 'k14', name: 'Krabička č. 14', maxKolace: 20, size: '300 × 300 × 110 mm', price: 29, color: 'bílá', style: 's uchem' },
  { id: 'k17', name: 'Krabička č. 17', maxKolace: 6, size: '180 × 180 × 90 mm', price: 14, color: 'bílá', style: 's okénkem' },
  { id: 'k19', name: 'Krabička č. 19', maxKolace: 8, size: '250 × 150 × 80 mm', price: 17, color: 'bílá', style: 's okénkem' },
  { id: 'k22', name: 'Krabička č. 22', maxKolace: 12, size: '250 × 250 × 120 mm', price: 26, color: 'bílá', style: 's okénkem' },
  { id: 'k21', name: 'Krabička č. 21', maxKolace: 15, size: '280 × 280 × 130 mm', price: 34, color: 'bílá', style: 's okénkem' },
  { id: 'k28', name: 'Krabička č. 28', maxKolace: 6, size: '190 × 140 × 90 mm', price: 19, color: 'hnědá přírodní', style: 's uchem a okénkem' },
  { id: 'k29', name: 'Krabička č. 29', maxKolace: 6, size: '190 × 140 × 90 mm', price: 15, color: 'hnědá přírodní', style: 's uchem' },
];

export const FAVOR_BOX_PACKING_FEE = 20;

export const FAVOR_SHEET_PDF = 'https://www.cukrarnaberuska.cz/file/2/cukrarna-beruska--rozpis-vysluzek.pdf';
