// Vyřeže fotografie výrobků z oficiálních ceníků (assets-source/) do public/img/.
// Výstup: <název>-480.webp a <název>-960.webp (pokud to rozlišení zdroje dovolí)
// + src/data/imageManifest.json s rozměry (pro width/height a poměr stran).
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { CROPS, LOGO } from './crops.mjs';

const SRC = 'assets-source';
const OUT = 'public/img';
const manifest = {};

for (const group of CROPS) {
  const input = join(SRC, group.src);
  const meta = await sharp(input).metadata();
  await mkdir(join(OUT, group.dir), { recursive: true });
  for (const [name, x1, y1, x2, y2] of group.items) {
    const s = group.scale;
    const i = group.inset;
    const left = Math.max(0, Math.round((x1 + i) * s));
    const top = Math.max(0, Math.round((y1 + i) * s));
    const width = Math.min(meta.width - left, Math.round((x2 - x1 - 2 * i) * s));
    const height = Math.min(meta.height - top, Math.round((y2 - y1 - 2 * i) * s));
    const base = sharp(input).extract({ left, top, width, height });
    const sizes = width >= 860 ? [480, 960] : [480];
    for (const w of sizes) {
      await base
        .clone()
        .resize({ width: Math.min(w, width) })
        .webp({ quality: 80 })
        .toFile(join(OUT, group.dir, `${name}-${w}.webp`));
    }
    manifest[`${group.dir}/${name}`] = { w: width, h: height, sizes };
    console.log(`${group.dir}/${name}  ${width}x${height}  [${sizes.join(',')}]`);
  }
}

// Logo: z jasu vytvoříme alfa kanál a obarvíme čokoládovou barvou.
{
  const [x1, y1, x2, y2] = LOGO.box;
  const { data, info } = await sharp(join(SRC, LOGO.src))
    .extract({ left: x1, top: y1, width: x2 - x1, height: y2 - y1 })
    .greyscale()
    .negate()
    .linear(1.6, -40)
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const rgba = Buffer.alloc(width * height * 4);
  for (let p = 0; p < width * height; p++) {
    rgba[p * 4] = 0x3b;
    rgba[p * 4 + 1] = 0x24;
    rgba[p * 4 + 2] = 0x18;
    rgba[p * 4 + 3] = data[p * info.channels];
  }
  await sharp(rgba, { raw: { width, height, channels: 4 } }).png().toFile(join(OUT, 'logo-beruska.png'));
  console.log('logo', width, height);
}

await writeFile('src/data/imageManifest.json', JSON.stringify(manifest, null, 2) + '\n');
