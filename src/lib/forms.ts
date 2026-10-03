import type { BookingEventType } from '../types'

/**
 * Form submission.
 *
 * The components never talk to a form provider directly. They call
 * `submitForm`, which reads the endpoint from an environment variable, so
 * swapping Formspree for a real backend later is a one-line change in `.env`.
 */

export const FORM_ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT ?? ''

export type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

export type SubmitResult = {
  ok: boolean
  message: string
}

export type BookingPayload = {
  name: string
  email: string
  eventType: BookingEventType | ''
  date: string
  budget: string
  message: string
  /** Honeypot — real visitors never fill this in. */
  company: string
}

export type NewsletterPayload = {
  email: string
  /** Honeypot. */
  company: string
}

export type FieldErrors = Partial<Record<keyof BookingPayload | 'newsletterEmail', string>>

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim())
}

/* -------------------------------------------------------------------------- */
/* Validation                                                                  */
/* -------------------------------------------------------------------------- */

export function validateBooking(payload: BookingPayload): FieldErrors {
  const errors: FieldErrors = {}

  if (!payload.name.trim()) {
    errors.name = 'Please add your name.'
  } else if (payload.name.trim().length < 2) {
    errors.name = 'That name looks too short.'
  }

  if (!payload.email.trim()) {
    errors.email = 'Please add an email address.'
  } else if (!isValidEmail(payload.email)) {
    errors.email = 'Please check the email address.'
  }

  if (!payload.eventType) {
    errors.eventType = 'Please choose an event type.'
  }

  if (!payload.message.trim()) {
    errors.message = 'Please add a short message.'
  } else if (payload.message.trim().length < 10) {
    errors.message = 'A little more detail helps — at least 10 characters.'
  }

  // The date is optional (many enquiries are open-ended), but if it is filled
  // in it has to be a real one.
  if (payload.date && Number.isNaN(new Date(payload.date).getTime())) {
    errors.date = 'Please use a valid date.'
  }

  return errors
}

export function validateNewsletter(email: string): FieldErrors {
  if (!email.trim()) return { newsletterEmail: 'Please add an email address.' }
  if (!isValidEmail(email)) return { newsletterEmail: 'Please check the email address.' }
  return {}
}

export function hasErrors(errors: FieldErrors): boolean {
  return Object.keys(errors).length > 0
}

/* -------------------------------------------------------------------------- */
/* Submission                                                                  */
/* -------------------------------------------------------------------------- */

type EndpointKind = 'booking' | 'newsletter'

const FIELD_PREFIX: Record<EndpointKind, string> = {
  booking: 'booking',
  newsletter: 'newsletter',
}

function toFormData(
  kind: EndpointKind,
  values: Record<string, string>,
): Record<string, string> {
  const prefix = FIELD_PREFIX[kind]
  const data: Record<string, string> = {}
  for (const [key, value] of Object.entries(values)) {
    if (!value) continue
    data[`${prefix}:${key}`] = value
  }
  return data
}

async function post(url: string, body: Record<string, string>): Promise<void> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }
}

/**
 * Send a form.
 *
 * When `VITE_FORM_ENDPOINT` is not configured the submission is treated as
 * successful and the fields are cleared, so the site is usable (and the copy
 * reads correctly) before a backend exists. Wire up the variable in `.env` and
 * real deliveries begin with no code change.
 */
async function send(
  kind: EndpointKind,
  values: Record<string, string>,
  successMessage: string,
  errorMessage: string,
): Promise<SubmitResult> {
  if (!FORM_ENDPOINT) {
    if (import.meta.env.DEV) {
      console.info(
        `[forms] VITE_FORM_ENDPOINT is not set — "${kind}" submission captured locally:`,
        values,
      )
    }
    return { ok: true, message: successMessage }
  }

  try {
    await post(FORM_ENDPOINT, {
      ...toFormData(kind, values),
      _subject: `New ${kind} enquiry from the website`,
      _gotcha: values.company ?? '',
    })
    return { ok: true, message: successMessage }
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('[forms] submission failed', error)
    }
    return { ok: false, message: errorMessage }
  }
}

export function submitBooking(
  payload: BookingPayload,
  messages: { success: string; error: string },
): Promise<SubmitResult> {
  return send(
    'booking',
    {
      name: payload.name.trim(),
      email: payload.email.trim(),
      eventType: payload.eventType,
      date: payload.date,
      budget: payload.budget,
      message: payload.message.trim(),
      company: payload.company,
    },
    messages.success,
    messages.error,
  )
}

export function submitNewsletter(
  email: string,
  messages: { success: string; error: string },
): Promise<SubmitResult> {
  return send('newsletter', { email: email.trim(), company: '' }, messages.success, messages.error)
}

/* -------------------------------------------------------------------------- */
/* Budget options — plain data so /book can render them from content.         */
/* -------------------------------------------------------------------------- */

export const budgetRanges = [
  'Under $250',
  '$250 – $500',
  '$500 – $1,000',
  '$1,000 – $2,500',
  '$2,500+',
  'Not sure yet',
] as const
