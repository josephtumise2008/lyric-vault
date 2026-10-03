import { useId } from 'react'
import type { ReactNode, SelectHTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes } from 'react'

import { cn } from '../../lib/cn'

const FIELD_BASE =
  'w-full rounded-[2px] border border-line bg-surface px-3.5 py-3 text-[0.9375rem] text-bone placeholder:text-muted-dim transition-colors duration-300 hover:border-surface-3 focus:border-blood focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold disabled:opacity-60'

const LABEL = 'kicker mb-2 block'

type FieldShellProps = {
  label: string
  htmlFor: string
  error?: string
  hint?: string
  required?: boolean
  children: ReactNode
  className?: string
}

/** Label + control + error, wired together for screen readers. */
export function Field({
  label,
  htmlFor,
  error,
  hint,
  required = false,
  children,
  className,
}: FieldShellProps) {
  return (
    <div className={cn('flex flex-col', className)}>
      <label className={LABEL} htmlFor={htmlFor}>
        {label}
        {required && (
          <span className="ml-1 text-blood" aria-hidden="true">
            *
          </span>
        )}
        {required && <span className="sr-only"> (required)</span>}
      </label>

      {children}

      {hint && !error && (
        <p id={`${htmlFor}-hint`} className="mt-1.5 text-xs text-muted-dim">
          {hint}
        </p>
      )}

      {error && (
        <p id={`${htmlFor}-error`} className="mt-1.5 text-xs font-medium text-blood-soft">
          {error}
        </p>
      )}
    </div>
  )
}

type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> & {
  label: string
  error?: string
  hint?: string
  wrapperClassName?: string
}

export function TextField({
  label,
  error,
  hint,
  wrapperClassName,
  required,
  ...rest
}: TextFieldProps) {
  const generatedId = useId()
  const id = rest.name ? `field-${rest.name}` : generatedId

  return (
    <Field
      label={label}
      htmlFor={id}
      error={error}
      hint={hint}
      required={required}
      className={wrapperClassName}
    >
      <input
        {...rest}
        id={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={cn(FIELD_BASE, error && 'border-blood')}
      />
    </Field>
  )
}

type TextAreaFieldProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'> & {
  label: string
  error?: string
  hint?: string
  wrapperClassName?: string
}

export function TextAreaField({
  label,
  error,
  hint,
  wrapperClassName,
  required,
  rows = 5,
  ...rest
}: TextAreaFieldProps) {
  const generatedId = useId()
  const id = rest.name ? `field-${rest.name}` : generatedId

  return (
    <Field
      label={label}
      htmlFor={id}
      error={error}
      hint={hint}
      required={required}
      className={wrapperClassName}
    >
      <textarea
        {...rest}
        id={id}
        rows={rows}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={cn(FIELD_BASE, 'resize-y', error && 'border-blood')}
      />
    </Field>
  )
}

type SelectFieldProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id'> & {
  label: string
  error?: string
  hint?: string
  wrapperClassName?: string
  options: Array<{ value: string; label: string }>
  placeholder: string
}

export function SelectField({
  label,
  error,
  hint,
  wrapperClassName,
  required,
  options,
  placeholder,
  ...rest
}: SelectFieldProps) {
  const generatedId = useId()
  const id = rest.name ? `field-${rest.name}` : generatedId

  return (
    <Field
      label={label}
      htmlFor={id}
      error={error}
      hint={hint}
      required={required}
      className={wrapperClassName}
    >
      <select
        {...rest}
        id={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={cn(
          FIELD_BASE,
          'appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 12 8\' fill=\'none\' stroke=\'%238a8a94\' stroke-width=\'1.6\'%3E%3Cpath d=\'M1 1l5 5 5-5\'/%3E%3C/svg%3E")] bg-[length:11px] bg-[right_1rem_center] bg-no-repeat pr-10',
          error && 'border-blood',
        )}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </Field>
  )
}

type HoneypotProps = {
  value: string
  onChange: (value: string) => void
}

/**
 * Spam trap.
 *
 * Hidden from humans and from assistive technology. Real visitors never fill it
 * in, so anything that does is a bot and the submission can be dropped.
 */
export function Honeypot({ value, onChange }: HoneypotProps) {
  return (
    <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
      <label htmlFor="field-company">Company</label>
      <input
        id="field-company"
        name="company"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  )
}

/** Polite live region for submission results. */
export function FormStatus({
  status,
  message,
}: {
  status: 'idle' | 'success' | 'error'
  message?: string
}) {
  if (status === 'idle' || !message) return null

  return (
    <p
      role="status"
      aria-live="polite"
      className={cn(
        'border px-4 py-3 text-sm',
        status === 'success'
          ? 'border-acid/40 bg-acid/[0.07] text-bone'
          : 'border-blood/50 bg-blood/[0.08] text-bone',
      )}
    >
      {message}
    </p>
  )
}
