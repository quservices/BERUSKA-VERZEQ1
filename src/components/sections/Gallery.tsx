import { useMemo, useState } from 'react';
import { business } from '../../data/business';
import { galleryCategories, galleryItems, type GalleryCategory } from '../../data/gallery';
import { FacebookIcon } from '../ui/Icons';
import { Lightbox } from '../ui/Lightbox';
import { Photo } from '../ui/Photo';
import { Reveal } from '../ui/Reveal';

export function Gallery() {
  const [filter, setFilter] = useState<GalleryCategory | 'vse'>('vse');
  const [index, setIndex] = useState<number | null>(null);
  const items = useMemo(() => (filter === 'vse' ? galleryItems : galleryItems.filter((g) => g.category === filter)), [filter]);

  return (
    <section id="galerie" aria-labelledby="galerie-title" className="scroll-mt-20 bg-cocoa-900 py-20 text-cream-100 sm:py-28">
      <div className="container-page">
        <Reveal className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow text-raspberry-200">Galerie</p>
            <h2 id="galerie-title" className="section-title mt-3 text-cream-50">
              Z naší výrobny
            </h2>
            <p className="mt-4 text-lg text-cream-300">Dorty, výslužky a sweet bary, které jsme připravili pro naše zákazníky.</p>
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrovat galerii">
            {[{ id: 'vse' as const, name: 'Vše' }, ...galleryCategories].map((c) => (
              <button
                key={c.id}
                type="button"
                aria-pressed={filter === c.id}
                onClick={() => setFilter(c.id)}
                className="chip border-cream-50/20 bg-transparent text-cream-200 hover:border-cream-50/50 aria-pressed:border-cream-50 aria-pressed:bg-cream-50 aria-pressed:text-cocoa-900"
              >
                {c.name}
              </button>
            ))}
          </div>
        </Reveal>

        <ul className="mt-12 columns-2 gap-4 sm:gap-5 md:columns-3 lg:columns-4">
          {items.map((item, i) => (
            <li key={item.image} className="mb-4 break-inside-avoid sm:mb-5">
              <button
                type="button"
                onClick={() => setIndex(i)}
                className="group block w-full overflow-hidden rounded-2xl focus-visible:outline-cream-50"
                aria-label={`Zvětšit fotografii: ${item.alt}`}
              >
                <Photo
                  image={item.image}
                  alt={item.alt}
                  className={item.tall ? 'aspect-[3/4]' : 'aspect-square'}
                  imgClassName="transition duration-700 group-hover:scale-105 group-hover:brightness-105"
                  sizes="(min-width: 1024px) 24vw, (min-width: 768px) 32vw, 48vw"
                />
              </button>
            </li>
          ))}
        </ul>

        <p className="mt-10 flex flex-wrap items-center gap-2 text-cream-300">
          Další realizace pravidelně sdílíme na
          <a href={business.facebook} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-semibold text-cream-50 underline underline-offset-4">
            <FacebookIcon size={18} /> Facebooku
          </a>
        </p>
      </div>
      <Lightbox items={items} index={index} onIndexChange={setIndex} />
    </section>
  );
}
