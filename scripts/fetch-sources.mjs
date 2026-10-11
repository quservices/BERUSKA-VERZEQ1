// Stáhne originální grafické ceníky z oficiálního webu do assets-source/.
// Z nich skript crop-images.mjs vyřezává fotografie výrobků.
import { mkdir, writeFile, access } from 'node:fs/promises';
import { join } from 'node:path';

const BASE = 'https://www.cukrarnaberuska.cz/img/picture/';
const SOURCES = [
  '405/kolace_nabidka-vsechny-druhy_webovky-01.jpg',
  '436/zakusky_-2025-01.jpg',
  '437/zakusky_-2025-02.jpg',
  '438/zakusky_-2025-04.jpg',
  '444/zakusky_-2025-05.jpg',
  '440/zakusky_-2025_kreslici-platno-14.jpg',
  '431/zakusky_-2026-03.jpg',
  '460/ostatni-vyrobky_-2025-01.jpg',
  '462/ostatni-vyrobky_-2025-02.jpg',
  '461/ostatni-vyrobky_-2025-03.jpg',
  '446/chlebicky-01.jpg',
  '447/chlebicky-02.jpg',
  '448/chlebicky-03.jpg',
  '449/chlebicky-04.jpg',
  '445/velikonoce-01.jpg',
  '466/kopie-navrhu-kopie-navrhu-pomozte.jpeg',
  '468/kopie-navrhu-kopie-navrhu-pomozte.jpeg',
  '478/cukrovi-2026.jpg',
  '240/marcipanove-srdicka.jpg',
  '290/modelovaci-hmota-01.jpg',
  '471/krabicky.jpg',
];

const outDir = 'assets-source';
await mkdir(outDir, { recursive: true });
const force = process.argv.includes('--force');

for (const path of SOURCES) {
  const name = path.replace('/', '_');
  const target = join(outDir, name);
  if (!force) {
    try { await access(target); console.log('skip', name); continue; } catch {}
  }
  const res = await fetch(BASE + path);
  if (!res.ok) throw new Error(`${res.status} ${BASE + path}`);
  await writeFile(target, Buffer.from(await res.arrayBuffer()));
  console.log('ok  ', name);
}
