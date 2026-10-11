import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router';
import { FieldError, Notice } from '../components/ui/Field';
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon, PhoneIcon } from '../components/ui/Icons';
import { business } from '../data/business';
import { todayISO } from '../lib/dates';
import { formatCzk } from '../lib/format';
import { buildPayload, orderPayloadSchema } from './payload';
import { computeTotals } from './pricing';
import { useOrder } from './store';
import { createSubmitter, SubmitError, type OrderSubmitter, type SubmitResult } from './submit';
import { StepContact } from './steps/StepContact';
import { StepDetails } from './steps/StepDetails';
import { StepItems } from './steps/StepItems';
import { StepPickup } from './steps/StepPickup';
import { OrderOverview, StepSummary, TotalsBox } from './steps/StepSummary';
import { StepType } from './steps/StepType';
import type { OrderState, OrderType } from './types';
import { STEPS, validateOrder, validateStep, type Errors, type StepId } from './validation';

interface OrderWizardProps {
  initialType?: OrderType;
  submitter?: OrderSubmitter;
  /** Dnešní datum (pro testy). */
  today?: string;
}

function focusFirstError(errors: Errors) {
  const first = Object.keys(errors)[0];
  if (!first) return;
  requestAnimationFrame(() => {
    const el = document.getElementById(first) ?? document.getElementById(`${first}-error`);
    el?.focus({ preventScroll: true });
    el?.scrollIntoView?.({ block: 'center', behavior: 'smooth' });
  });
}

function MiniSummary() {
  const { state } = useOrder();
  const totals = computeTotals(state);
  const favorsKolace = totals.favors.reduce((s, f) => s + f.kolaceCount, 0);
  return (
    <aside aria-label="Průběžný souhrn objednávky" className="card p-5">
      <h2 className="text-xl font-medium">Vaše objednávka</h2>
      {totals.lines.length === 0 && favorsKolace === 0 ? (
        <p className="mt-3 text-sm text-cocoa-600">Zatím prázdná.</p>
      ) : (
        <ul className="mt-3 space-y-2 text-sm">
          {totals.lines.map((l) => (
            <li key={l.line.key} className="flex justify-between gap-3">
              <span className="min-w-0">
                <span className="tabular-nums">{l.qtyLabel}</span> {l.product.name}
                {l.variant && <span className="text-cocoa-600"> ({l.variant.label})</span>}
              </span>
              <span className="shrink-0 tabular-nums">{l.total !== undefined ? formatCzk(l.total) : 'na dotaz'}</span>
            </li>
          ))}
          {favorsKolace > 0 && (
            <li className="flex justify-between gap-3">
              <span>Výslužky ({favorsKolace} koláčů)</span>
              <span className="tabular-nums">{formatCzk(totals.favors.reduce((s, f) => s + f.kolaceCost + f.boxCost, 0))}</span>
            </li>
          )}
        </ul>
      )}
      <p className="mt-4 flex items-baseline justify-between border-t border-cocoa-800/10 pt-3">
        <span className="text-sm font-semibold">{totals.hasUnpriced ? 'Ověřené položky' : 'Celkem'}</span>
        <span className="font-display text-2xl font-semibold tabular-nums">{formatCzk(totals.knownTotal)}</span>
      </p>
      {totals.hasUnpriced && <p className="mt-1 text-xs text-cocoa-600">+ položky s cenou na dotaz</p>}
    </aside>
  );
}

