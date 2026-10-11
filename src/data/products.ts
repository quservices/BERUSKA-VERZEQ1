/**
 * Nabídka výrobků. Zdroj: grafické ceníky na https://www.cukrarnaberuska.cz/ (stav 11. 10. 2026).
 * Cena se uvádí JEN tam, kde ji oficiální web uvádí. Bez ceny = „cena na dotaz“.
 * Fotografie jsou výřezy z oficiálních ceníků (viz scripts/crops.mjs).
 */

export type CategoryId =
  | 'kolace'
  | 'chlebicky'
  | 'zakusky'
  | 'dorty'
  | 'sladke-pecivo'
  | 'slane-pecivo'
  | 'cukrovi'
  | 'ozdoby'
  | 'velikonoce';

export interface Category {
  id: CategoryId;
  name: string;
  intro: string;
  /** Doplňující pravidla z oficiálního webu, zobrazují se u kategorie. */
  rules?: string[];
  seasonal?: boolean;
}

export type Unit = 'ks' | 'kg' | 'sada' | 'balení';

export interface Price {
  amount: number;
  unit: Unit;
  /** Např. „+ krabička“ */
  note?: string;
}

export interface Variant {
  id: string;
  label: string;
  weight?: string;
  /** Pro balení cukroví: hmotnost v kg, cena se násobí. */
  kg?: number;
}

/** Zvláštní pravidla objednávky, která vynucuje konfigurátor (src/order/rules.ts). */
export type OrderRule =
  | 'kolac' // celé kusy, nelze upravovat náplň ani velikost, sleva nad 1000 ks
  | 'cukrovi-celorocni' // po 0,5 kg, jen společně s koláči
  | 'cukrovi-vanocni' // balení 0,5–3 kg, objednávky do 15. 11.
  | 'ozdoba'; // ideálně týden předem

export interface Product {
  id: string;
  name: string;
  category: CategoryId;
  /** Podkategorie pro seskupení v nabídce (např. „Mini zákusky“). */
  group?: string;
  description?: string;
  weight?: string;
  allergens?: number[];
  price?: Price;
  variants?: Variant[];
  /** Klíč do src/data/imageManifest.json, např. "products/kolac-tvarohovy". */
  image?: string;
  imageNote?: string;
  /** false = výrobek lze jen prohlédnout (např. mimo sezónu). */
  orderable: boolean;
  notOrderableReason?: string;
  rule?: OrderRule;
  /** Krok množství (koláče 1, cukroví 0,5 kg). */
  step?: number;
  minQty?: number;
  maxQty?: number;
  needsVerification?: string;
  highlight?: boolean;
}

