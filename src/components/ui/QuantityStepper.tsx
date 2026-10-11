import { useEffect, useState } from 'react';
import { formatNumber } from '../../lib/format';
import { MinusIcon, PlusIcon } from './Icons';

interface QuantityStepperProps {
  id: string;
  value: number;
  onChange: (value: number) => void;
  label: string;
  step?: number;
  min?: number;
  max?: number;
  unit?: string;
  invalid?: boolean;
  describedBy?: string;
  size?: 'sm' | 'md';
}

/** Množství s tlačítky −/+ a ručním zadáním. Hodnotu vždy zarovná na povolený krok. */
export function QuantityStepper({
  id,
  value,
  onChange,
  label,
  step = 1,
  min = step,
  max = 9999,
  unit,
  invalid,
  describedBy,
  size = 'md',
}: QuantityStepperProps) {
  const [draft, setDraft] = useState(formatNumber(value));
  useEffect(() => setDraft(formatNumber(value)), [value]);

  const snap = (n: number) => {
    const snapped = Math.round(n / step) * step;
    return Math.min(max, Math.max(min, Number(snapped.toFixed(2))));
  };

  const commit = () => {
    const parsed = Number(draft.replace(',', '.').replace(/\s/g, ''));
    if (!Number.isFinite(parsed) || parsed < 0) {
      setDraft(formatNumber(value));
      return;
    }
    const next = snap(parsed);
    setDraft(formatNumber(next));
    if (next !== value) onChange(next);
  };

  const btn =
    size === 'sm'
      ? 'h-9 w-9'
      : 'h-11 w-11';

  return (
    <div className="inline-flex items-center rounded-full border border-cocoa-800/15 bg-white p-1 shadow-sm">
      <button
        type="button"
        className={`${btn} inline-flex items-center justify-center rounded-full text-cocoa-800 transition hover:bg-cream-200 disabled:opacity-30`}
        onClick={() => onChange(snap(value - step))}
        disabled={value <= min}
        aria-label={`Ubrat – ${label}`}
      >
        <MinusIcon size={18} />
      </button>
      <label htmlFor={id} className="sr-only">
        Množství – {label}
        {unit ? ` (${unit})` : ''}
      </label>
      <input
        id={id}
        inputMode={step % 1 === 0 ? 'numeric' : 'decimal'}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            commit();
          }
        }}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        className={`${size === 'sm' ? 'w-12 text-sm' : 'w-14'} bg-transparent text-center font-semibold tabular-nums text-cocoa-900 focus:outline-none`}
      />
      {unit && <span className="pr-1 text-sm text-cocoa-600">{unit}</span>}
      <button
        type="button"
        className={`${btn} inline-flex items-center justify-center rounded-full bg-cocoa-900 text-cream-50 transition hover:bg-cocoa-700 disabled:opacity-30`}
        onClick={() => onChange(snap(value + step))}
        disabled={value >= max}
        aria-label={`Přidat – ${label}`}
      >
        <PlusIcon size={18} />
      </button>
    </div>
  );
}
