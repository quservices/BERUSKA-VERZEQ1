import { Checkbox, FieldError, Notice, TextArea, TextField } from '../../components/ui/Field';
import { business } from '../../data/business';
import { WEDDING } from '../../data/orderRules';
import { formatCzk } from '../../lib/format';
import { useOrder } from '../store';
import { hasFavors, needsCake, WEDDING_INTERESTS, type OrderDetails } from '../types';
import type { Errors } from '../validation';
import { CakeForm } from './CakeForm';
import { FavorsForm } from './FavorsForm';

export function StepDetails({ errors }: { errors: Errors }) {
  const { state, update } = useOrder();
  const d = state.details;
  const patch = <K extends keyof OrderDetails>(key: K, value: OrderDetails[K]) =>
    update((s) => ({ ...s, details: { ...s.details, [key]: value } }));

  return (
    <div className="space-y-10">
      {state.type === 'oslava' && (
        <section className="space-y-5" aria-labelledby="celebration-title">
          <h3 id="celebration-title" className="text-2xl font-medium">
            Oslava
          </h3>
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              id="f-celebration-occasion"
              label="Příležitost"
              placeholder="např. 60. narozeniny, křtiny"
              value={d.celebration.occasion}
              onChange={(e) => patch('celebration', { ...d.celebration, occasion: e.target.value })}
            />
            <TextField
              id="f-celebration-guests"
              label="Přibližný počet hostů"
              type="number"
              inputMode="numeric"
              min={1}
              value={d.celebration.guests}
              onChange={(e) => patch('celebration', { ...d.celebration, guests: e.target.value })}
            />
          </div>
          <Checkbox id="f-wantsCake" checked={d.wantsCake} onChange={(v) => patch('wantsCake', v)} label="K oslavě chci i dort na míru" error={errors['f-wantsCake']} />
        </section>
      )}

      {state.type === 'svatba' && (
        <section className="space-y-5" aria-labelledby="wedding-title">
          <h3 id="wedding-title" className="text-2xl font-medium">
            Svatba
          </h3>
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              id="f-wedding-date"
              label="Datum svatby"
              type="date"
              required
              value={d.wedding.date}
              onChange={(e) => patch('wedding', { ...d.wedding, date: e.target.value })}
              error={errors['f-wedding-date']}
            />
            <TextField
              id="f-wedding-guests"
              label="Přibližný počet hostů"
              type="number"
              inputMode="numeric"
              min={1}
              value={d.wedding.guests}
              onChange={(e) => patch('wedding', { ...d.wedding, guests: e.target.value })}
            />
          </div>
          <fieldset id="f-wedding-pickupWhen" tabIndex={-1} className="focus:outline-none">
            <legend className="mb-2 text-sm font-semibold text-cocoa-900">
              Vyzvednutí <span className="text-raspberry-600">*</span>
            </legend>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ['v-den', 'V den svatby'],
                  ['den-predem', 'Den předem'],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={d.wedding.pickupWhen === value}
                  className="chip"
                  onClick={() => patch('wedding', { ...d.wedding, pickupWhen: value })}
                >
                  {label}
                </button>
              ))}
            </div>
            <p className="mt-2 text-sm text-cocoa-600">Koláče pečeme v noci, aby byly co nejčerstvější – proto potřebujeme znát přesný termín.</p>
            <FieldError id="f-wedding-pickupWhen-error" error={errors['f-wedding-pickupWhen']} />
          </fieldset>
          <fieldset id="f-wedding-interests" tabIndex={-1} className="focus:outline-none">
            <legend className="mb-2 text-sm font-semibold text-cocoa-900">O co máte zájem</legend>
            <div className="flex flex-wrap gap-2">
              {WEDDING_INTERESTS.map((i) => {
                const on = d.wedding.interests.includes(i.id);
                return (
                  <button
                    key={i.id}
                    type="button"
                    aria-pressed={on}
                    className="chip"
                    onClick={() =>
                      patch('wedding', {
                        ...d.wedding,
                        interests: on ? d.wedding.interests.filter((x) => x !== i.id) : [...d.wedding.interests, i.id],
                      })
                    }
                  >
                    {i.label}
                  </button>
                );
              })}
            </div>
            <FieldError id="f-wedding-interests-error" error={errors['f-wedding-interests']} />
          </fieldset>
          <Notice>
            <p>Svatební koláče, cukroví na stůl (v kg) a frgály přidáte v kroku Výrobky. Cukroví lze objednat jen společně se svatebními koláči.</p>
            {d.wedding.interests.includes('dort') && (
              <p>
                Svatební dorty preferujeme předávat ve výrobně v Žabni, v chladicím termoboxu (vratná záloha {formatCzk(WEDDING.thermoboxDeposit)}, přepravka{' '}
                {formatCzk(WEDDING.crateDeposit)}).
              </p>
            )}
            <p>
              Svatby řeší {business.phones.special.person}, tel.{' '}
              <a className="font-semibold underline" href={`tel:${business.phones.special.tel}`}>
                {business.phones.special.display}
              </a>
              .
            </p>
          </Notice>
        </section>
      )}

      {needsCake(state) && <CakeForm errors={errors} />}
      {hasFavors(state) && <FavorsForm errors={errors} />}

      {state.type === 'firemni' && (
        <section className="space-y-5" aria-labelledby="company-title">
          <h3 id="company-title" className="text-2xl font-medium">
            Firemní akce
          </h3>
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              id="f-company-name"
              label="Název firmy"
              autoComplete="organization"
              value={d.company.name}
              onChange={(e) => patch('company', { ...d.company, name: e.target.value })}
            />
            <TextField
              id="f-company-guests"
              label="Počet osob"
              type="number"
              inputMode="numeric"
              min={1}
              value={d.company.guests}
              onChange={(e) => patch('company', { ...d.company, guests: e.target.value })}
            />
          </div>
          <TextArea
            id="f-company-occasion"
            label="Popis akce"
            placeholder="např. porada, firemní večírek, vánoční dárky pro partnery"
            value={d.company.occasion}
            onChange={(e) => patch('company', { ...d.company, occasion: e.target.value })}
            error={errors['f-company-occasion']}
            required={state.items.length === 0}
          />
        </section>
      )}

      {state.type === 'jina' && (
        <TextArea
          id="f-other-description"
          label="Co pro vás můžeme připravit?"
          required
          value={d.other.description}
          onChange={(e) => patch('other', { description: e.target.value })}
          error={errors['f-other-description']}
        />
      )}

      <section className="space-y-3" aria-labelledby="special-title">
        <h3 id="special-title" className="text-2xl font-medium">
          Speciální požadavky
        </h3>
        <TextArea
          id="f-specialRequests"
          label="Další přání k objednávce"
          placeholder="např. rozdělení do krabic, informace k oslavě…"
          value={d.specialRequests}
          onChange={(e) => patch('specialRequests', e.target.value)}
          error={errors['f-specialRequests']}
          hint="Koláče pečeme podle našich receptur – úpravy náplní či velikosti nejsou možné. Ostatním přáním se pokusíme vyhovět, jejich splnění ale není zaručeno."
        />
      </section>
    </div>
  );
}
