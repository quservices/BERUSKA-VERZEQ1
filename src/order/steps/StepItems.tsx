import { useEffect, useMemo, useState } from 'react';
import { PriceTag } from '../../components/sections/ProductCard';
import { FieldError, Notice } from '../../components/ui/Field';
import { CheckIcon, PlusIcon, TrashIcon } from '../../components/ui/Icons';
import { Photo } from '../../components/ui/Photo';
import { QuantityStepper } from '../../components/ui/QuantityStepper';
import { categories, products, type CategoryId, type Product } from '../../data/products';
import { formatCzk } from '../../lib/format';
import { priceLine } from '../pricing';
import { useOrder } from '../store';
import type { Errors } from '../validation';

function normalize(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
}

function PickerRow({ product }: { product: Product }) {
  const { add } = useOrder();
  const [variant, setVariant] = useState(product.variants?.[0]?.id ?? '');
  const [added, setAdded] = useState(false);
  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 1500);
    return () => clearTimeout(t);
  }, [added]);
  return (
    <li className="flex items-center gap-3 py-3">
      <Photo image={product.image} alt="" className="h-14 w-14 shrink-0 rounded-xl" placeholder="" sizes="56px" />
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-cocoa-900">{product.name}</p>
        <div className="flex flex-wrap items-center gap-x-3 text-sm">
          <PriceTag product={product} className="[&_.font-display]:text-base" />
          {product.weight && <span className="text-cocoa-500">{product.weight}</span>}
        </div>
        {product.variants && product.variants.length > 1 && (
          <select
            aria-label={`Varianta – ${product.name}`}
            value={variant}
            onChange={(e) => setVariant(e.target.value)}
            className="mt-1.5 rounded-lg border border-cocoa-800/20 bg-white px-2 py-1 text-sm"
          >
            {product.variants.map((v) => (
              <option key={v.id} value={v.id}>
                {v.label}
                {v.weight ? ` (${v.weight})` : ''}
              </option>
            ))}
          </select>
        )}
      </div>
      <button
        type="button"
        onClick={() => {
          add(product.id, variant || undefined);
          setAdded(true);
        }}
        className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-cream-50 transition ${added ? 'bg-sage-700' : 'bg-cocoa-900 hover:bg-raspberry-600'}`}
        aria-label={`Přidat do objednávky: ${product.name}`}
      >
        {added ? <CheckIcon size={18} /> : <PlusIcon size={18} />}
      </button>
      <span role="status" className="sr-only">
        {added ? `Přidáno: ${product.name}` : ''}
      </span>
    </li>
  );
}

export function CartList({ errors }: { errors: Errors }) {
  const { state, setQty, setVariant, remove } = useOrder();
  if (state.items.length === 0) {
    return <p className="rounded-2xl border border-dashed border-cocoa-800/20 p-6 text-center text-cocoa-600">Zatím nemáte žádné výrobky.</p>;
  }
  return (
    <ul className="divide-y divide-cocoa-800/10">
      {state.items.map((line) => {
        const priced = priceLine(line);
        if (!priced) return null;
        const { product } = priced;
        const qtyId = `f-qty-${line.key}`;
        const error = errors[qtyId];
        return (
          <li key={line.key} className="py-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold text-cocoa-900">{product.name}</p>
                {product.variants && product.variants.length > 1 ? (
                  <select
                    aria-label={`Varianta – ${product.name}`}
                    value={line.variantId ?? ''}
                    onChange={(e) => setVariant(line.key, e.target.value)}
                    className="mt-1 rounded-lg border border-cocoa-800/20 bg-white px-2 py-1 text-sm"
                  >
                    {product.variants.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.label}
                      </option>
                    ))}
                  </select>
                ) : null}
                <p className="mt-1 text-sm text-cocoa-600">
                  {priced.unitPrice !== undefined
                    ? `${formatCzk(priced.unitPrice)} / ${priced.unitLabel}`
                    : 'Cena na dotaz'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => remove(line.key)}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-cocoa-600 hover:bg-raspberry-50 hover:text-raspberry-700"
                aria-label={`Odebrat z objednávky: ${product.name}`}
              >
                <TrashIcon size={18} />
              </button>
            </div>
            <div className="mt-3 flex items-center justify-between gap-3">
              <QuantityStepper
                id={qtyId}
                label={product.name}
                value={line.qty}
                onChange={(q) => setQty(line.key, q)}
                step={product.step ?? 1}
                min={product.minQty ?? product.step ?? 1}
                max={product.maxQty ?? 5000}
                unit={priced.unitLabel}
                size="sm"
                invalid={!!error}
                describedBy={error ? `${qtyId}-error` : undefined}
              />
              <span className="font-semibold text-cocoa-900 tabular-nums">{priced.total !== undefined ? formatCzk(priced.total) : '—'}</span>
            </div>
            <FieldError id={`${qtyId}-error`} error={error} />
          </li>
        );
      })}
    </ul>
  );
}

export function StepItems({ errors }: { errors: Errors }) {
  const { state } = useOrder();
  const [category, setCategory] = useState<CategoryId>('kolace');
  const [query, setQuery] = useState('');

  const list = useMemo(() => {
    const orderable = products.filter((p) => p.orderable && p.id !== 'dort-na-miru');
    if (query.trim()) {
      const q = normalize(query.trim());
      return orderable.filter((p) => normalize(`${p.name} ${p.description ?? ''}`).includes(q));
    }
    return orderable.filter((p) => p.category === category);
  }, [category, query]);

  const optional = state.type === 'dort' || state.type === 'vysluzky' || state.type === 'svatba' || state.type === 'oslava' || state.type === 'jina';

  return (
    <div className="grid gap-8 xl:grid-cols-[1.1fr_1fr]">
      <div>
        {state.type === 'dort' && (
          <div className="mb-5">
            <Notice>Dort nastavíte v dalším kroku. Tady můžete přidat další výrobky, např. zákusky nebo ozdoby na dort.</Notice>
          </div>
        )}
        {(state.type === 'vysluzky' || state.type === 'svatba') && (
          <div className="mb-5">
            <Notice>
              Koláče do výslužek rozdělíte v dalším kroku. Tady přidejte koláče a další výrobky mimo výslužky (např. na svatební stůl).
            </Notice>
          </div>
        )}
        <label htmlFor="picker-search" className="mb-1.5 block text-sm font-semibold text-cocoa-900">
          Hledat výrobek
        </label>
        <input
          id="picker-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="např. tvarohový, chlebíček, kobliha…"
          className="field-input"
        />
        {!query && (
          <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Kategorie">
            {categories
              .filter((c) => !c.seasonal)
              .map((c) => (
                <button key={c.id} type="button" aria-pressed={category === c.id} onClick={() => setCategory(c.id)} className="chip">
                  {c.name}
                </button>
              ))}
          </div>
        )}
        {category === 'kolace' && !query && (
          <p className="mt-4 text-sm text-cocoa-600">
            Koláče pečeme podle našich receptur – náplně ani velikost neupravujeme. Gramáž je přibližná (ruční výroba).
          </p>
        )}
        <ul className="mt-2 divide-y divide-cocoa-800/10" aria-label="Výrobky k přidání">
          {list.map((p) => (
            <PickerRow key={p.id} product={p} />
          ))}
          {list.length === 0 && <li className="py-6 text-cocoa-600">Nic jsme nenašli. Zkuste jiný výraz.</li>}
        </ul>
      </div>

      <div id="f-items" tabIndex={-1} className="focus:outline-none xl:sticky xl:top-28 xl:self-start">
        <div className="card p-5">
          <h3 className="text-xl font-medium">
            Vaše výrobky{' '}
            {optional && <span className="font-sans text-sm font-normal text-cocoa-500">(nepovinné)</span>}
          </h3>
          <FieldError id="f-items-error" error={errors['f-items']} />
          <div className="mt-2">
            <CartList errors={errors} />
          </div>
        </div>
      </div>
    </div>
  );
}
