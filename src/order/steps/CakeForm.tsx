import { Checkbox, Notice, SelectField, TextArea, TextField } from '../../components/ui/Field';
import { business } from '../../data/business';
import { CAKE_DEPOSIT, CAKE_OPTIONS, LEAD_DAYS } from '../../data/orderRules';
import { formatCzk } from '../../lib/format';
import { useOrder } from '../store';
import type { CakeDetails } from '../types';
import type { Errors } from '../validation';

export function CakeForm({ errors }: { errors: Errors }) {
  const { state, update } = useOrder();
  const cake = state.details.cake;
  const set = <K extends keyof CakeDetails>(key: K, value: CakeDetails[K]) =>
    update((s) => ({ ...s, details: { ...s.details, cake: { ...s.details.cake, [key]: value } } }));

  return (
    <section aria-labelledby="cake-title" className="space-y-6">
      <div>
        <h3 id="cake-title" className="text-2xl font-medium">
          Dort na míru
        </h3>
        <p className="mt-1 text-cocoa-700">
          Společně probereme vaši představu a řekneme vám, co je možné připravit. Pokud vám u nás chutná některý ze zákusků, můžeme stejný krém
          použít i do dortu.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          id="f-cake-persons"
          label="Velikost – pro kolik osob"
          type="number"
          inputMode="numeric"
          min={1}
          max={500}
          required
          value={cake.persons}
          onChange={(e) => set('persons', e.target.value)}
          error={errors['f-cake-persons']}
        />
        <SelectField id="f-cake-shape" label="Tvar dortu" required options={CAKE_OPTIONS.shapes} value={cake.shape} onChange={(e) => set('shape', e.target.value)} error={errors['f-cake-shape']} />
        <SelectField id="f-cake-sponge" label="Korpus" required options={CAKE_OPTIONS.sponges} value={cake.sponge} onChange={(e) => set('sponge', e.target.value)} error={errors['f-cake-sponge']} />
        <SelectField id="f-cake-cream" label="Krém" required options={CAKE_OPTIONS.creams} value={cake.cream} onChange={(e) => set('cream', e.target.value)} error={errors['f-cake-cream']} />
        <SelectField id="f-cake-surface" label="Povrch a obalení" options={CAKE_OPTIONS.surfaces} value={cake.surface} onChange={(e) => set('surface', e.target.value)} />
        <SelectField id="f-cake-recipient" label="Pro koho je dort určen" options={CAKE_OPTIONS.recipients} value={cake.recipient} onChange={(e) => set('recipient', e.target.value)} />
      </div>

      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-cocoa-900">
          Zdobení <span className="font-normal text-cocoa-500">(nepovinné, lze vybrat více)</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {CAKE_OPTIONS.decorations.map((d) => {
            const on = cake.decorations.includes(d);
            return (
              <button
                key={d}
                type="button"
                aria-pressed={on}
                className="chip"
                onClick={() => set('decorations', on ? cake.decorations.filter((x) => x !== d) : [...cake.decorations, d])}
              >
                {d}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-sm text-cocoa-600">Jedlé květiny dle sezóny (růže, macešky, sedmikrásky, levandule…). Složité marcipánové figurky nevyrábíme.</p>
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField id="f-cake-fruit" label="Ovoce" placeholder="např. maliny, jahody" value={cake.fruit} onChange={(e) => set('fruit', e.target.value)} />
        <TextField id="f-cake-nameAge" label="Jméno a věk na dort" placeholder="např. Eliška 6 let" value={cake.nameAge} onChange={(e) => set('nameAge', e.target.value)} />
        <TextField
          id="f-cake-text"
          label="Text na dort"
          maxLength={80}
          value={cake.text}
          onChange={(e) => set('text', e.target.value)}
          error={errors['f-cake-text']}
          hint={`${cake.text.length}/80 znaků`}
          className="sm:col-span-2"
        />
      </div>

      <Checkbox
        id="f-cake-ediblePaper"
        checked={cake.ediblePaper}
        onChange={(v) => set('ediblePaper', v)}
        label="Chci jedlý papír s vlastním motivem"
        hint={`Dort s jedlým papírem je nutné objednat alespoň ${LEAD_DAYS.ediblePaper} dní předem. Motiv nám pošlete e-mailem.`}
      />

      <TextArea
        id="f-cake-idea"
        label="Vaše představa"
        placeholder="Barvy, styl, příležitost, co se vám líbí na inspiraci…"
        value={cake.idea}
        onChange={(e) => set('idea', e.target.value)}
      />

      <Notice title="Fotografie inspirace a záloha">
        <p>
          Fotografii vaší představy pošlete na <a href={`mailto:${business.email}`} className="font-semibold underline">{business.email}</a>{' '}
          (do předmětu uveďte své jméno a termín). Výsledný dort nebude úplně totožný – každá cukrářka má svůj rukopis, styl a barevnost ale zachováme.
        </p>
        <p>
          Pro potvrzení objednávky je potřeba uhradit zálohu {formatCzk(CAKE_DEPOSIT.min)}–{formatCzk(CAKE_DEPOSIT.max)} dle velikosti dortu.
        </p>
      </Notice>
    </section>
  );
}
