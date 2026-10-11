import { useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { ALLERGENS } from '../../data/business';
import { categories, productsInCategory, type CategoryId, type Product } from '../../data/products';
import { ChevronIcon, InfoIcon } from '../ui/Icons';
import { Reveal } from '../ui/Reveal';
import { ProductCard } from './ProductCard';

function groupProducts(list: Product[]) {
  const groups = new Map<string, Product[]>();
  for (const p of list) {
    const key = p.group ?? '';
    groups.set(key, [...(groups.get(key) ?? []), p]);
  }
  return [...groups.entries()];
}

export function Offer() {
  const [active, setActive] = useState<CategoryId>('kolace');
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const category = categories.find((c) => c.id === active)!;
  const groups = useMemo(() => groupProducts(productsInCategory(active)), [active]);

  const onKeyDown = (e: KeyboardEvent, index: number) => {
    const delta = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!delta) return;
    e.preventDefault();
    const next = categories[(index + delta + categories.length) % categories.length];
    setActive(next.id);
    tabRefs.current[next.id]?.focus();
  };

  return (
    <section id="nabidka" aria-labelledby="nabidka-title" className="scroll-mt-20 py-20 sm:py-28">
      <div className="container-page">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">Naše nabídka</p>
          <h2 id="nabidka-title" className="section-title mt-3">
            Vyberte si, co vám udělá radost
          </h2>
          <p className="mt-4 text-lg text-cocoa-700">
            Ceny uvádíme tam, kde jsou ověřené v našem ceníku. U ostatních výrobků vám cenu sdělíme při potvrzení objednávky.
          </p>
        </Reveal>

        <div className="-mx-5 mt-10 overflow-x-auto px-5 pb-2 sm:mx-0 sm:px-0">
          <div role="tablist" aria-label="Kategorie výrobků" className="flex w-max gap-2 sm:w-auto sm:flex-wrap">
            {categories.map((c, i) => (
              <button
                key={c.id}
                ref={(el) => {
                  tabRefs.current[c.id] = el;
                }}
                role="tab"
                id={`tab-${c.id}`}
                aria-selected={active === c.id}
                aria-controls="nabidka-panel"
                tabIndex={active === c.id ? 0 : -1}
                onClick={() => setActive(c.id)}
                onKeyDown={(e) => onKeyDown(e, i)}
                className="chip whitespace-nowrap"
              >
                {c.name}
                {c.seasonal && <span className="ml-1.5 text-[0.7rem] font-bold opacity-70">sezónní</span>}
              </button>
            ))}
          </div>
        </div>

        <div id="nabidka-panel" role="tabpanel" aria-labelledby={`tab-${active}`} className="mt-8">
          <p className="max-w-3xl text-lg text-cocoa-700">{category.intro}</p>
          {category.rules && (
            <details className="group card mt-6 p-5 sm:p-6" open={category.id === 'kolace' || category.id === 'cukrovi'}>
              <summary className="flex cursor-pointer list-none items-center gap-2 font-semibold text-cocoa-900">
                <InfoIcon size={18} className="text-raspberry-600" />
                Důležité informace
                <ChevronIcon size={18} className="ml-auto transition group-open:rotate-180" />
              </summary>
              <ul className="mt-4 gap-x-10 text-sm text-cocoa-700 md:columns-2">
                {category.rules.map((r) => (
                  <li key={r} className="mb-2 flex break-inside-avoid gap-2">
                    <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-raspberry-500" />
                    {r}
                  </li>
                ))}
              </ul>
            </details>
          )}

          {groups.map(([group, list]) => (
            <div key={group} className="mt-10">
              {group && <h3 className="mb-5 font-sans text-sm font-bold tracking-[0.15em] text-cocoa-600 uppercase">{group}</h3>}
              <ul className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                {list.map((p) => (
                  <li key={p.id}>
                    <ProductCard product={p} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <details className="mt-14 text-sm text-cocoa-700">
          <summary className="cursor-pointer font-semibold text-cocoa-900">Seznam alergenů (čísla u výrobků)</summary>
          <ul className="mt-3 grid gap-x-8 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(ALLERGENS).map(([n, name]) => (
              <li key={n}>
                <span className="font-semibold tabular-nums">{n}</span> – {name}
              </li>
            ))}
          </ul>
        </details>
      </div>
    </section>
  );
}
