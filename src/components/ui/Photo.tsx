import { imageInfo } from '../../lib/images';
import { Ladybug } from './Icons';

interface PhotoProps {
  image?: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  sizes?: string;
  priority?: boolean;
  note?: string;
  /** Text v prázdném místě, pokud fotka zatím chybí. */
  placeholder?: string;
}

/** Fotografie výrobku s responzivními zdroji; bez fotky zobrazí elegantní místo pro doplnění. */
export function Photo({
  image,
  alt,
  className = '',
  imgClassName = '',
  sizes = '(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 90vw',
  priority = false,
  note,
  placeholder = 'Fotografii připravujeme',
}: PhotoProps) {
  const info = imageInfo(image);
  if (!info) {
    return (
      <div
        className={`paper flex flex-col items-center justify-center gap-2 bg-cream-200 text-center text-sm text-cocoa-500 ${className}`}
        {...(alt ? { role: 'img', 'aria-label': `${alt} – fotografii připravujeme` } : { 'aria-hidden': true })}
      >
        <Ladybug size={34} className="text-raspberry-200" />
        <span className="font-display italic">{placeholder}</span>
      </div>
    );
  }
  return (
    <div className={`relative overflow-hidden bg-cream-200 ${className}`}>
      <img
        src={info.src}
        srcSet={info.srcSet}
        sizes={sizes}
        width={info.width}
        height={info.height}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
        className={`h-full w-full object-cover ${imgClassName}`}
      />
      {note && (
        <span className="absolute bottom-2 left-2 rounded-full bg-white/85 px-2.5 py-0.5 text-[0.7rem] font-semibold text-cocoa-700 backdrop-blur">
          {note}
        </span>
      )}
    </div>
  );
}