export const categories: Category[] = [
  {
    id: 'kolace',
    name: 'Koláče',
    intro:
      'Poctivě plněné koláče, které s námi jsou od začátku. Ručně dělané, proto má každý svůj originální tvar.',
    rules: [
      'Gramáž cca 100 g je přibližná z důvodu ruční výroby.',
      'Koláče nepřizpůsobujeme (např. bez marmelády, bez hrozinek) a neděláme jiné velikosti – prosíme, respektujte naše receptury.',
      'Koláče s náplní uvnitř (tvarohový, makový stříhaný, ořechový) vydrží déle vláčné – hodí se do výslužek rozvážených i druhý den.',
      'Sleva −1 Kč/ks u objednávky nad 1000 ks.',
      'Při objednávce nad 100 ks přijímáme zálohu cca 2000 Kč v hotovosti na prodejně.',
      'Koláče připravíme v přepravkách (25 ks) nebo krabicích. Záloha na přepravku 200 Kč (1 ks), od 2 ks 100 Kč/ks.',
    ],
  },
  {
    id: 'chlebicky',
    name: 'Chlebíčky',
    intro: 'Obložené chlebíčky na oslavy, porady i rodinná setkání.',
    rules: ['Aktuálně nelze objednat všechny druhy chlebíčků – níže jsou jen ty, které objednat lze.'],
  },
  {
    id: 'zakusky',
    name: 'Zákusky',
    intro: 'Vlastní zákusky z naší nové výrobny – velké i mini, ideální také do sweet baru.',
    rules: ['Ceny zákusků na webu neuvádíme – rádi vám je sdělíme spolu s potvrzením objednávky.'],
  },
  {
    id: 'dorty',
    name: 'Dorty a rolády',
    intro: 'Poctivé, vláčné dorty plné chuti. Korpusy ani krémy nejsou suché ani hutné.',
    rules: [
      'Dort na míru připravíme podle vašich představ – stačí vyplnit detaily v objednávce.',
      'Pro potvrzení objednávky dortu je potřeba uhradit zálohu 500–1000 Kč dle velikosti.',
      'Jedlý papír s vlastním motivem je nutné objednat alespoň 14 dní předem.',
      'Složité marcipánové figurky nevyrábíme.',
    ],
  },
  {
    id: 'sladke-pecivo',
    name: 'Sladké pečivo',
    intro: 'Závin, frgály, bábovky, koblihy a další dobroty z naší pece.',
  },
  {
    id: 'slane-pecivo',
    name: 'Slané pečivo a chléb',
    intro: 'Díky nové výrobně pečeme i slané pečivo a kváskový chléb.',
  },
  {
    id: 'cukrovi',
    name: 'Cukroví',
    intro: 'Tradiční cukroví podle rodinných receptur – během roku na oslavy a svatby, v zimě vánoční.',
    rules: [
      'Cukroví během roku lze objednat pouze s koláči (kromě vánočního cukroví).',
      'Vánoční cukroví: 22 druhů, cca 80 ks v 1 kg. Jednotlivé druhy nelze vybírat, vanilkové rohlíčky neděláme.',
      'Vánoční cukroví objednávejte do 15. 11. 2026, záloha 200 Kč/kg. Kapacita je omezená.',
      'Balení vánočního cukroví: 0,5 / 1 / 1,5 / 2 / 2,5 / 3 kg. Při větším množství uveďte rozdělení do krabic.',
    ],
  },
  {
    id: 'ozdoby',
    name: 'Ozdoby na dort',
    intro: 'Ručně malované figurky (5–10 cm, většinou cca 8 cm). Po domluvě vyrobíme i věk a jméno dítěte.',
    rules: ['Objednávky přijímáme nejlépe týden před vyzvednutím.'],
  },
  {
    id: 'velikonoce',
    name: 'Velikonoce',
    intro: 'Sezónní velikonoční nabídka.',
    seasonal: true,
    rules: ['Velikonoční výrobky nabízíme pouze v sezóně – nyní je nelze objednat.'],
  },
];

const KOLAC_ALLERGENS = [1, 3, 7, 8];
const NA_DOTAZ = undefined;

const kolac = (
  id: string,
  name: string,
  description: string,
  amount: number,
  image: string | undefined,
  extra: Partial<Product> = {},
): Product => ({
  id,
  name,
  category: 'kolace',
  description,
  weight: '100 g',
  allergens: KOLAC_ALLERGENS,
  price: { amount, unit: 'ks' },
  image,
  orderable: true,
  rule: 'kolac',
  step: 1,
  minQty: 1,
  ...extra,
});

const chlebicek = (
  id: string,
  name: string,
  description: string,
  weight: string,
  allergens: number[],
  amount: number,
  image: string,
): Product => ({
  id: `chlebicek-${id}`,
  name: `Chlebíček ${name}`,
  category: 'chlebicky',
  description,
  weight,
  allergens,
  price: { amount, unit: 'ks' },
  image: `products/chlebicek-${image}`,
  orderable: true,
  step: 1,
  minQty: 1,
});

type Simple = [id: string, name: string, weight: string | undefined, allergens: number[] | undefined, image?: string];

const zakusek = (group: string, prefix = '') =>
  ([id, name, weight, allergens, image]: Simple, extra: Partial<Product> = {}): Product => ({
    id: prefix + id,
    name,
    category: 'zakusky',
    group,
    weight,
    allergens,
    price: NA_DOTAZ,
    image: image === undefined ? `products/${prefix}${id}` : image || undefined,
    orderable: true,
    step: 1,
    minQty: 1,
    ...extra,
  });

