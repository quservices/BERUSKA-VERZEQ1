/**
 * Centrální údaje o firmě. Vše převzato z oficiálního webu https://www.cukrarnaberuska.cz/
 * (stav k 11. 10. 2026). Údaje s `needsVerification` je nutné potvrdit s cukrárnou před spuštěním.
 */

export type LocationId = 'paskov' | 'zaben';

/** Otevírací doba: klíč = den v týdnu dle Date.getDay() (0 = neděle), hodnota = intervaly "HH:MM". */
export type WeeklyHours = Record<number, Array<[string, string]>>;

export interface Phone {
  display: string;
  tel: string;
  label: string;
  person?: string;
  needsVerification?: string;
}

export interface Location {
  id: LocationId;
  name: string;
  shortName: string;
  street: string;
  city: string;
  zip: string;
  description: string;
  hours: WeeklyHours;
  pickupNote?: string;
  mapQuery: string;
}

export interface SpecialDay {
  /** ISO datum YYYY-MM-DD */
  date: string;
  location: LocationId;
  label: string;
  /** null = zavřeno; 'unknown' = na webu neuvedeno („???“) */
  hours: Array<[string, string]> | null | 'unknown';
  note?: string;
}

const tueToFri = (intervals: Array<[string, string]>) => ({ 2: intervals, 3: intervals, 4: intervals, 5: intervals });

export const business = {
  name: 'Cukrárna Beruška',
  brand: 'mlsná Beruška',
  foundedYear: 1997,
  foundedDate: '1997-03-13',
  movedToPaskov: '2026-01-15',
  email: 'cukrarna.beruska@seznam.cz',
  officialWeb: 'https://www.cukrarnaberuska.cz/',
  facebook: 'https://www.facebook.com/Beruskacukrarna',

  phones: {
    orders: {
      label: 'Objednávky a prodejna Paskov',
      display: '775 982 575',
      tel: '+420775982575',
    },
    production: {
      label: 'Výrobna Žabeň',
      display: '774 853 864',
      tel: '+420774853864',
      needsVerification:
        'Stránka Kontakty uvádí 774 853 864, leták vánočního cukroví 2026 uvádí pro výrobnu 608 848 364.',
    },
    special: {
      label: 'Svatby, výslužky, dorty a složitější objednávky',
      person: 'Michaela Čuboň',
      display: '608 613 101',
      tel: '+420608613101',
    },
  } satisfies Record<string, Phone>,

  /** Telefonické objednávky přijímáme v pracovní době + v pondělí 7–17 h (dle sekce Koláče). */
  phoneOrdersNote: 'Objednávky přijímáme telefonicky v otevírací době a také v pondělí 7–17 h.',

  locations: {
    paskov: {
      id: 'paskov',
      name: 'Prodejna Paskov',
      shortName: 'Paskov',
      street: 'Náměstí 44',
      city: 'Paskov',
      zip: '739 21',
      description: 'Prodejna cukrárny a výdej objednávek.',
      hours: {
        0: [['09:00', '16:00']],
        1: [],
        ...tueToFri([
          ['07:00', '12:00'],
          ['12:30', '17:00'],
        ]),
        6: [['08:00', '16:00']],
      },
      mapQuery: 'Náměstí 44, 739 21 Paskov',
    },
    zaben: {
      id: 'zaben',
      name: 'Výrobna Žabeň',
      shortName: 'Žabeň',
      street: 'Žabeň 208',
      city: 'Žabeň',
      zip: '739 25',
      description: 'Výdej objednávek a drobný prodej zboží přímo z pece.',
      pickupNote: 'Při objednávce uveďte místo vyzvednutí Žabeň.',
      hours: {
        0: [],
        1: [],
        ...tueToFri([['06:00', '10:00']]),
        6: [['07:00', '09:00']],
      },
      mapQuery: 'Žabeň 208, 739 25',
    },
  } as Record<LocationId, Location>,

  closedLocation: {
    name: 'Původní prodejna Sviadnov',
    address: 'Ostravská 388, Sviadnov',
    note: 'Trvale uzavřena – prodejna se 15. 1. 2026 přestěhovala do Paskova.',
  },

  operator: {
    name: 'Andrea Kolková',
    address: 'Žabeň 208, 739 25 Sviadnov',
    ico: '23915757',
  },

  /** Svátky a plánované uzavření prodejny dle stránky Otevírací doba (rok 2026). */
  specialDays: [
    { date: '2026-10-28', location: 'paskov', label: 'Den vzniku Československa', hours: 'unknown' },
    { date: '2026-11-17', location: 'paskov', label: 'Den boje za svobodu a demokracii', hours: 'unknown' },
    { date: '2026-12-21', location: 'paskov', label: 'Předvánoční provoz', hours: [['07:00', '16:00']] },
    { date: '2026-12-22', location: 'paskov', label: 'Předvánoční provoz', hours: [['07:00', '16:00']] },
    {
      date: '2026-12-23',
      location: 'paskov',
      label: 'Předvánoční provoz',
      hours: [['07:00', '12:00']],
      note: 'Objednávky vyzvedněte do 12 h, od 12 do 13 h doprodej nevyzvednutých objednávek. Otevřeno do 14 h.',
    },
    { date: '2026-12-24', location: 'paskov', label: 'Štědrý den', hours: null },
    { date: '2026-12-25', location: 'paskov', label: 'Vánoce', hours: null },
    { date: '2026-12-26', location: 'paskov', label: 'Vánoce', hours: null },
    { date: '2026-12-27', location: 'paskov', label: 'Vánoce', hours: null },
    { date: '2026-12-28', location: 'paskov', label: 'Vánoce', hours: null },
    { date: '2026-12-29', location: 'paskov', label: 'Vánoce', hours: null },
    { date: '2026-12-30', location: 'paskov', label: 'Mezi svátky', hours: [['08:00', '15:00']] },
    { date: '2026-12-31', location: 'paskov', label: 'Silvestr', hours: [['08:00', '14:00']] },
  ] as SpecialDay[],

  /** Údaje, které se na oficiálním webu rozcházejí nebo chybí – zobrazují se v docs/verified-data.md. */
  openQuestions: [
    'Telefon výrobny: 774 853 864 (Kontakty) vs. 608 848 364 (leták cukroví 2026).',
    'Gramáž povidlového koláče: 75 g (ceník) vs. 90 g (text v sekci Koláče).',
    'Otevírací doba 28. 10. a 17. 11. 2026 je na webu uvedena jako „???“.',
    'Svátky a uzavírky jsou na webu uvedeny jen pro prodejnu; provoz výrobny o svátcích není uveden.',
    'Cena za zabalení celofánové výslužky na webu chybí (text bez částky).',
    'Odkaz na Instagram je na webu zmíněn, ale adresa profilu není uvedena.',
  ],
};

