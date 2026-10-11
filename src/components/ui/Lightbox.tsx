import { useEffect, useRef } from 'react';
import { imageInfo } from '../../lib/images';
import { ArrowLeftIcon, ArrowRightIcon, CloseIcon } from './Icons';

export interface LightboxItem {
  image: string;
  alt: string;
}

interface LightboxProps {
  items: LightboxItem[];
  index: number | null;
  onIndexChange: (index: number | null) => void;
}

/** Zvětšené zobrazení fotografie. Nativní <dialog> zajišťuje zachycení fokusu a zavření klávesou Esc. */
export function Lightbox({ items, index, onIndexChange }: LightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const touchX = useRef<number | null>(null);
  const open = index !== null;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal?.();
    if (!open && dialog.open) dialog.close?.();
  }, [open]);

  if (index === null) {
    return <dialog ref={dialogRef} aria-label="Galerie" />;
  }

  const item = items[index];
  const info = imageInfo(item.image);
  const go = (delta: number) => onIndexChange((index + delta + items.length) % items.length);

  return (
    <dialog
      ref={dialogRef}
      aria-label={`Fotografie ${index + 1} z ${items.length}: ${item.alt}`}
      onClose={() => onIndexChange(null)}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') go(1);
        if (e.key === 'ArrowLeft') go(-1);
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onIndexChange(null);
      }}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}
      className="m-auto max-h-none max-w-none bg-transparent p-0 text-cream-50 backdrop:backdrop-blur-sm"
    >
      <div className="flex h-dvh w-screen flex-col items-center justify-center gap-4 p-4 sm:p-10">
        <figure className="flex max-h-full flex-col items-center gap-3">
          {info && (
            <img
              src={info.large}
              alt={item.alt}
              width={info.width}
              height={info.height}
              className="max-h-[78dvh] w-auto max-w-[92vw] rounded-2xl object-contain shadow-2xl"
            />
          )}
          <figcaption className="max-w-xl text-center text-sm text-cream-200">
            {item.alt}
            <span className="ml-2 text-cream-400">
              {index + 1} / {items.length}
            </span>
          </figcaption>
        </figure>
        <div className="flex gap-3">
          <button type="button" onClick={() => go(-1)} className="btn bg-white/10 text-cream-50 hover:bg-white/20" aria-label="Předchozí fotografie">
            <ArrowLeftIcon />
          </button>
          <button type="button" onClick={() => onIndexChange(null)} className="btn bg-white text-cocoa-900 hover:bg-cream-100" autoFocus>
            <CloseIcon /> Zavřít
          </button>
          <button type="button" onClick={() => go(1)} className="btn bg-white/10 text-cream-50 hover:bg-white/20" aria-label="Další fotografie">
            <ArrowRightIcon />
          </button>
        </div>
      </div>
    </dialog>
  );
}
