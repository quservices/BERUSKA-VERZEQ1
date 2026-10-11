# Cukrárna Beruška – nový web (návrh)

Prezentační web a objednávkový konfigurátor pro **Cukrárnu Beruška** (Náměstí 44, Paskov). Veškerý obsah vychází z oficiálního webu
[cukrarnaberuska.cz](https://www.cukrarnaberuska.cz/). Údaje, které se na webu rozcházejí, jsou sepsané v [docs/verified-data.md](docs/verified-data.md).

> **Stav: návrh / ukázkový režim.** Objednávku lze na webu celou sestavit a „odeslat“, ale **nic se nikam neposílá ani neukládá**.
> Web to zákazníkovi jasně oznámí a nezobrazí falešné potvrzení. Napojení na skutečný backend je připravené (viz níže).

## Technologie

- Vite 8 + React 19 + TypeScript 7
- Tailwind CSS 4 (design tokeny v [src/index.css](src/index.css))
- React Router 8 (stránky `/`, `/objednavka`, `/ochrana-osobnich-udaju`, `/cookies`)
- Zod 4 – validace objednávky (schémata jsou připravená i pro serverovou validaci)
- Vitest + Testing Library – testy objednávkového procesu
- sharp – výřezy fotografií z oficiálních ceníků, OG obrázek
- Písma Fraunces a Manrope hostovaná lokálně (`@fontsource-variable`), bez požadavků na Google Fonts

## Spuštění

Požadavky: Node.js 22+ (vyvíjeno na Node 24).

```bash
npm install
npm run dev        # vývojový server na http://localhost:5173
npm test           # testy (Vitest)
npm run typecheck  # kontrola typů
npm run build      # produkční build do dist/
npm run preview    # náhled produkčního buildu
```

## Struktura

```
src/
  data/                 # VŠECHNY údaje o firmě a nabídce – zde se upravuje obsah
    business.ts         # kontakty, adresy, otevírací doba, svátky, provozovatel
    products.ts         # kategorie a výrobky (cena jen tam, kde ji web uvádí)
    orderRules.ts       # pravidla objednávek: zálohy, slevy, předstih, krabičky, výslužky
    gallery.ts          # fotografie v galerii
    imageManifest.json  # rozměry fotek (generuje `npm run crop`)
  components/
    layout/             # hlavička, patička, mobilní lišta, logo
    sections/           # sekce úvodní stránky (Hero, Nabídka, Svatby, O nás, Galerie, Jak objednat, Kontakty)
    ui/                 # sdílené prvky: Photo, Lightbox, QuantityStepper, formulářová pole…
  order/                # objednávkový systém, oddělený od prezentace
    types.ts            # stav objednávky
    store.tsx           # React context + uložení rozpracované objednávky do localStorage
    pricing.ts          # výpočet cen (jen ověřené ceny), sleva, zálohy
    pickup.ts           # otevírací doba → povolené dny a časy, minimální předstih
    validation.ts       # validace kroků (česká hlášení), anti-spam
    payload.ts          # datový model odesílané objednávky (Zod) – sdílitelný se serverem
    submit.ts           # odesílání: demo režim / HTTP API
    steps/              # jednotlivé kroky konfigurátoru
    OrderWizard.tsx     # průvodce objednávkou
  pages/
scripts/
  fetch-sources.mjs     # stáhne originální ceníky z oficiálního webu do assets-source/
  crops.mjs             # souřadnice výřezů fotografií
  crop-images.mjs       # vyřeže fotky do public/img/ (WebP 480/960 px) + logo
  og-image.mjs          # Open Graph obrázek public/og-image.jpg
```

## Úprava obsahu

- **Kontakty, otevírací doba, svátky:** [src/data/business.ts](src/data/business.ts). Otevírací doba se automaticky promítne do sekce Kontakty,
  patičky i nabídky časů vyzvednutí. Strukturovaná data (JSON-LD) a meta tagy jsou v [index.html](index.html) – při změně je upravte také.
- **Výrobky a ceny:** [src/data/products.ts](src/data/products.ts). Cenu uvádějte jen ověřenou; bez `price` se zobrazí „Cena na dotaz“
  a celková cena objednávky se označí jako orientační. Sezónní výrobky mají `orderable: false`.
- **Pravidla objednávek:** [src/data/orderRules.ts](src/data/orderRules.ts) – např. termín uzávěrky vánočního cukroví.

## Fotografie

Oficiální web nemá samostatné fotky výrobků – jen grafické ceníky (koláže). Fotky jsou z nich vyřezané skriptem:

```bash
npm run fetch-sources   # stáhne ceníky (assets-source/ není v gitu)
npm run crop            # vyřeže fotky do public/img/ a aktualizuje src/data/imageManifest.json
npm run og              # přegeneruje OG obrázek
```

Galerie (dorty, svatby) má zdroje jen v malém rozlišení (~250–480 px). **Doporučení: vyžádat si od cukrárny originální fotografie** a nahradit
výřezy. Výrobky bez fotky zobrazují elegantní místo „Fotografii připravujeme“. Fotky s licencovanými postavičkami (ozdoby na dort) a se
jmény zákazníků jsou záměrně vynechány.

## Objednávky: ukázkový režim a napojení backendu

Odesílání řeší [src/order/submit.ts](src/order/submit.ts):

| `VITE_ORDER_API_URL` | Chování |
| --- | --- |
| prázdná (výchozí) | **Ukázkový režim** – nic se neodesílá, zákazník vidí „Objednávka nebyla nikam odeslána“ a telefonní kontakt. |
| URL API | `POST` JSON dle [docs/order-model.md](docs/order-model.md). Úspěch jen při odpovědi 2xx s `{ "reference": "…" }`, jinak chyba. |

Proměnné prostředí viz [.env.example](.env.example). Jsou veřejné (prefix `VITE_`) – **nikdy do nich nedávejte tajné klíče**.

### Plán dalšího kroku (vlastní Node server)

Rozhodnuto: vlastní Node server. Doporučený rozsah:

1. `server/` – Fastify nebo Express, endpoint `POST /api/orders`.
2. Serverová validace přes stejné `orderPayloadSchema` z [src/order/payload.ts](src/order/payload.ts) + znovu ověřit pravidla
   (`validateOrder`), honeypot a `fillTimeMs`, rate-limit podle IP.
3. Databáze (SQLite pro začátek, později PostgreSQL) – tabulky `orders`, `order_items`, `order_status_history`, `admin_users`.
4. E-mailové oznámení cukrárně (SMTP / transakční služba), klíče jen v proměnných prostředí serveru.
5. Administrace `/admin` s přihlášením (hash hesel, HTTP-only session cookie, CSRF ochrana): seznam objednávek, detail, změna stavu
   (nová → rozpracovaná → potvrzená → dokončená / zrušená), interní poznámka, export CSV.

## Nasazení

Výstup `npm run build` je statický web v `dist/`. Jde o SPA, hosting musí přesměrovat neznámé cesty na `index.html`
(pro Netlify je připraven `public/_redirects`; u Apache použijte `FallbackResource /index.html`).

Před spuštěním:

- [ ] Potvrdit s cukrárnou údaje v [docs/verified-data.md](docs/verified-data.md) (sekce „K ověření“).
- [ ] Doplnit zásady ochrany osobních údajů (dobu uchování, poskytovatele hostingu) – text je označen jako návrh.
- [ ] Vyžádat originální fotografie a logo ve vektoru.
- [ ] Zkontrolovat doménu v `index.html`, `public/sitemap.xml` a `public/robots.txt`.
- [ ] Dokud neběží backend, ponechat ukázkový režim a telefonické objednávky.
