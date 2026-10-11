import { Link } from 'react-router';
import { Checkbox, TextArea, TextField } from '../../components/ui/Field';
import { useOrder } from '../store';
import type { Customer } from '../types';
import type { Errors } from '../validation';

export function StepContact({ errors }: { errors: Errors }) {
  const { state, update } = useOrder();
  const c = state.customer;
  const set = <K extends keyof Customer>(key: K, value: Customer[K]) => update((s) => ({ ...s, customer: { ...s.customer, [key]: value } }));

  return (
    <div className="space-y-5">
      <p className="text-cocoa-700">Údaje potřebujeme jen k vyřízení objednávky – abychom vám mohli potvrdit termín a cenu.</p>
      <TextField
        id="f-customer-name"
        label="Jméno a příjmení"
        autoComplete="name"
        required
        value={c.name}
        onChange={(e) => set('name', e.target.value)}
        error={errors['f-customer-name']}
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          id="f-customer-phone"
          label="Telefon"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          placeholder="775 982 575"
          required
          value={c.phone}
          onChange={(e) => set('phone', e.target.value)}
          error={errors['f-customer-phone']}
        />
        <TextField
          id="f-customer-email"
          label="E-mail"
          type="email"
          autoComplete="email"
          required
          value={c.email}
          onChange={(e) => set('email', e.target.value)}
          error={errors['f-customer-email']}
        />
      </div>
      <TextArea id="f-customer-note" label="Poznámka" value={c.note} onChange={(e) => set('note', e.target.value)} error={errors['f-customer-note']} />

      {/* Ochrana proti spamu: pole vidí jen roboti. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="f-customer-website">Nevyplňujte toto pole</label>
        <input id="f-customer-website" tabIndex={-1} autoComplete="off" value={c.website} onChange={(e) => set('website', e.target.value)} />
      </div>

      <Checkbox
        id="f-customer-consent"
        checked={c.consent}
        onChange={(v) => set('consent', v)}
        error={errors['f-customer-consent']}
        label={
          <>
            Souhlasím se zpracováním jména, telefonu a e-mailu za účelem vyřízení objednávky.{' '}
            <Link to="/ochrana-osobnich-udaju" target="_blank" className="font-semibold text-raspberry-700 underline underline-offset-2">
              Zásady ochrany osobních údajů
            </Link>
            <span className="text-raspberry-600" aria-hidden="true">
              {' '}
              *
            </span>
          </>
        }
      />
    </div>
  );
}
