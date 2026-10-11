import { Checkbox, FieldError, Notice, SelectField, TextField } from '../../components/ui/Field';
import { PlusIcon, TrashIcon } from '../../components/ui/Icons';
import { Photo } from '../../components/ui/Photo';
import { QuantityStepper } from '../../components/ui/QuantityStepper';
import { FAVOR_BOXES, FAVOR_BOX_PACKING_FEE, FAVOR_COOKIES_TABLE, FAVOR_LIMITS, FAVOR_SHEET_PDF, MARZIPAN_HEARTS, RIBBON_COLORS } from '../../data/orderRules';
import { kolaceForFavors } from '../../data/products';
import { formatCzk } from '../../lib/format';
import { priceFavorPack } from '../pricing';
import { useOrder } from '../store';
import type { FavorPack } from '../types';
import type { Errors } from '../validation';

/** „Koláč povidlo-mák“ → „Povidlo-mák“, „Tvarohový koláč“ → „Tvarohový“ */
const shortKolacName = (name: string) => {
  const short = name.replace(' koláč', '').replace('Koláč ', '');
  return short.charAt(0).toUpperCase() + short.slice(1);
};

const newPack = (): FavorPack => ({
  id: Math.random().toString(36).slice(2, 9),
  count: 10,
  perPack: 8,
  composition: {},
  packaging: 'celofan',
  boxId: '',
  ribbon: RIBBON_COLORS[0],
  marzipanHeart: '',
  gingerHeart: false,
  gingerHeartText: '',
  cookies: FAVOR_COOKIES_TABLE[8],
  frgal: false,
});

function PackEditor({ pack, index, errors }: { pack: FavorPack; index: number; errors: Errors }) {
  const { update } = useOrder();
  const p = `f-favor-${index}-`;
  const set = (patch: Partial<FavorPack>) =>
    update((s) => ({
      ...s,
      details: { ...s.details, favors: s.details.favors.map((f) => (f.id === pack.id ? { ...f, ...patch } : f)) },
    }));
  const removePack = () =>
    update((s) => ({ ...s, details: { ...s.details, favors: s.details.favors.filter((f) => f.id !== pack.id) } }));

  const assigned = Object.values(pack.composition).reduce((a, b) => a + b, 0);
  const box = FAVOR_BOXES.find((b) => b.id === pack.boxId);
  const maxPerPack = pack.packaging === 'celofan' ? FAVOR_LIMITS.max : (box?.maxKolace ?? 40);
  const minPerPack = pack.packaging === 'celofan' ? FAVOR_LIMITS.min : 1;
  const recommended = FAVOR_COOKIES_TABLE[pack.perPack];
  const pricing = priceFavorPack(pack);

  return (
    <li className="card p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h4 className="text-xl font-medium">Výslužka {index + 1}</h4>
        <button type="button" onClick={removePack} className="btn-ghost btn-sm text-raspberry-700">
          <TrashIcon size={16} /> Odebrat
        </button>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <fieldset>
          <legend className="mb-2 text-sm font-semibold text-cocoa-900">Balení</legend>
          <div className="flex flex-wrap gap-2">
            {(
              [
                ['celofan', 'Celofán'],
                ['krabicka', 'Krabička'],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                aria-pressed={pack.packaging === value}
                className="chip"
                onClick={() =>
                  set({
                    packaging: value,
                    perPack: value === 'celofan' ? Math.min(Math.max(pack.perPack, FAVOR_LIMITS.min), FAVOR_LIMITS.max) : pack.perPack,
                  })
                }
              >
                {label}
              </button>
            ))}
          </div>
        </fieldset>
        {pack.packaging === 'krabicka' ? (
          <SelectField
            id={`${p}boxId`}
            label="Krabička"
            required
            value={pack.boxId}
            onChange={(e) => set({ boxId: e.target.value })}
            error={errors[`${p}boxId`]}
            options={FAVOR_BOXES.map((b) => ({
              value: b.id,
              label: `${b.name} – max. ${b.maxKolace} koláčů, ${b.color}, ${b.style}, ${formatCzk(b.price)}`,
            }))}
            hint={`Zabalení výslužky do krabičky naší obsluhou +${formatCzk(FAVOR_BOX_PACKING_FEE)}/ks (včetně krajky). Objednávejte nejpozději týden předem.`}
          />
        ) : (
          <SelectField
            id={`${p}ribbon`}
            label="Barva stuhy"
            required
            value={pack.ribbon}
            onChange={(e) => set({ ribbon: e.target.value })}
            options={RIBBON_COLORS}
            hint="Výslužka obsahuje tácek, ozdobnou krajku, celofán, stuhu a pocukrované koláče."
          />
        )}
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div>
          <p className="mb-1.5 text-sm font-semibold text-cocoa-900">Počet stejných balíčků</p>
          <QuantityStepper id={`${p}count`} label="počet balíčků" value={pack.count} onChange={(v) => set({ count: v })} min={1} max={2000} unit="ks" invalid={!!errors[`${p}count`]} />
          <FieldError id={`${p}count-error`} error={errors[`${p}count`]} />
        </div>
        <div>
          <p className="mb-1.5 text-sm font-semibold text-cocoa-900">Koláčů v jednom balíčku</p>
          <QuantityStepper
            id={`${p}perPack`}
            label="koláčů v balíčku"
            value={pack.perPack}
            onChange={(v) => set({ perPack: v, cookies: FAVOR_COOKIES_TABLE[v] ?? pack.cookies })}
            min={minPerPack}
            max={maxPerPack}
            unit="ks"
            invalid={!!errors[`${p}perPack`]}
          />
          <FieldError id={`${p}perPack-error`} error={errors[`${p}perPack`]} />
        </div>
      </div>

      <fieldset id={`${p}composition`} tabIndex={-1} className="mt-6 focus:outline-none">
        <legend className="text-sm font-semibold text-cocoa-900">Složení jednoho balíčku</legend>
        <p className={`mt-1 text-sm font-semibold ${assigned === pack.perPack ? 'text-sage-700' : 'text-cocoa-600'}`} aria-live="polite">
          Rozděleno {assigned} z {pack.perPack} koláčů
        </p>
        <ul className="mt-3 grid gap-3 sm:grid-cols-2">
          {kolaceForFavors.map((k) => (
            <li key={k.id} className="flex items-center justify-between gap-3 rounded-xl bg-cream-50 p-2 pr-3">
              <span className="flex min-w-0 items-center gap-2">
                <Photo image={k.image} alt="" className="h-10 w-10 shrink-0 rounded-lg" placeholder="" sizes="40px" />
                <span className="truncate text-sm font-semibold">{shortKolacName(k.name)}</span>
              </span>
              <QuantityStepper
                id={`${p}k-${k.id}`}
                label={k.name}
                value={pack.composition[k.id] ?? 0}
                onChange={(v) => set({ composition: { ...pack.composition, [k.id]: v } })}
                min={0}
                max={pack.perPack}
                size="sm"
              />
            </li>
          ))}
        </ul>
        <FieldError id={`${p}composition-error`} error={errors[`${p}composition`]} />
      </fieldset>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <SelectField
          id={`${p}marzipan`}
          label="Marcipánové srdíčko"
          value={pack.marzipanHeart}
          onChange={(e) => set({ marzipanHeart: e.target.value })}
          options={MARZIPAN_HEARTS.slice(1)}
          placeholder="Bez srdíčka"
          hint="Barvu můžeme sladit se svatbou – přineste ukázku stuhy či ubrousku."
        />
        <div>
          <p className="mb-1.5 text-sm font-semibold text-cocoa-900">Cukrátek v balíčku</p>
          <QuantityStepper id={`${p}cookies`} label="cukrátek v balíčku" value={pack.cookies} onChange={(v) => set({ cookies: v })} min={0} max={30} unit="ks" />
          <p className="mt-1.5 text-sm text-cocoa-600">
            Doporučujeme {recommended ?? '5–15'} ks. Do výslužek dáváme marmeládové cukroví.
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <Checkbox id={`${p}gingerHeart`} checked={pack.gingerHeart} onChange={(v) => set({ gingerHeart: v })} label="Přidat perníkové srdíčko s textem" />
        {pack.gingerHeart && (
          <TextField
            id={`${p}gingerHeartText`}
            label="Text na perníkové srdíčko"
            placeholder="např. K ♥ M 13. 8. 2026"
            maxLength={40}
            value={pack.gingerHeartText}
            onChange={(e) => set({ gingerHeartText: e.target.value })}
            error={errors[`${p}gingerHeartText`]}
          />
        )}
        <Checkbox id={`${p}frgal`} checked={pack.frgal} onChange={(v) => set({ frgal: v })} label="Přidat frgál (doporučujeme hruškový)" />
      </div>

      <div className="mt-6 rounded-xl bg-cream-50 p-4 text-sm">
        <p>
          <span className="font-semibold">{pricing.kolaceCount} koláčů</span> celkem · koláče {formatCzk(pricing.kolaceCost)}
          {pricing.boxCost > 0 && <> · krabičky a balení {formatCzk(pricing.boxCost)}</>}
        </p>
        {pricing.unpriced.length > 0 && <p className="mt-1 text-cocoa-600">Na dotaz: {pricing.unpriced.join(', ')}.</p>}
      </div>
    </li>
  );
}

