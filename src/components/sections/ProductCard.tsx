import { useEffect, useId, useState } from 'react';
import { Link } from 'react-router';
import { ALLERGENS } from '../../data/business';
import type { Product } from '../../data/products';
import { formatCzk } from '../../lib/format';
import { useOrder } from '../../order/store';
import { CheckIcon, PlusIcon } from '../ui/Icons';
import { Photo } from '../ui/Photo';

export function PriceTag({ product, className = '' }: { product: Product; className?: string }) {
  if (!product.price) {
    return <span className={`text-sm font-semibold text-cocoa-600 italic ${className}`}>Cena na dotaz</span>;
  }
  const unit = { ks: 'ks', kg: 'kg', sada: 'sada', balení: 'balení' }[product.price.unit];
  return (
    <span className={`whitespace-nowrap ${className}`}>
      <span className="font-display text-xl font-semibold text-cocoa-900">{formatCzk(product.price.amount)}</span>
      <span className="text-sm text-cocoa-600"> / {unit}</span>
      {product.price.note && <span className="block text-xs text-cocoa-500">{product.price.note}</span>}
    </span>
  );
}

export function Allergens({ list }: { list?: number[] }) {
  if (!list || list.length === 0) return null;
  return (
    <p className="text-xs text-cocoa-600">
      <span className="font-semibold">Alergeny:</span>{' '}
      {list.map((n, i) => (
        <span key={n}>
          <abbr title={ALLERGENS[n]} className="no-underline">
            {n}
          </abbr>
          {i < list.length - 1 ? ', ' : ''}
        </span>
      ))}
    </p>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const { add } = useOrder();
  const uid = useId();
  const [variant, setVariant] = useState(product.variants?.[0]?.id ?? '');
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 2600);
    return () => clearTimeout(t);
  }, [added]);

  const selectedVariant = product.variants?.find((v) => v.id === variant);
  const weight = selectedVariant?.weight ?? product.weight;

  return (
    <article className="group card flex h-full flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-(--shadow-lift)">
      <Photo
        image={product.image}
        alt={product.name}
        note={product.imageNote}
        className="aspect-[4/3]"
        imgClassName="transition duration-700 group-hover:scale-[1.04]"
      />
      <div className="flex flex-1 flex-col gap-2 p-3.5 sm:gap-3 sm:p-5">
        <div className="flex flex-col-reverse items-start gap-1.5 sm:flex-row sm:justify-between sm:gap-3">
          <h3 className="text-[1.05rem] leading-snug font-medium sm:text-xl">{product.name}</h3>
          {weight && <span className="shrink-0 rounded-full sm:mt-1 bg-cream-200 px-2.5 py-0.5 text-xs font-semibold text-cocoa-700">{weight}</span>}
        </div>
        {product.description && <p className="line-clamp-3 text-sm leading-relaxed text-cocoa-700 sm:line-clamp-none sm:text-[0.92rem]">{product.description}</p>}
        <Allergens list={product.allergens} />
        {product.needsVerification && (
          <p className="text-xs text-gold-600">
            <span className="font-semibold">Údaj k ověření:</span> {product.needsVerification}
          </p>
        )}

        <div className="mt-auto space-y-3 pt-2">
          {product.variants && product.variants.length > 1 && product.orderable && (
            <div>
              <label htmlFor={`${uid}-variant`} className="sr-only">
                Varianta – {product.name}
              </label>
              <select
                id={`${uid}-variant`}
                value={variant}
                onChange={(e) => setVariant(e.target.value)}
                className="field-input py-2 text-sm"
              >
                {product.variants.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.label}
                    {v.weight ? ` (${v.weight})` : ''}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="flex flex-col gap-3">
            <PriceTag product={product} />
            {product.orderable ? (
              product.id === 'dort-na-miru' ? (
                <Link to="/objednavka?typ=dort" className="btn-primary btn-sm w-full">
                  Navrhnout dort
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    add(product.id, variant || undefined);
                    setAdded(true);
                  }}
                  className={`btn-sm btn w-full ${added ? 'bg-sage-700 text-white' : 'bg-cocoa-900 text-cream-50 hover:bg-cocoa-700'}`}
                  aria-label={`Přidat do objednávky: ${product.name}${selectedVariant ? ` – ${selectedVariant.label}` : ''}`}
                >
                  {added ? <CheckIcon size={16} /> : <PlusIcon size={16} />}
                  {added ? 'Přidáno' : (<><span className="sm:hidden">Přidat</span><span className="hidden sm:inline">Přidat do objednávky</span></>)}
                </button>
              )
            ) : (
              <span className="rounded-xl bg-cream-100 px-3 py-2 text-xs font-semibold text-cocoa-600">{product.notOrderableReason}</span>
            )}
          </div>
          <p role="status" aria-live="polite" className="min-h-0 text-sm">
            {added && (
              <Link to="/objednavka" className="font-semibold text-raspberry-700 underline underline-offset-4">
                Přidáno – přejít k objednávce
              </Link>
            )}
          </p>
        </div>
      </div>
    </article>
  );
}
