import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { AlertIcon } from './Icons';

interface FieldShellProps {
  id: string;
  label: ReactNode;
  error?: string;
  hint?: ReactNode;
  required?: boolean;
  children: (aria: { id: string; 'aria-invalid'?: true; 'aria-describedby'?: string; required?: boolean }) => ReactNode;
  className?: string;
}

export function FieldShell({ id, label, error, hint, required, children, className = '' }: FieldShellProps) {
  const describedBy = [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(' ') || undefined;
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-cocoa-900">
        {label}
        {required ? (
          <span className="text-raspberry-600" aria-hidden="true">
            {' '}
            *
          </span>
        ) : (
          <span className="font-normal text-cocoa-500"> (nepovinné)</span>
        )}
      </label>
      {children({ id, 'aria-invalid': error ? true : undefined, 'aria-describedby': describedBy, required })}
      {hint && (
        <p id={`${id}-hint`} className="mt-1.5 text-sm text-cocoa-600">
          {hint}
        </p>
      )}
      <FieldError id={`${id}-error`} error={error} />
    </div>
  );
}

export function FieldError({ id, error }: { id: string; error?: string }) {
  if (!error) return null;
  return (
    <p id={id} className="mt-1.5 flex items-start gap-1.5 text-sm font-semibold text-raspberry-700">
      <AlertIcon size={16} className="mt-0.5 shrink-0" />
      {error}
    </p>
  );
}

type Common = { id: string; label: ReactNode; error?: string; hint?: ReactNode; required?: boolean; className?: string };

export function TextField({ id, label, error, hint, required, className, ...rest }: Common & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <FieldShell id={id} label={label} error={error} hint={hint} required={required} className={className}>
      {(aria) => <input className="field-input" {...aria} {...rest} />}
    </FieldShell>
  );
}

export function TextArea({ id, label, error, hint, required, className, ...rest }: Common & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <FieldShell id={id} label={label} error={error} hint={hint} required={required} className={className}>
      {(aria) => <textarea className="field-input min-h-28 resize-y" {...aria} {...rest} />}
    </FieldShell>
  );
}

export function SelectField({
  id,
  label,
  error,
  hint,
  required,
  className,
  options,
  placeholder = 'Vyberte…',
  ...rest
}: Common & SelectHTMLAttributes<HTMLSelectElement> & { options: ReadonlyArray<string | { value: string; label: string }>; placeholder?: string }) {
  return (
    <FieldShell id={id} label={label} error={error} hint={hint} required={required} className={className}>
      {(aria) => (
        <select className="field-input appearance-none bg-[length:1.1rem] bg-[right_1rem_center] bg-no-repeat pr-10" style={{ backgroundImage: CHEVRON }} {...aria} {...rest}>
          <option value="">{placeholder}</option>
          {options.map((o) => {
            const opt = typeof o === 'string' ? { value: o, label: o } : o;
            return (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            );
          })}
        </select>
      )}
    </FieldShell>
  );
}

const CHEVRON = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%233b2418' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`;

export function Checkbox({
  id,
  label,
  checked,
  onChange,
  error,
  hint,
}: {
  id: string;
  label: ReactNode;
  checked: boolean;
  onChange: (v: boolean) => void;
  error?: string;
  hint?: ReactNode;
}) {
  const describedBy = [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(' ') || undefined;
  return (
    <div>
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3 rounded-xl p-1">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className="mt-1 h-5 w-5 shrink-0 cursor-pointer accent-raspberry-600"
        />
        <span className="text-[0.95rem] text-cocoa-800">{label}</span>
      </label>
      {hint && (
        <p id={`${id}-hint`} className="mt-1 pl-9 text-sm text-cocoa-600">
          {hint}
        </p>
      )}
      <div className="pl-9">
        <FieldError id={`${id}-error`} error={error} />
      </div>
    </div>
  );
}

/** Informační / varovný box. */
export function Notice({ tone = 'info', title, children }: { tone?: 'info' | 'warning' | 'demo'; title?: ReactNode; children: ReactNode }) {
  const styles = {
    info: 'border-cocoa-800/10 bg-cream-50 text-cocoa-800',
    warning: 'border-gold-400/50 bg-[#fbf3e3] text-cocoa-900',
    demo: 'border-raspberry-200 bg-raspberry-50 text-cocoa-900',
  }[tone];
  return (
    <div className={`rounded-2xl border px-4 py-3.5 text-[0.95rem] ${styles}`}>
      {title && <p className="mb-1 font-bold">{title}</p>}
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}