export function FavorsForm({ errors }: { errors: Errors }) {
  const { state, update } = useOrder();
  const favors = state.details.favors;
  const addPack = () => update((s) => ({ ...s, details: { ...s.details, favors: [...s.details.favors, newPack()] } }));

  return (
    <section aria-labelledby="favors-title" className="space-y-5">
      <div>
        <h3 id="favors-title" className="text-2xl font-medium">
          Výslužky
        </h3>
        <p className="mt-1 text-cocoa-700">
          Každý typ výslužky nastavte zvlášť (např. 10 balíčků po 8 koláčích a 8 balíčků po 5 koláčích). Do celofánu lze zabalit {FAVOR_LIMITS.min}–
          {FAVOR_LIMITS.max} koláčů.
        </p>
      </div>
      <FieldError id="f-favors-error" error={errors['f-favors']} />
      <ul id="f-favors" tabIndex={-1} className="space-y-5 focus:outline-none">
        {favors.map((f, i) => (
          <PackEditor key={f.id} pack={f} index={i} errors={errors} />
        ))}
      </ul>
      <button type="button" onClick={addPack} className="btn-secondary">
        <PlusIcon size={18} /> Přidat {favors.length ? 'další ' : ''}typ výslužky
      </button>
      <Notice>
        <p>
          Výslužky pro konkrétní osoby? Přineste nám jmenovky v obálce označené jménem a datem vyzvednutí. Pro složitější rozpis můžete použít naši{' '}
          <a href={FAVOR_SHEET_PDF} target="_blank" rel="noopener noreferrer" className="font-semibold underline">
            tabulku rozpisu výslužek (PDF)
          </a>
          .
        </p>
      </Notice>
    </section>
  );
}
