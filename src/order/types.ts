import type { LocationId } from '../data/business';

export type OrderType = 'bezna' | 'dort' | 'oslava' | 'svatba' | 'vysluzky' | 'firemni' | 'jina';

export const ORDER_TYPES: Array<{ id: OrderType; name: string; description: string }> = [
  { id: 'bezna', name: 'Běžná objednávka', description: 'Koláče, zákusky, chlebíčky, pečivo či cukroví k vyzvednutí.' },
  { id: 'dort', name: 'Dort na míru', description: 'Korpus, krém, povrch, zdobení i text na dort.' },
  { id: 'oslava', name: 'Narozeniny a rodinná oslava', description: 'Sladké i slané pohoštění, případně s dortem.' },
  { id: 'svatba', name: 'Svatba', description: 'Svatební koláče, dort, výslužky, cukroví a sweet bar.' },
  { id: 'vysluzky', name: 'Výslužky', description: 'Celofánové výslužky nebo výslužky do krabiček.' },
  { id: 'firemni', name: 'Firemní akce', description: 'Pohoštění na poradu, večírek nebo dárky pro partnery.' },
  { id: 'jina', name: 'Jiná objednávka', description: 'Napište nám, co potřebujete.' },
];

export interface CartLine {
  /** productId|variantId */
  key: string;
  productId: string;
  variantId?: string;
  qty: number;
}

export interface CakeDetails {
  persons: string;
  shape: string;
  sponge: string;
  cream: string;
  surface: string;
  decorations: string[];
  fruit: string;
  recipient: string;
  nameAge: string;
  text: string;
  ediblePaper: boolean;
  idea: string;
}

export interface FavorPack {
  id: string;
  /** Počet stejných balíčků. */
  count: number;
  /** Počet koláčů v jednom balíčku. */
  perPack: number;
  /** Složení jednoho balíčku: productId koláče → počet kusů. */
  composition: Record<string, number>;
  packaging: 'celofan' | 'krabicka';
  boxId: string;
  ribbon: string;
  marzipanHeart: string;
  /** Text na perníkové srdíčko; prázdné = bez srdíčka. */
  gingerHeartText: string;
  gingerHeart: boolean;
  cookies: number;
  frgal: boolean;
}

export interface OrderDetails {
  wantsCake: boolean;
  cake: CakeDetails;
  celebration: { occasion: string; guests: string };
  wedding: { date: string; pickupWhen: '' | 'den-predem' | 'v-den'; guests: string; interests: string[] };
  favors: FavorPack[];
  company: { name: string; guests: string; occasion: string };
  other: { description: string };
  /** Speciální požadavky (u koláčů bez záruky splnění). */
  specialRequests: string;
}

export interface Pickup {
  place: LocationId | '';
  date: string;
  time: string;
}

export interface Customer {
  name: string;
  phone: string;
  email: string;
  note: string;
  consent: boolean;
  /** Honeypot – skryté pole, které vyplní jen roboti. */
  website: string;
}

export interface OrderState {
  type: OrderType | null;
  items: CartLine[];
  details: OrderDetails;
  pickup: Pickup;
  customer: Customer;
  /** Čas začátku vyplňování (ochrana proti spamu). */
  startedAt: number;
}

export const emptyCake = (): CakeDetails => ({
  persons: '',
  shape: '',
  sponge: '',
  cream: '',
  surface: '',
  decorations: [],
  fruit: '',
  recipient: '',
  nameAge: '',
  text: '',
  ediblePaper: false,
  idea: '',
});

export const emptyOrder = (now = Date.now()): OrderState => ({
  type: null,
  items: [],
  details: {
    wantsCake: false,
    cake: emptyCake(),
    celebration: { occasion: '', guests: '' },
    wedding: { date: '', pickupWhen: '', guests: '', interests: [] },
    favors: [],
    company: { name: '', guests: '', occasion: '' },
    other: { description: '' },
    specialRequests: '',
  },
  pickup: { place: '', date: '', time: '' },
  customer: { name: '', phone: '', email: '', note: '', consent: false, website: '' },
  startedAt: now,
});

export const lineKey = (productId: string, variantId?: string) => `${productId}|${variantId ?? ''}`;

/** Má objednávka konfiguraci dortu? */
export const needsCake = (s: Pick<OrderState, 'type' | 'details'>) =>
  s.type === 'dort' ||
  (s.type === 'oslava' && s.details.wantsCake) ||
  (s.type === 'svatba' && s.details.wedding.interests.includes('dort'));

/** Má objednávka výslužky? */
export const hasFavors = (s: Pick<OrderState, 'type' | 'details'>) =>
  s.type === 'vysluzky' || (s.type === 'svatba' && s.details.wedding.interests.includes('vysluzky'));

export const WEDDING_INTERESTS = [
  { id: 'kolace', label: 'Svatební koláče' },
  { id: 'dort', label: 'Svatební dort' },
  { id: 'vysluzky', label: 'Výslužky' },
  { id: 'cukrovi', label: 'Cukroví na svatební stůl' },
  { id: 'frgaly', label: 'Frgály' },
  { id: 'sweetbar', label: 'Sweet bar' },
] as const;
