# Datový model objednávky

Zdroj pravdy je Zod schéma `orderPayloadSchema` v [src/order/payload.ts](../src/order/payload.ts). Klient jej používá před odesláním,
budoucí server jej má použít znovu a navíc zopakovat business pravidla (`validateOrder` v [src/order/validation.ts](../src/order/validation.ts)).

## Payload `POST /api/orders` (verze 1)

```jsonc
{
  "version": 1,
  "createdAt": "2026-10-11T19:30:00.000Z",
  "type": "bezna",                 // bezna | dort | oslava | svatba | vysluzky | firemni | jina
  "typeName": "Běžná objednávka",
  "items": [
    { "productId": "kolac-tvarohovy", "name": "Tvarohový koláč", "qty": 30, "unit": "ks", "unitPrice": 27, "total": 810 },
    { "productId": "tiramisu", "name": "Tiramisu", "qty": 6, "unit": "ks" }          // bez ceny = na dotaz
  ],
  "cake": { "persons": "12", "shape": "Kulatý", "sponge": "Světlý", "cream": "Pudinkový", "decorations": ["Čerstvé ovoce"], "ediblePaper": false },
  "favors": [
    {
      "count": 10, "perPack": 8,
      "composition": [{ "productId": "kolac-tvarohovy", "name": "Tvarohový koláč", "qty": 4 }],
      "packaging": "celofan", "ribbon": "Zlatá", "marzipanHeart": "Srdíčko č. 2 zlaté",
      "gingerHeartText": "K ♥ M", "cookies": 6, "frgal": false
    }
  ],
  "details": { "datumSvatby": "2027-06-12", "specialniPozadavky": "…" },
  "pickup": { "place": "paskov", "date": "2026-10-13", "time": "08:00" },
  "customer": { "name": "Jana Nováková", "phone": "775 982 575", "email": "jana@seznam.cz", "note": "" },
  "consent": true,
  "pricing": { "knownTotal": 810, "discount": 0, "complete": false, "notes": ["…"] },
  "antiSpam": { "website": "", "fillTimeMs": 84000 }
}
```

Odpověď serveru: `201 { "reference": "BER-2026-0001" }`. Jakákoli jiná odpověď = chyba, klient zobrazí hlášení a objednávku nepovažuje za přijatou.

## Návrh databáze (pro Node server)

```sql
CREATE TABLE orders (
  id            INTEGER PRIMARY KEY,
  reference     TEXT UNIQUE NOT NULL,
  created_at    TEXT NOT NULL,
  type          TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'nova',  -- nova | rozpracovana | potvrzena | dokoncena | zrusena
  pickup_place  TEXT NOT NULL,
  pickup_date   TEXT NOT NULL,
  pickup_time   TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_note TEXT,
  payload_json  TEXT NOT NULL,                 -- celý validovaný payload (dort, výslužky, detaily)
  known_total   INTEGER NOT NULL,
  internal_note TEXT
);

CREATE TABLE order_items (
  order_id   INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  name       TEXT NOT NULL,
  variant    TEXT,
  qty        REAL NOT NULL,
  unit       TEXT NOT NULL,
  unit_price INTEGER
);

CREATE TABLE order_status_history (
  order_id   INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status     TEXT NOT NULL,
  changed_at TEXT NOT NULL,
  changed_by INTEGER REFERENCES admin_users(id)
);

CREATE TABLE admin_users (
  id            INTEGER PRIMARY KEY,
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,               -- argon2id / bcrypt
  role          TEXT NOT NULL DEFAULT 'staff'
);
```

Ceny a pravidla nikdy nepřebírat slepě z klienta – server je má přepočítat ze svých dat (`products.ts` / databáze).
