import { FieldError, Notice, SelectField, TextField } from '../../components/ui/Field';
import { CheckIcon, MapPinIcon } from '../../components/ui/Icons';
import { business, formatIntervals, fullAddress, type LocationId } from '../../data/business';
import { formatCzDate } from '../../lib/dates';
import { dayAvailability, earliestPickupDate, leadTime, pickupSlots } from '../pickup';
import { useOrder } from '../store';
import { needsCake } from '../types';
import type { Errors } from '../validation';

export function StepPickup({ errors, today }: { errors: Errors; today: string }) {
  const { state, update } = useOrder();
  const { place, date, time } = state.pickup;
  const set = (patch: Partial<typeof state.pickup>) => update((s) => ({ ...s, pickup: { ...s.pickup, ...patch } }));

  const min = earliestPickupDate(state, today);
  const lead = leadTime(state);
  const day = place && date ? dayAvailability(place, date) : null;
  const slots = place && date ? pickupSlots(place, date) : [];
  const weddingCake = state.type === 'svatba' && needsCake(state);

  return (
    <div className="space-y-8">
      <fieldset id="f-pickup-place" tabIndex={-1} className="focus:outline-none">
        <legend className="mb-3 text-sm font-semibold text-cocoa-900">
          Místo vyzvednutí <span className="text-raspberry-600">*</span>
        </legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {(Object.values(business.locations) as Array<(typeof business.locations)[LocationId]>).map((loc) => {
            const checked = place === loc.id;
            return (
              <label
                key={loc.id}
                className={`relative flex cursor-pointer flex-col rounded-2xl border-2 p-5 transition ${
                  checked ? 'border-raspberry-600 bg-raspberry-50' : 'border-cocoa-800/10 bg-white hover:border-cocoa-800/30'
                } has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-raspberry-500`}
              >
                <input
                  type="radio"
                  name="pickup-place"
                  value={loc.id}
                  checked={checked}
                  onChange={() => set({ place: loc.id, time: '' })}
                  className="sr-only"
                />
                <span className="font-display text-xl font-medium text-cocoa-900">{loc.name}</span>
                <span className="mt-1 flex items-center gap-1.5 text-sm text-cocoa-700">
                  <MapPinIcon size={15} /> {fullAddress(loc)}
                </span>
                <span className="mt-2 text-sm text-cocoa-600">
                  Út–Pá {formatIntervals(loc.hours[2])} · So {formatIntervals(loc.hours[6])} · Ne {formatIntervals(loc.hours[0])} · Po zavřeno
                </span>
                {checked && (
                  <span className="absolute top-4 right-4 inline-flex h-7 w-7 items-center justify-center rounded-full bg-raspberry-600 text-white">
                    <CheckIcon size={16} />
                  </span>
                )}
              </label>
            );
          })}
        </div>
        <FieldError id="f-pickup-place-error" error={errors['f-pickup-place']} />
        {weddingCake && <p className="mt-3 text-sm text-cocoa-700">Svatební dorty preferujeme předávat ve výrobně v Žabni.</p>}
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          id="f-pickup-date"
          label="Preferované datum"
          type="date"
          required
          min={min}
          value={date}
          onChange={(e) => set({ date: e.target.value, time: '' })}
          error={errors['f-pickup-date']}
          hint={`Nejdříve ${formatCzDate(min)}. ${lead.days > 1 ? lead.reason : ''}`}
        />
        <SelectField
          id="f-pickup-time"
          label="Preferovaný čas"
          required
          value={time}
          disabled={slots.length === 0}
          onChange={(e) => set({ time: e.target.value })}
          options={slots}
          placeholder={!place || !date ? 'Nejdříve vyberte místo a datum' : slots.length ? 'Vyberte čas…' : 'V tento den zavřeno'}
          error={errors['f-pickup-time']}
        />
      </div>

      {day && (
        <p className="text-sm text-cocoa-700" aria-live="polite">
          {day.open ? (
            <>
              {formatCzDate(date)}: otevřeno {formatIntervals(day.intervals)}
              {day.special?.note ? ` – ${day.special.note}` : ''}
            </>
          ) : (
            <>V tento den má {business.locations[place as LocationId].name.toLowerCase()} zavřeno.</>
          )}
          {day.unknown && <> Provoz v tento svátek zatím není potvrzený.</>}
        </p>
      )}

      <Notice tone="warning" title="Termín musí cukrárna potvrdit">
        <p>
          Zvolený den a čas jsou vaše preference. Web není napojený na kalendář cukrárny – dostupnost termínu i výrobků vám potvrdíme telefonicky nebo
          e-mailem.
        </p>
      </Notice>
    </div>
  );
}