function ResultScreen({ result, snapshot, onReset }: { result: SubmitResult; snapshot: OrderState; onReset: () => void }) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => headingRef.current?.focus(), []);
  const totals = computeTotals(snapshot);
  const demo = result.status === 'demo';
  return (
    <div className="mx-auto max-w-3xl">
      <div role="status" className={`rounded-[1.75rem] p-7 sm:p-10 ${demo ? 'bg-raspberry-50 ring-2 ring-raspberry-200' : 'bg-sage-100 ring-2 ring-sage-700/30'}`}>
        <p className="eyebrow">{demo ? 'Ukázkový režim' : 'Objednávka přijata'}</p>
        <h2 ref={headingRef} tabIndex={-1} className="mt-3 text-3xl font-medium focus:outline-none sm:text-4xl">
          {demo ? 'Objednávka nebyla nikam odeslána' : 'Děkujeme, objednávku jsme přijali k vyřízení'}
        </h2>
        {demo ? (
          <div className="mt-4 space-y-3 text-cocoa-800">
            <p>
              Tento web je zatím návrh. Formulář prošel všemi kontrolami, ale <strong>objednávka se neuložila ani neodeslala cukrárně</strong>. Nikdo
              vás nebude kontaktovat.
            </p>
            <p>
              Pro skutečnou objednávku prosím zavolejte na{' '}
              <a href={`tel:${business.phones.orders.tel}`} className="font-semibold underline">
                {business.phones.orders.display}
              </a>{' '}
              (svatby a výslužky{' '}
              <a href={`tel:${business.phones.special.tel}`} className="font-semibold underline">
                {business.phones.special.display}
              </a>
              ).
            </p>
            <p className="text-sm text-cocoa-600">Označení ukázky: {result.reference}</p>
          </div>
        ) : (
          <div className="mt-4 space-y-3 text-cocoa-800">
            <p>
              Číslo objednávky: <strong>{result.reference}</strong>. Brzy se vám ozveme s potvrzením.
            </p>
            <p>
              <strong>Přijetí formuláře zatím není potvrzením dostupnosti výrobků ani termínu.</strong> Objednávka je závazná až po potvrzení
              cukrárnou{snapshot.type === 'dort' ? ' a uhrazení zálohy' : ''}.
            </p>
          </div>
        )}
        <div className="mt-6 flex flex-wrap gap-3">
          <a href={`tel:${business.phones.orders.tel}`} className="btn-primary">
            <PhoneIcon size={18} /> Zavolat do cukrárny
          </a>
          <button type="button" onClick={onReset} className="btn-secondary">
            Začít novou objednávku
          </button>
          <Link to="/" className="btn-ghost">
            Zpět na úvod
          </Link>
        </div>
      </div>
      <div className="card mt-8 p-6 sm:p-8">
        <h3 className="text-2xl font-medium">Rekapitulace</h3>
        <OrderOverview state={snapshot} totals={totals} />
        <TotalsBox totals={totals} />
      </div>
    </div>
  );
}

