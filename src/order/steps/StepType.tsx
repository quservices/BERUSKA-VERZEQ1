import { FieldError } from '../../components/ui/Field';
import { CheckIcon } from '../../components/ui/Icons';
import { useOrder } from '../store';
import { ORDER_TYPES } from '../types';
import type { Errors } from '../validation';

export function StepType({ errors }: { errors: Errors }) {
  const { state, setType } = useOrder();
  return (
    <fieldset id="f-type" tabIndex={-1} aria-describedby={errors['f-type'] ? 'f-type-error' : undefined} className="focus:outline-none">
      <legend className="mb-5 text-lg text-cocoa-700">O jakou objednávku jde? Podle toho vám nabídneme správná pole.</legend>
      <div className="grid gap-3 sm:grid-cols-2">
        {ORDER_TYPES.map((t) => {
          const checked = state.type === t.id;
          return (
            <label
              key={t.id}
              className={`relative flex cursor-pointer flex-col rounded-2xl border-2 p-5 transition ${
                checked ? 'border-raspberry-600 bg-raspberry-50' : 'border-cocoa-800/10 bg-white hover:border-cocoa-800/30'
              } has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-raspberry-500`}
            >
              <input type="radio" name="order-type" value={t.id} checked={checked} onChange={() => setType(t.id)} className="sr-only" />
              <span className="pr-8 font-display text-xl font-medium text-cocoa-900">{t.name}</span>
              <span className="mt-1 text-sm text-cocoa-600">{t.description}</span>
              {checked && (
                <span className="absolute top-4 right-4 inline-flex h-7 w-7 items-center justify-center rounded-full bg-raspberry-600 text-white">
                  <CheckIcon size={16} />
                </span>
              )}
            </label>
          );
        })}
      </div>
      <FieldError id="f-type-error" error={errors['f-type']} />
    </fieldset>
  );
}