const mini = zakusek('Mini zákusky', 'mini-');
const velky = zakusek('Velké zákusky a řezy');

const variants = (...labels: string[]): Variant[] =>
  labels.map((label) => ({ id: label.toLowerCase().replace(/[^a-z0-9á-ž]+/gi, '-'), label }));

export const products: Product[] = [
  // ---------------- KOLÁČE ----------------
  kolac('kolac-tvarohovy', 'Tvarohový koláč', 'Tvarohová náplň uvnitř, marmeláda, tmavá posypka s ořechy.', 27, 'products/kolac-tvarohovy', { highlight: true }),
  kolac('kolac-makovy', 'Makový koláč', 'Maková náplň uvnitř, světlá posypka, třešně.', 27, 'products/kolac-makovy'),
  kolac('kolac-makovy-strihany', 'Makový stříhaný koláč', 'Stříhaný koláč s makovou náplní uvnitř.', 28, undefined, {
    description: 'Stříhaný koláč s makovou náplní uvnitř – vydrží déle vláčný.',
  }),
  kolac('kolac-orechovy', 'Ořechový koláč', 'Ořechová náplň uvnitř, povidla, ananas, 3× půlka mandle.', 27, 'products/kolac-orechovy'),
  kolac('kolac-povidlovy', 'Povidlový koláč', 'Povidlo uvnitř i nahoře, ananas.', 25, 'products/kolac-povidlovy', {
    weight: '75 g',
    allergens: [1, 3, 7],
    needsVerification: 'Ceník uvádí 75 g, text v sekci Koláče 90 g.',
  }),
  kolac('kolac-povidlo-tvaroh', 'Koláč povidlo-tvaroh', 'Povidla uvnitř, tvarohová náplň nahoře, alginát.', 27, 'products/kolac-povidlo-tvaroh'),
  kolac('kolac-povidlo-mak', 'Koláč povidlo-mák', 'Povidla uvnitř, maková náplň nahoře, půlka mandle.', 27, 'products/kolac-povidlo-mak'),

  // ---------------- CHLEBÍČKY (aktuálně objednatelné) ----------------
  chlebicek('sunka-salat', 'šunka na salátu', 'Světlá veka, bramborový salát, šunka, vejce, cherry rajče, kyselá okurka.', '95 g', [1, 3, 9, 10], 37, 'sunka-salat'),
  chlebicek('sunka-syr', 'šunka, sýr', 'Světlá veka, pomazánkové máslo, šunka, sýr, okurka, paprika, lollo salát.', '80 g', [1, 7], 37, 'sunka-syr'),
  chlebicek('ruske-vejce', 'ruské vejce', 'Světlá veka, bramborový salát, šunka, vejce, kyselá okurka, paprika, majonéza.', '110 g', [1, 3, 9, 10], 40, 'ruske-vejce'),
  chlebicek('pochoutkovy', 'pochoutkový', 'Světlá veka, pochoutkový salát, šunka, lollo salát, paprika.', '85 g', [1, 3, 10], 40, 'pochoutkovy'),
  chlebicek('vysocina', 'vysočina', 'Světlá veka, hořčicová pomazánka, vysočina, kyselá okurka, kapie, lollo salát.', '70 g', [1, 7, 10], 40, 'vysocina'),
  chlebicek('kureci', 'kuřecí', 'Světlá veka, hořčicová pomazánka, lollo salát, paprika, kuřecí prsa, okurka.', '80 g', [1, 7, 10], 40, 'kureci'),
  chlebicek('syrova-variace', 'sýrová variace', 'Tmavá veka, pomazánkové máslo, eidam, uzený sýr, niva, hermelín, paprika, okurka.', '80 g', [1, 6, 7], 43, 'syrova-variace'),
  chlebicek('redkvicka', 'ředkvička', 'Tmavá veka, vajíčkový salát, nastrouhaná ředkvička, lollo salát.', '70 g', [1, 3, 6, 7, 10], 33, 'redkvicka'),
  chlebicek('mozzarella', 'mozzarella', 'Tmavá veka, pomazánkové máslo, lollo salát, rajče, mozzarella, rukola.', '80 g', [1, 6, 7], 40, 'mozzarella'),

  // ---------------- ZÁKUSKY – MINI ----------------
  mini(['trubicka', 'Mini trubička', '80 g', [1, 3, 6, 7, 8]], { variants: variants('Paříž', 'Karamel', 'Bílá') }),
  mini(['venecek-sleh', 'Mini věneček se šlehačkou', '49 g', [1, 3, 7]]),
  mini(['venecek-polevany', 'Mini věneček polévaný', '51 g', [1, 3, 7]]),
  mini(['vetrnik', 'Mini větrník karamel', '80 g', [1, 3, 5, 7]]),
  mini(['puncova-koule', 'Mini punčová koule', '75 g', [1, 3, 5, 7, 8]]),
  mini(['spicka', 'Mini špička', '22 g', [1, 5, 6, 7]], { variants: variants('Bílá', 'Čoko') }),
  mini(['indianek', 'Indiánek', '27 g', [1, 3, 7]], { imageNote: 'Ilustrační foto' }),
  mini(['ovocny-kosicek', 'Mini ovocný košíček', '64 g', [1, 3, 7]]),
  mini(['tiramisu', 'Mini tiramisu', undefined, [1, 3, 7], '']),
  mini(['puncovy-rez', 'Mini punčový řez', '72 g', [1, 3, 8]]),
  mini(['misa-rez', 'Mini míša řez', '110 g', [1, 3, 6, 7]]),
  mini(['boruvka-rez', 'Mini borůvka řez', '110 g', undefined]),

  // ---------------- ZÁKUSKY – VELKÉ ----------------
  velky(['spicka-likerova', 'Špička s vaječným likérem', '58 g', [1, 3, 6, 7, 8]]),
  velky(['spicka-bila', 'Špička bílá s kakaovo-mandlovým krémem', '58 g', [1, 3, 6, 7, 8]]),
  velky(['indian', 'Indián', '65 g', [1, 3, 6]]),
  velky(['punc-koule', 'Punč koule', undefined, [1, 3, 5, 6, 7, 8]]),
  velky(['tiramisu', 'Tiramisu', '120 g', [1, 3, 7]]),
  velky(['ovocna-kostka', 'Ovocná kostka', undefined, [1, 3, 7, 12]]),
  velky(['trubicky', 'Trubička', '70 g', [1, 3, 6, 7]], { variants: variants('Čoko', 'Karamel', 'Bílá') }),
  velky(['mrkvovy-dort-rez', 'Mrkvový dort (řez)', '120 g', [1, 3, 7, 8, 12]]),
  velky(['kavove-zrno', 'Kávové zrno', '65 g', [6, 7, 8]]),
  velky(['bufler', 'Bufler', undefined, [1, 3, 7, 8, 12], ''], { variants: variants('Čokoládový', 'Ovocný') }),
  velky(['jadrovy-rohlicek', 'Jádrový rohlíček', '65 g', [1, 3, 7, 8]]),
  velky(['muzikal', 'Muzikál', '65 g', [1, 3, 7]]),
  velky(['kremovy-rez', 'Krémový řez', '65 g', [1, 3, 6, 7, 12]]),
  velky(['puncovy-rez', 'Punčový řez', '150 g', [1, 3, 6, 7, 8, 12]]),
  velky(['strecha', 'Střecha', undefined, [1, 3, 6, 7, 8, 12]]),
  velky(['prazska-koule', 'Pražská koule', '65 g', [1, 3, 6, 7, 8]]),
  velky(['puncovy-tunel', 'Punčový tunel', '85 g', [1, 3, 6, 7, 8, 11, 12]]),
  velky(['kremes', 'Kremeš', undefined, [1, 3, 6, 7, 12]]),
  velky(['venecek-srdicko', 'Věneček srdíčko', '290 g', [1, 3, 7]]),
  velky(['venecek-polevany', 'Věneček polévaný', '75 g', [1, 3, 7]]),
  velky(['venecek-sleh', 'Věneček se šlehačkou', '75 g', [1, 3, 7]]),
  velky(['bananek', 'Banánek čoko', '65 g', [1, 3, 6, 7, 12]]),
  velky(['vetrnik', 'Větrník', '252 g', [1, 3, 7]]),
  velky(['vetrnik-maxi', 'Větrník maxi', undefined, [1, 3, 7]]),
  velky(['svezenka', 'Svěženka', undefined, [1, 3, 6, 7, 8, 11, 12], '']),
  velky(['ovocny-kosicek', 'Ovocný košíček', undefined, [1, 3, 7, 8, 12]]),
  velky(['kubansky-rez', 'Kubánský řez', '119 g', [1, 3, 6, 7, 12]]),
  velky(['pariz-malina', 'Paříž malina', '140 g', [1, 3, 6, 7]]),
  velky(['pariz-rez', 'Paříž řez', '65 g', [1, 3, 6, 7]]),
  velky(['pistacie-rez', 'Pistácie řez', '65 g', [1, 3, 6, 7, 8, 12]]),
  velky(['karamel-rez', 'Karamel řez', '85 g', undefined]),
  velky(['misa-malina', 'Míša malina', '135 g', [1, 3, 7]]),
  velky(['misa-rez', 'Míša řez', '110 g', [1, 3, 6, 7]]),
  velky(['boruvka-rez', 'Borůvka řez', '110 g', [1, 3, 7]]),
  velky(['laskonka', 'Laskonka ořechová', '65 g', [1, 3, 6, 7, 8]]),
  velky(['brabrant', 'Brabrant', '50 g', [1, 3, 6, 7, 8]]),

  // ---------------- DORTY A ROLÁDY ----------------
  {
    id: 'dort-na-miru',
    name: 'Dort na míru',
    category: 'dorty',
    description:
      'Kulatý, hranatý i patrový. Vyberete korpus, krém, povrch i zdobení – vše nastavíte v objednávce typu „Dort“.',
    image: 'gallery/dort-ovocny',
    orderable: true,
    step: 1,
    minQty: 1,
    maxQty: 5,
    highlight: true,
  },
  {
    id: 'rolada-polovina',
    name: 'Polovina rolády',
    category: 'dorty',
    group: 'Rolády',
    description:
      'Nakrájíte 6–7 kousků. Korpus: světlý piškot, ořechový, kakaový, kokosový. Krém: pudinkový, pařížský, karamel, kokos, káva, tvaroh. Obsypání: kokos, ořech, čoko. Kombinaci si zvolíte sami (uveďte v poznámce).',
    allergens: [1, 3, 7, 8],
    image: 'products/rolada-polovina',
    orderable: true,
    step: 1,
    minQty: 1,
  },
  {
    id: 'rolada-cela',
    name: 'Roláda celá',
    category: 'dorty',
    group: 'Rolády',
    description: 'Nakrájíte cca 14 kousků. Korpus, krém i obsypání dle vlastní kombinace (uveďte v poznámce).',
    allergens: [1, 3, 7, 8],
    image: 'products/rolada-cela',
    orderable: true,
    step: 1,
    minQty: 1,
  },
  {
    id: 'rolada-mini',
    name: 'Roláda celá mini',
    category: 'dorty',
    group: 'Rolády',
    description: 'Užší provedení celé rolády, nakrájíte cca 14 kousků.',
    allergens: [1, 3, 7, 8],
    image: 'products/rolada-mini',
    imageNote: 'Ilustrační foto, originál je užší',
    orderable: true,
    step: 1,
    minQty: 1,
  },
  {
    id: 'dort-harlekyn',
    name: 'Harlekýn',
    category: 'dorty',
    description: 'Kombinace pařížské a bílé šlehačky. Velikost dortu dle přání.',
    allergens: [1, 3, 6, 7, 8],
    orderable: true,
    step: 1,
    minQty: 1,
  },
  {
    id: 'dort-mrkvovy',
    name: 'Mrkvový dort',
    category: 'dorty',
    description: 'Mrkvový korpus, krém žervé, marcipánová ozdoba; holé obmazání nebo obsypání v ořechu či v mandlích.',
    allergens: [1, 3, 7, 8, 12],
    image: 'gallery/dort-mrkvovy',
    orderable: true,
    step: 1,
    minQty: 1,
  },

  // ---------------- SLADKÉ PEČIVO ----------------
  sweet('mrkvanek', 'Mrkvánek', '50 g', [1, 8], { variants: variants('Povidlový', 'Višňový', 'Hruškový') }),
  sweet('musli', 'Musli', undefined, [1, 3, 6, 8], { description: 'Z ovesných vloček, kandované ovoce.', image: undefined }),
  sweet('hreben', 'Hřeben', '130 g', [1, 3, 7, 8], { variants: variants('Ořechový', 'Makový') }),
  sweet('zavin', 'Závin', '700 g', [1, 3, 7, 8], { variants: variants('Tvaroh', 'Mák', 'Ořech', 'Hruška', 'Jablko') }),
  sweet('frgal', 'Frgál', undefined, undefined, {
    description:
      'Malý i velký. Stejné těsto a náplně jako u koláčů. Cena se odvíjí od hmotnosti. Kombinace např. makovo-višňová nebo „čtyři chutě“.',
    variants: variants('Tvarohový', 'Makový', 'Ořechový', 'Jablečný', 'Hruškový', 'Višňový', 'Borůvkový (v sezóně)', 'Kombinace (uveďte v poznámce)'),
  }),
  sweet('vanocka', 'Vánočka', undefined, [1, 3, 7, 8], {
    variants: [
      { id: 'mala', label: 'Malá', weight: '450 g' },
      { id: 'velka', label: 'Velká', weight: '850 g' },
    ],
  }),
  sweet('babovka', 'Bábovka', undefined, undefined, { variants: variants('Mrkvová', 'Jablečná', 'Mramorová', 'Maková', 'Tvarohová') }),
  sweet('biskupsky-chlebicek', 'Biskupský chlebíček', '350 g', [1, 3, 7, 11], { description: 'S kandovaným ovocem.' }),
  sweet('citronova-babeta', 'Citrónová babeta', undefined, [1, 3], { description: 'S citrónovou polevou.' }),
  sweet('makovec', 'Makovec', '420 g', [1, 3, 7, 11], { description: 'S citrónovou polevou.' }),
  sweet('linecke-trene', 'Linecké třené', '140 g', [1, 3]),
  sweet('vdolek', 'Vdolek', '66 g', [1, 3, 7]),
  sweet('linecke-velke', 'Velké linecké', undefined, [1, 3], { image: undefined }),
  sweet('linecke-male', 'Malé linecké', undefined, [1, 3, 7], { image: undefined }),
  sweet('orechovy-rohlicek', 'Ořechový rohlíček', undefined, [1, 3, 7, 8]),
  sweet('kremrole', 'Kremrole', undefined, [1, 3, 8], { description: 'Se sněhem z bílků.' }),
  sweet('koblihy', 'Kobliha', '140 g', [1, 3, 7, 8], {
    variants: variants('Pistácie', 'Čoko-lískový oříšek', 'Bílá čokoláda', 'Borůvka', 'Meruňka'),
    highlight: true,
  }),
  sweet('pistaciovy-kolac', 'Pistáciový koláč', '140 g', [1, 3, 7, 8]),
  sweet('kolac-tvaroh-jahoda', 'Koláč tvaroh – jahoda – rebarbora', '140 g', [1, 3, 7]),
  sweet('pusinky', 'Pusinky', '50 g', [1]),
  sweet('perniky', 'Perníky', '100 g', [1, 3], { image: undefined }),
  sweet('piskoty', 'Piškoty', '100 g', [1, 3]),

  // ---------------- SLANÉ PEČIVO ----------------
  salty('bulka', 'Bulka s nivou a andělskou slaninou', '200 g', [1, 3, 7, 11]),
  salty('zapekana-klobasa', 'Zapékaná klobása s mletým masem', '190 g', [1, 3, 7, 8, 11]),
  salty('zapekany-parek', 'Zapékaný párek s napoleonskou omáčkou', '68 g', [1, 3, 6, 7, 9, 11]),
  salty('pizza-kapsa', 'Pizza kapsa', undefined, [1, 3, 6, 7, 10, 11], { description: 'S domácí pizza směsí.' }),
  salty('pagace', 'Pagáče se sádlem a škvarkami', '59 g', [1, 3, 7]),
  salty('preclik', 'Preclíky s uzeným a špekem', undefined, [1, 3, 7], { image: undefined }),
  salty('pagacky', 'Pagáčky se sádlem a škvarkami', '200 g', [1, 3, 7]),
  salty('focaccia', 'Focaccia', '200 g', [1], { variants: variants('Rajče, olivy, rozmarýn', 'Česnek, rozmarýn, olivy') }),
  salty('twister', 'Twister špenátový', undefined, [1, 3, 7], { image: undefined }),
  salty('chleb-kvaskovy', 'Chléb kváskový', undefined, [1], {
    variants: [
      { id: 'maly', label: 'Malý', weight: '530 g' },
      { id: 'velky', label: 'Velký', weight: '830 g' },
    ],
  }),
  salty('skvarkova-pomazanka', 'Škvarková pomazánka', undefined, [], {
    variants: [
      { id: 'mala', label: 'Malá', weight: '150 g' },
      { id: 'velka', label: 'Velká', weight: '250 g' },
    ],
  }),

  // ---------------- CUKROVÍ ----------------
  {
    id: 'cukrovi-kremove',
    name: 'Cukroví klasické krémové',
    category: 'cukrovi',
    group: 'Během roku (jen s koláči)',
    description: 'Na svatební stoly, oslavy či trachty. Počet druhů se odvíjí od množství objednávek na daný termín.',
    price: { amount: 950, unit: 'kg', note: '+ krabička' },
    image: 'products/cukrovi-mix',
    orderable: true,
    rule: 'cukrovi-celorocni',
    step: 0.5,
    minQty: 0.5,
  },
  {
    id: 'cukrovi-marmeladove',
    name: 'Cukroví marmeládové',
    category: 'cukrovi',
    group: 'Během roku (jen s koláči)',
    description:
      'Dobře drží tvar a zvládne převoz – ideální do výslužek. Krabička se neplatí, když dáváme cukroví rovnou do výslužek.',
    price: { amount: 800, unit: 'kg', note: '+ krabička' },
    image: 'products/cukrovi-marmeladove',
    orderable: true,
    rule: 'cukrovi-celorocni',
    step: 0.5,
    minQty: 0.5,
  },
  {
    id: 'vanocni-cukrovi-mix',
    name: 'Vánoční cukroví – mix',
    category: 'cukrovi',
    group: 'Vánoce 2026',
    description: '22 druhů marmeládového i krémového cukroví, cca 80 ks v 1 kg.',
    price: { amount: 1050, unit: 'kg', note: '+ krabička' },
    variants: vanocniBaleni(),
    image: 'products/cukrovi-mix',
    orderable: true,
    rule: 'cukrovi-vanocni',
    step: 1,
    minQty: 1,
    highlight: true,
  },
  {
    id: 'vanocni-cukrovi-marmeladove',
    name: 'Vánoční cukroví – marmeládové',
    category: 'cukrovi',
    group: 'Vánoce 2026',
    description:
      '7 druhů (ořechové třené, musli, světlé třené, tmavé třené, oválky, zvonečky, květinky), 3 druhy marmelády, cca 80 ks v 1 kg.',
    price: { amount: 900, unit: 'kg', note: '+ krabička' },
    variants: vanocniBaleni(),
    image: 'products/cukrovi-marmeladove',
    orderable: true,
    rule: 'cukrovi-vanocni',
    step: 1,
    minQty: 1,
  },
  {
    id: 'vanocni-darkova-krabicka',
    name: 'Dárková krabička cukroví',
    category: 'cukrovi',
    group: 'Vánoce 2026',
    description:
      '10 druhů krémového i marmeládového cukroví, 200 g. Možnost vložení vizitky, samolepka loga vaší firmy – ideální firemní dárek.',
    price: { amount: 260, unit: 'ks', note: 'cena včetně obalového materiálu' },
    weight: '200 g',
    image: 'products/cukrovi-darkova-krabicka',
    orderable: true,
    rule: 'cukrovi-vanocni',
    step: 1,
    minQty: 1,
  },

  // ---------------- OZDOBY NA DORT ----------------
  ...[1, 2, 3, 4, 5, 6, 7].map(
    (n): Product => ({
      id: `ozdoby-sada-${n}`,
      name: `Malované figurky – sada č. ${n}`,
      category: 'ozdoby',
      description:
        n === 4
          ? 'Zvířátka: žirafa, slůně, tygřík.'
          : n === 5
            ? 'Bagr, traktor, autíčko.'
            : n === 6
              ? 'Sada dvou figurek. Motiv vám ukážeme v cukrárně.'
              : 'Sada figurek s dětským motivem. Motiv vám ukážeme v cukrárně.',
      price: { amount: n === 6 ? 105 : n === 7 ? 205 : 155, unit: 'sada' },
      image: n === 4 || n === 5 ? `products/ozdoby-sada-${n}` : undefined,
      imageNote: n === 4 || n === 5 ? undefined : 'Foto motivu na vyžádání',
      orderable: true,
      rule: 'ozdoba',
      step: 1,
      minQty: 1,
    }),
  ),

  // ---------------- VELIKONOCE (mimo sezónu) ----------------
  easter('velikonocni-venec', 'Velikonoční věnec', 'Tvarohový, makový, ořechový, hruškový, jablečný. Jarní stuha.', '650 g', [1, 3, 7, 8]),
  easter('mazanec', 'Mazanec', 'Tradiční mazanec z kynutého těsta, posypaný mandlemi. Malý 400 g, velký 600 g.', undefined, [1, 3, 7, 8]),
  easter('beranek-pernikovy', 'Beránek z perníkového těsta', 'Polévaný čokoládovou polevou, zdobení ze želatiny a cukru. Malý i velký.', undefined, [1, 3, 6, 7, 13]),
  easter('beranek-slehany', 'Beránek ze šlehaného těsta', 'Nadýchané těsto se šlehačkou, osypaný cukrem nebo polévaný čokoládou.', undefined, [1, 3, 7]),
  easter('linecky-balicek', 'Linecký balíček', 'Linecký korpus plněný marmeládou, košíček z mandlí, čoko polevy a marcipánových vajíček.', '210 g', [1, 3, 8]),
];