export function OrderWizard({ initialType, submitter: submitterProp, today: todayProp }: OrderWizardProps) {
  const { state, setType, reset } = useOrder();
  const today = todayProp ?? todayISO();
  const submitter = useMemo(() => submitterProp ?? createSubmitter(), [submitterProp]);
  const [stepIndex, setStepIndex] = useState(() => (initialType || state.type ? 1 : 0));
  const [errors, setErrors] = useState<Errors>({});
  const [showErrors, setShowErrors] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [result, setResult] = useState<{ result: SubmitResult; snapshot: OrderState } | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  useEffect(() => {
    if (initialType) setType(initialType);
  }, [initialType]);

  const step = STEPS[stepIndex];

  // Po zobrazení chyb je průběžně přepočítáváme, aby zmizely hned po opravě.
  useEffect(() => {
    if (showErrors) setErrors(validateStep(step.id, state, today));
  }, [state, showErrors, step.id, today]);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus({ preventScroll: true });
    headingRef.current?.scrollIntoView?.({ block: 'start', behavior: 'smooth' });
  }, [stepIndex]);

  const goTo = (id: StepId) => {
    setShowErrors(false);
    setErrors({});
    setSubmitError('');
    setStepIndex(STEPS.findIndex((s) => s.id === id));
  };

  const next = () => {
    const errs = validateStep(step.id, state, today);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setShowErrors(true);
      focusFirstError(errs);
      return;
    }
    goTo(STEPS[stepIndex + 1].id);
  };

  const submit = async () => {
    setSubmitError('');
    const invalid = validateOrder(state, today);
    if (invalid) {
      if (invalid.step !== 'souhrn') goTo(invalid.step);
      setErrors(invalid.errors);
      setShowErrors(invalid.step !== 'souhrn');
      if (invalid.errors['f-submit']) setSubmitError(invalid.errors['f-submit']);
      focusFirstError(invalid.errors);
      return;
    }
    const payload = buildPayload(state);
    const parsed = orderPayloadSchema.safeParse(payload);
    if (!parsed.success) {
      setSubmitError('Objednávku se nepodařilo zkontrolovat. Zkuste prosím upravit údaje, nebo nám zavolejte.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await submitter.submit(parsed.data);
      setResult({ result: res, snapshot: state });
      if (res.status === 'accepted') reset();
      window.scrollTo?.({ top: 0 });
    } catch (e) {
      setSubmitError(e instanceof SubmitError ? e.message : 'Při odesílání nastala neočekávaná chyba. Objednávka nebyla odeslána – zavolejte nám prosím.');
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    return (
      <ResultScreen
        result={result.result}
        snapshot={result.snapshot}
        onReset={() => {
          reset();
          setResult(null);
          setStepIndex(0);
        }}
      />
    );
  }

  return (
    <div>
      {submitter.mode === 'demo' && (
        <div className="mb-8">
          <Notice tone="demo" title="Ukázkový režim – objednávky se zatím nikam neodesílají">
            <p>
              Objednávku si můžete celou sestavit a vyzkoušet. Pro skutečnou objednávku nám zatím prosím zavolejte na{' '}
              <a href={`tel:${business.phones.orders.tel}`} className="font-semibold underline">
                {business.phones.orders.display}
              </a>
              .
            </p>
          </Notice>
        </div>
      )}

      <nav aria-label="Kroky objednávky" className="-mx-5 overflow-x-auto px-5 pb-2 sm:mx-0 sm:px-0">
        <ol className="flex w-max gap-2 sm:w-auto">
          {STEPS.map((s, i) => {
            const done = i < stepIndex;
            const current = i === stepIndex;
            return (
              <li key={s.id}>
                <button
                  type="button"
                  disabled={i > stepIndex}
                  onClick={() => goTo(s.id)}
                  aria-current={current ? 'step' : undefined}
                  className={`flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-semibold transition ${
                    current ? 'bg-cocoa-900 text-cream-50' : done ? 'bg-white text-cocoa-800 hover:bg-cream-200' : 'text-cocoa-500'
                  }`}
                >
                  <span
                    className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                      current ? 'bg-raspberry-500 text-white' : done ? 'bg-sage-700 text-white' : 'border border-cocoa-800/20'
                    }`}
                  >
                    {done ? <CheckIcon size={13} /> : i + 1}
                  </span>
                  {s.title}
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      <div className={`mt-6 grid gap-8 ${step.id === 'vyrobky' ? '' : 'lg:grid-cols-[1fr_20rem]'}`}>
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            if (step.id === 'souhrn') void submit();
            else next();
          }}
          className="card p-5 sm:p-8"
        >
          <p className="text-sm font-semibold text-cocoa-500">
            Krok {stepIndex + 1} z {STEPS.length}
          </p>
          <h2 ref={headingRef} tabIndex={-1} className="mt-1 scroll-mt-28 text-3xl font-medium focus:outline-none">
            {step.title}
          </h2>
          {showErrors && Object.keys(errors).length > 0 && (
            <p role="alert" className="mt-4 rounded-xl bg-raspberry-50 px-4 py-3 text-sm font-semibold text-raspberry-700">
              Zkontrolujte prosím označená pole ({Object.keys(errors).length}).
            </p>
          )}

          <div className="mt-6">
            {step.id === 'typ' && <StepType errors={errors} />}
            {step.id === 'vyrobky' && <StepItems errors={errors} />}
            {step.id === 'detaily' && <StepDetails errors={errors} />}
            {step.id === 'vyzvednuti' && <StepPickup errors={errors} today={today} />}
            {step.id === 'kontakt' && <StepContact errors={errors} />}
            {step.id === 'souhrn' && <StepSummary onEdit={goTo} />}
          </div>

          {step.id === 'souhrn' && (
            <div className="mt-6 space-y-3">
              <Notice tone="warning">
                <p>
                  Odesláním vytvoříte poptávku. <strong>Nejde o potvrzení dostupnosti výrobků ani termínu</strong> – objednávku vám potvrdíme telefonicky
                  nebo e-mailem.
                </p>
              </Notice>
              <div role="alert" aria-live="assertive">
                <FieldError id="f-submit" error={submitError} />
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-cocoa-800/10 pt-6 sm:flex-row sm:justify-between">
            {stepIndex > 0 ? (
              <button type="button" onClick={() => goTo(STEPS[stepIndex - 1].id)} className="btn-secondary">
                <ArrowLeftIcon size={18} /> Zpět
              </button>
            ) : (
              <span />
            )}
            {step.id === 'souhrn' ? (
              <button type="submit" className="btn-primary" disabled={submitting} aria-busy={submitting}>
                {submitting ? 'Odesílám…' : 'Odeslat objednávku'}
                {!submitting && <ArrowRightIcon size={18} />}
              </button>
            ) : (
              <button type="submit" className="btn-primary">
                Pokračovat <ArrowRightIcon size={18} />
              </button>
            )}
          </div>
          {submitting && (
            <p role="status" className="sr-only">
              Odesílám objednávku…
            </p>
          )}
        </form>

        <div className={`hidden lg:sticky lg:top-28 lg:self-start ${step.id === 'vyrobky' ? '' : 'lg:block'}`}>
          <MiniSummary />
        </div>
      </div>
    </div>
  );
}