export const DAY_NAMES = ['Neděle', 'Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota'] as const;

/** Pořadí dnů pro zobrazení (od pondělí). */
export const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0] as const;

export function formatIntervals(intervals: ReadonlyArray<readonly [string, string]>): string {
  if (intervals.length === 0) return 'zavřeno';
  return intervals.map(([from, to]) => `${trimTime(from)}–${trimTime(to)}`).join(', ');
}

function trimTime(t: string): string {
  const [h, m] = t.split(':');
  return m === '00' ? String(Number(h)) : `${Number(h)}:${m}`;
}

export function fullAddress(loc: Location): string {
  // U Žabně je obec už součástí adresy (Žabeň 208) – neopakujeme ji.
  return loc.street.startsWith(loc.city) ? `${loc.street}, ${loc.zip}` : `${loc.street}, ${loc.zip} ${loc.city}`;
}

export const ALLERGENS: Record<number, string> = {
  1: 'Obiloviny obsahující lepek',
  2: 'Korýši',
  3: 'Vejce',
  4: 'Ryby',
  5: 'Arašídy',
  6: 'Sója',
  7: 'Mléko',
  8: 'Skořápkové plody',
  9: 'Celer',
  10: 'Hořčice',
  11: 'Sezam',
  12: 'Oxid siřičitý a siřičitany',
  13: 'Vlčí bob (lupina)',
  14: 'Měkkýši',
};
