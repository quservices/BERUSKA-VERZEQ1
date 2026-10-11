// Vygeneruje public/og-image.jpg (1200 × 630) z vyřezaných fotografií a loga.
// Spouští se po `npm run crop`: node scripts/og-image.mjs
import sharp from 'sharp';

const W = 1200;
const H = 630;

const photo = (file, w, h) =>
  sharp(`public/img/${file}`)
    .resize(w, h, { fit: 'cover' })
    .composite([
      {
        input: Buffer.from(`<svg width="${w}" height="${h}"><rect width="${w}" height="${h}" rx="36" ry="36"/></svg>`),
        blend: 'dest-in',
      },
    ])
    .png()
    .toBuffer();

const logo = await sharp('public/img/logo-beruska.png').resize({ width: 300 }).toBuffer();

const text = Buffer.from(`
<svg width="600" height="330" xmlns="http://www.w3.org/2000/svg">
  <style>
    .t { font-family: Georgia, 'Times New Roman', serif; fill: #2e1b12; }
    .s { font-family: 'Segoe UI', Arial, sans-serif; fill: #6f4c37; }
  </style>
  <text x="0" y="70" class="t" font-size="68">Poctivě plněné.</text>
  <text x="0" y="150" class="t" font-size="68" font-style="italic" fill="#a8325a" style="fill:#a8325a">Ručně dělané.</text>
  <text x="0" y="225" class="s" font-size="28">Koláče, dorty a výslužky od roku 1997</text>
  <text x="0" y="270" class="s" font-size="28">Náměstí 44, Paskov · 775 982 575</text>
</svg>`);

await sharp({ create: { width: W, height: H, channels: 3, background: '#fbf6ee' } })
  .composite([
    { input: logo, left: 70, top: 60 },
    { input: text, left: 70, top: 230 },
    { input: await photo('gallery/dort-fiky-patrovy-480.webp', 300, 470), left: 700, top: 80 },
    { input: await photo('products/kolac-orechovy-480.webp', 150, 225), left: 1020, top: 80 },
    { input: await photo('products/koblihy-480.webp', 150, 225), left: 1020, top: 325 },
  ])
  .jpeg({ quality: 84 })
  .toFile('public/og-image.jpg');

console.log('public/og-image.jpg');
