import manifest from '../data/imageManifest.json';

interface ManifestEntry {
  w: number;
  h: number;
  sizes: number[];
}

const entries = manifest as Record<string, ManifestEntry>;

export interface ImageInfo {
  src: string;
  srcSet: string;
  width: number;
  height: number;
  /** Největší dostupná varianta – pro zvětšené zobrazení v galerii. */
  large: string;
}

/** Vrátí cesty a rozměry pro výřez z public/img (klíč např. "products/kolac-tvarohovy"). */
export function imageInfo(key: string | undefined): ImageInfo | undefined {
  if (!key) return undefined;
  const entry = entries[key];
  if (!entry) return undefined;
  const base = `${import.meta.env.BASE_URL}img/${key}`;
  const variants = entry.sizes.map((w) => ({ url: `${base}-${w}.webp`, w: Math.min(w, entry.w) }));
  return {
    src: variants[0].url,
    srcSet: variants.map((v) => `${v.url} ${v.w}w`).join(', '),
    width: entry.w,
    height: entry.h,
    large: variants[variants.length - 1].url,
  };
}
