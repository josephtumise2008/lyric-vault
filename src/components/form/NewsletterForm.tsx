import { ArrowRight, Check, LoaderCircle, Mail } from 'lucide-react'
import { useState } from 'react'

import { newsletter } from '../../content'
import { cn } from '../../lib/cn'
import {
  hasErrors,
  submitNewsletter,
  validateNewsletter,
} from '../../lib/forms'
import type { FieldErrors, FormStatus } from '../../lib/forms'

import { Reveal } from '../Reveal'

/**
 * Email sign-up.
 *
 * Posts through `submitNewsletter` in `lib/forms.ts`, so the endpoint is
 * configured with an environment variable rather than hard-coded here.
 */
export function NewsletterForm({ className }: { className?: string }) {
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<FieldErrors>({})
  const [status, setStatus] = useState<FormStatus>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors = validateNewsletter(email)
    setErrors(nextErrors)
    if (hasErrors(nextErrors)) return

    setStatus('submitting')
    setMessage('')

    const result = await submitNewsletter(email, {
      success: newsletter.successMessage,
      error: newsletter.errorMessage,
    })

    setStatus(result.ok ? 'success' : 'error')
    setMessage(result.message)
    if (result.ok) setEmail('')
  }

  return (
    <Reveal className={cn('max-w-lg', className)}>
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <label className="sr-only" htmlFor="newsletter-email">
              Email address
            </label>
            <Mail
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-dim"
            />
            <input
              id="newsletter-email"
              name="newsletterEmail"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@email.com"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value)
                if (status !== 'idle') setStatus('idle')
              }}
              aria-invalid={errors.newsletterEmail ? true : undefined}
              aria-describedby={
                errors.newsletterEmail ? 'newsletter-email-error' : undefined
              }
              className={cn(
                'h-12 w-full rounded-[2px] border bg-surface pl-10 pr-4 text-[0.9375rem] text-bone placeholder:text-muted-dim transition-colors duration-300 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold',
                errors.newsletterEmail ? 'border-blood' : 'border-line hover:border-surface-3 focus:border-blood',
              )}
            />
          </div>

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="group inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-[2px] bg-blood px-6 text-xs font-semibold uppercase tracking-[0.14em] text-bone transition-all duration-300 hover:bg-blood-soft hover:shadow-[0_14px_40px_-14px_rgba(211,18,42,0.95)] active:translate-y-px disabled:opacity-60"
          >
            {status === 'submitting' ? (
              <>
                <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
                Sending
              </>
            ) : status === 'success' ? (
              <>
                <Check aria-hidden="true" className="size-4" />
                Done
              </>
            ) : (
              <>
                {newsletter.buttonLabel}
                <ArrowRight
                  aria-hidden="true"
                  className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
                />
              </>
            )}
          </button>
        </div>

        {errors.newsletterEmail && (
          <p id="newsletter-email-error" className="text-xs font-medium text-blood-soft">
            {errors.newsletterEmail}
          </p>
        )}

        {status !== 'idle' && message && (
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
        )}

        <p className="text-xs text-muted-dim">{newsletter.finePrint}</p>
      </form>
    </Reveal>
  )
}