function vanocniBaleni(): Variant[] {
  return [0.5, 1, 1.5, 2, 2.5, 3].map((kg) => ({
    id: `${kg}kg`,
    label: `${String(kg).replace('.', ',')} kg`,
    kg,
  }));
}

function sweet(id: string, name: string, weight: string | undefined, allergens: number[] | undefined, extra: Partial<Product> = {}): Product {
  return {
    id,
    name,
    category: 'sladke-pecivo',
    weight,
    allergens,
    image: `products/${id}`,
    orderable: true,
    step: 1,
    minQty: 1,
    ...extra,
  };
}

function salty(id: string, name: string, weight: string | undefined, allergens: number[] | undefined, extra: Partial<Product> = {}): Product {
  return { ...sweet(id, name, weight, allergens, extra), category: 'slane-pecivo' };
}

function easter(id: string, name: string, description: string, weight: string | undefined, allergens: number[]): Product {
  return {
    id,
    name,
    category: 'velikonoce',
    description,
    weight,
    allergens,
    image: `products/${id}`,
    orderable: false,
    notOrderableReason: 'Sezónní nabídka – objednávky jen v období Velikonoc.',
  };
}

export const productById = new Map(products.map((p) => [p.id, p]));

export function getProduct(id: string): Product | undefined {
  return productById.get(id);
}

export function productsInCategory(id: CategoryId): Product[] {
  return products.filter((p) => p.category === id);
}

/** Koláče, ze kterých lze skládat výslužky. */
export const kolaceForFavors = products.filter((p) => p.rule === 'kolac');
