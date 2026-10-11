/**
 * Galerie – fotografie z oficiálního webu (koláže „Svatby“ a „Dorty“), vyřezané skriptem.
 * Fotky s licencovanými postavičkami a se jmény zákazníků záměrně vynecháváme.
 */

export type GalleryCategory = 'dorty' | 'svatby' | 'sweetbar' | 'kolace';

export const galleryCategories: Array<{ id: GalleryCategory; name: string }> = [
  { id: 'dorty', name: 'Dorty' },
  { id: 'svatby', name: 'Svatby a výslužky' },
  { id: 'sweetbar', name: 'Sweet bar a zákusky' },
  { id: 'kolace', name: 'Koláče a pečivo' },
];

export interface GalleryItem {
  image: string;
  alt: string;
  category: GalleryCategory;
  /** Zabírá v mřížce dvojnásobnou výšku. */
  tall?: boolean;
}

export const galleryItems: GalleryItem[] = [
  { image: 'gallery/dort-fiky-patrovy', alt: 'Patrový svatební dort zdobený fíky, jahodami a borůvkami', category: 'svatby', tall: true },
  { image: 'gallery/dort-srdce-malina', alt: 'Dort ve tvaru srdce s malinovou želé vrstvou', category: 'dorty' },
  { image: 'gallery/vysluzka-celofan', alt: 'Celofánová svatební výslužka s koláči a jmenovkou', category: 'svatby' },
  { image: 'gallery/dort-macesky', alt: 'Pistáciový dort zdobený jedlými maceškami', category: 'dorty' },
  { image: 'gallery/sweetbar-stul', alt: 'Sweet bar s mini zákusky na svatební hostině', category: 'sweetbar', tall: true },
  { image: 'gallery/dort-jednorozec', alt: 'Růžový dětský dort jednorožec', category: 'dorty' },
  { image: 'gallery/kolacky-pivonky', alt: 'Koláčky na prkénku vedle kytice pivoněk', category: 'kolace' },
  { image: 'gallery/dort-ruze-patrovy', alt: 'Patrový svatební dort s bílými růžemi', category: 'svatby', tall: true },
  { image: 'gallery/dort-cokoladovy-drip', alt: 'Čokoládový dort s polevou stékající po okrajích', category: 'dorty' },
  { image: 'gallery/eclairy', alt: 'Éclairy zdobené malinami a borůvkovým krémem', category: 'sweetbar' },
  { image: 'gallery/vysluzka-srdicko', alt: 'Výslužka v krabičce s perníkovým srdíčkem s iniciálami', category: 'svatby' },
  { image: 'gallery/dort-kiwi', alt: 'Dort s kiwi krémem a karamelovými ozdobami', category: 'dorty' },
  { image: 'gallery/kolace-boruvka', alt: 'Koláče s borůvkovou a makovou náplní a drobenkou', category: 'kolace' },
  { image: 'gallery/dort-jahodovy', alt: 'Krájený dort s růžovým krémem a jahodami', category: 'dorty' },
  { image: 'gallery/svatebni-dort-srdce', alt: 'Bílý svatební dort ve tvaru srdce s cukrovými růžemi a prstýnky', category: 'svatby' },
  { image: 'gallery/sweetbar-zakusky', alt: 'Řezy a zákusky připravené pro sweet bar', category: 'sweetbar', tall: true },
  { image: 'gallery/dort-auticko', alt: 'Dětský dort ve tvaru modrého autíčka s beruškou', category: 'dorty' },
  { image: 'gallery/dezerty-pohary', alt: 'Dezerty v pohárcích zdobené jahodami a jedlými květy', category: 'sweetbar' },
  { image: 'gallery/vysluzka-okenko', alt: 'Výslužka v bílé krabičce s okénkem a růžovou stuhou', category: 'svatby' },
  { image: 'gallery/dort-karamelovy', alt: 'Karamelový dort s karamelizovanými ozdobami', category: 'dorty' },
  { image: 'gallery/sweetbar-kolace', alt: 'Plněné koláče posypané cukrem na černém tácu', category: 'kolace' },
  { image: 'gallery/dort-ovocny', alt: 'Dort se šlehačkovým zdobením a čerstvým ovocem', category: 'dorty' },
  { image: 'gallery/dort-cislo-60', alt: 'Narozeninový dort ve tvaru čísla 60', category: 'dorty' },
  { image: 'gallery/vysluzka-krabicka', alt: 'Bílá krabička na výslužku s ozdobnou jmenovkou', category: 'svatby' },
  { image: 'gallery/dort-srdce-ovoce', alt: 'Dva dortíky ve tvaru srdce s ovocem', category: 'dorty' },
  { image: 'gallery/dort-cokoladovy', alt: 'Čokoládový dort s banánovými lupínky', category: 'dorty' },
];
