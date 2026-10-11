import type { ReactNode } from 'react';
import { business } from '../../data/business';
import { FAVOR_BOXES } from '../../data/orderRules';
import { getProduct } from '../../data/products';
import { formatCzDate } from '../../lib/dates';
import { formatCzk } from '../../lib/format';
import { computeTotals, type OrderTotals } from '../pricing';
import { useOrder } from '../store';
import { hasFavors, needsCake, ORDER_TYPES, WEDDING_INTERESTS, type OrderState } from '../types';
import type { StepId } from '../validation';

function Block({ title, step, onEdit, children }: { title: string; step?: StepId; onEdit?: (s: StepId) => void; children: ReactNode }) {
  return (
    <section className="border-b border-cocoa-800/10 py-5 last:border-0">
      <div className="mb-2 flex items-center justify-between gap-3">
        <h3 className="font-sans text-sm font-bold tracking-wider text-cocoa-600 uppercase">{title}</h3>
        {step && onEdit && (
          <button type="button" onClick={() => onEdit(step)} aria-label={`Upravit – ${title}`} className="text-sm font-semibold text-raspberry-700 underline underline-offset-4">
            Upravit
          </button>
        )}
      </div>
      <div className="text-cocoa-800">{children}</div>
    </section>
  );
}

function Row({ label, value }: { label: string; value?: ReactNode }) {
  if (value === undefined || value === '' || value === null) return null;
  return (
    <div className="flex gap-3 py-0.5">
      <dt className="w-40 shrink-0 text-cocoa-600">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}

export function OrderOverview({ state, totals, onEdit }: { state: OrderState; totals: OrderTotals; onEdit?: (s: StepId) => void }) {
  const d = state.details;
  const place = state.pickup.place ? business.locations[state.pickup.place] : null;
  return (
    <div>
      <Block title="Typ objednávky" step="typ" onEdit={onEdit}>
        {ORDER_TYPES.find((t) => t.id === state.type)?.name}
      </Block>

      <Block title="Výrobky" step="vyrobky" onEdit={onEdit}>
        {totals.lines.length === 0 ? (
          <p className="text-cocoa-600">Bez dalších výrobků.</p>
        ) : (
          <div className="-mx-1 overflow-x-auto">
            <table className="w-full min-w-[28rem] text-[0.95rem]">
              <thead>
                <tr className="text-left text-xs text-cocoa-500 uppercase">
                  <th className="px-1 pb-2 font-semibold">Výrobek</th>
                  <th className="px-1 pb-2 text-right font-semibold">Množství</th>
                  <th className="px-1 pb-2 text-right font-semibold">Cena/j.</th>
                  <th className="px-1 pb-2 text-right font-semibold">Celkem</th>
                </tr>
              </thead>
              <tbody>
                {totals.lines.map((l) => (
                  <tr key={l.line.key} className="border-t border-cocoa-800/5">
                    <td className="px-1 py-2">
                      {l.product.name}
                      {l.variant && <span className="text-cocoa-600"> – {l.variant.label}</span>}
                    </td>
                    <td className="px-1 py-2 text-right tabular-nums">{l.qtyLabel}</td>
                    <td className="px-1 py-2 text-right tabular-nums">{l.unitPrice !== undefined ? formatCzk(l.unitPrice) : 'na dotaz'}</td>
                    <td className="px-1 py-2 text-right font-semibold tabular-nums">{l.total !== undefined ? formatCzk(l.total) : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Block>

      {hasFavors(state) && (
        <Block title="Výslužky" step="detaily" onEdit={onEdit}>
          <ul className="space-y-3">
            {totals.favors.map((f, i) => (
              <li key={f.pack.id}>
                <p className="font-semibold">
                  {i + 1}. {f.pack.count}× balíček po {f.pack.perPack} koláčích –{' '}
                  {f.pack.packaging === 'celofan'
                    ? `celofán, stuha ${f.pack.ribbon.toLowerCase()}`
                    : (FAVOR_BOXES.find((b) => b.id === f.pack.boxId)?.name ?? 'krabička')}
                </p>
                <p className="text-sm text-cocoa-700">
                  {Object.entries(f.pack.composition)
                    .filter(([, n]) => n > 0)
                    .map(([id, n]) => `${n}× ${getProduct(id)?.name ?? id}`)
                    .join(', ')}
                  {f.pack.marzipanHeart && `; ${f.pack.marzipanHeart.toLowerCase()}`}
                  {f.pack.gingerHeart && `; perníkové srdíčko „${f.pack.gingerHeartText}“`}
                  {f.pack.cookies > 0 && `; ${f.pack.cookies} cukrátek`}
                  {f.pack.frgal && '; frgál'}
                </p>
                <p className="text-sm text-cocoa-600">
                  Koláče {formatCzk(f.kolaceCost)}
                  {f.boxCost > 0 && `, krabičky a balení ${formatCzk(f.boxCost)}`}
                  {f.unpriced.length > 0 && ` + na dotaz: ${f.unpriced.join(', ')}`}
                </p>
              </li>
            ))}
          </ul>
        </Block>
      )}

      {needsCake(state) && (
        <Block title="Dort" step="detaily" onEdit={onEdit}>
          <dl className="text-[0.95rem]">
            <Row label="Počet osob" value={d.cake.persons} />
            <Row label="Tvar" value={d.cake.shape} />
            <Row label="Korpus" value={d.cake.sponge} />
            <Row label="Krém" value={d.cake.cream} />
            <Row label="Povrch" value={d.cake.surface} />
            <Row label="Zdobení" value={d.cake.decorations.join(', ')} />
            <Row label="Ovoce" value={d.cake.fruit} />
            <Row label="Pro koho" value={d.cake.recipient} />
            <Row label="Jméno a věk" value={d.cake.nameAge} />
            <Row label="Text na dort" value={d.cake.text} />
            <Row label="Jedlý papír" value={d.cake.ediblePaper ? 'ano' : undefined} />
            <Row label="Představa" value={d.cake.idea} />
          </dl>
        </Block>
      )}

      {(state.type === 'oslava' || state.type === 'svatba' || state.type === 'firemni' || state.type === 'jina' || d.specialRequests) && (
        <Block title="Podrobnosti" step="detaily" onEdit={onEdit}>
          <dl className="text-[0.95rem]">
            {state.type === 'oslava' && (
              <>
                <Row label="Příležitost" value={d.celebration.occasion} />
                <Row label="Počet hostů" value={d.celebration.guests} />
              </>
            )}
            {state.type === 'svatba' && (
              <>
                <Row label="Datum svatby" value={d.wedding.date && formatCzDate(d.wedding.date)} />
                <Row label="Vyzvednutí" value={d.wedding.pickupWhen === 'v-den' ? 'v den svatby' : d.wedding.pickupWhen ? 'den předem' : ''} />
                <Row label="Počet hostů" value={d.wedding.guests} />
                <Row
                  label="Zájem o"
                  value={d.wedding.interests.map((i) => WEDDING_INTERESTS.find((w) => w.id === i)?.label).join(', ')}
                />
              </>
            )}
            {state.type === 'firemni' && (
              <>
                <Row label="Firma" value={d.company.name} />
                <Row label="Počet osob" value={d.company.guests} />
                <Row label="Akce" value={d.company.occasion} />
              </>
            )}
            {state.type === 'jina' && <Row label="Popis" value={d.other.description} />}
            <Row label="Speciální požadavky" value={d.specialRequests} />
          </dl>
        </Block>
      )}

      <Block title="Vyzvednutí" step="vyzvednuti" onEdit={onEdit}>
        {place ? (
          <p>
            <span className="font-semibold">{place.name}</span>, {place.street} – {state.pickup.date && formatCzDate(state.pickup.date)}
            {state.pickup.time && ` v ${state.pickup.time}`}
            <br />
            <span className="text-sm text-cocoa-600">Preferovaný termín – musí jej potvrdit cukrárna.</span>
          </p>
        ) : (
          <p className="text-cocoa-600">Nevyplněno</p>
        )}
      </Block>

      <Block title="Kontakt" step="kontakt" onEdit={onEdit}>
        <dl className="text-[0.95rem]">
          <Row label="Jméno" value={state.customer.name} />
          <Row label="Telefon" value={state.customer.phone} />
          <Row label="E-mail" value={state.customer.email} />
          <Row label="Poznámka" value={state.customer.note} />
        </dl>
      </Block>
    </div>
  );
}

export function TotalsBox({ totals }: { totals: OrderTotals }) {
  return (
    <div className="rounded-2xl bg-cream-50 p-5">
      {totals.discount > 0 && (
        <p className="flex justify-between text-sm">
          <span>Sleva za množství</span>
          <span className="tabular-nums">−{formatCzk(totals.discount)}</span>
        </p>
      )}
      <p className="flex items-baseline justify-between gap-4">
        <span className="font-semibold">{totals.hasUnpriced ? 'Orientační cena ověřených položek' : 'Celková cena'}</span>
        <span className="font-display text-3xl font-semibold text-cocoa-900 tabular-nums">{formatCzk(totals.knownTotal)}</span>
      </p>
      {totals.hasUnpriced && (
        <p className="mt-1 text-sm text-cocoa-600">
          Některé položky nemají na webu uvedenou cenu – konečnou cenu vám sdělíme při potvrzení objednávky.
        </p>
      )}
      {totals.notes.length > 0 && (
        <ul className="mt-3 space-y-1.5 border-t border-cocoa-800/10 pt-3 text-sm text-cocoa-700">
          {totals.notes.map((n) => (
            <li key={n} className="flex gap-2">
              <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-raspberry-500" />
              {n}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function StepSummary({ onEdit }: { onEdit: (s: StepId) => void }) {
  const { state } = useOrder();
  const totals = computeTotals(state);
  return (
    <div className="space-y-6">
      <OrderOverview state={state} totals={totals} onEdit={onEdit} />
      <TotalsBox totals={totals} />
    </div>
  );
}
