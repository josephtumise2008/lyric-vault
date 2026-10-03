import { Mail, MapPin, Ticket } from 'lucide-react'
import { useState } from 'react'

import {
  ARTIST_NAME,
  PLACEHOLDER,
  booking,
  newsletter,
  socials,
} from '../content'
import { budgetRanges, hasErrors, submitBooking, validateBooking } from '../lib/forms'
import type { FieldErrors, FormStatus } from '../lib/forms'
import type { BookingEventType } from '../types'

import { Accordion } from '../components/Accordion'
import { BrandIcon } from '../components/BrandIcon'
import { MicrophoneArt } from '../components/art/Doodles'
import { Button } from '../components/Button'
import { FormStatus as FormStatusMessage, Honeypot, SelectField, TextAreaField, TextField } from '../components/form/Fields'
import { PageHeader } from '../components/PageHeader'
import { Reveal } from '../components/Reveal'
import { Section } from '../components/Section'
import { Seo } from '../components/Seo'
import { SocialLinks } from '../components/SocialLinks'

type Values = {
  name: string
  email: string
  eventType: BookingEventType | ''
  date: string
  city: string
  budget: string
  message: string
  company: string
}

const EMPTY: Values = {
  name: '',
  email: '',
  eventType: '',
  date: '',
  city: '',
  budget: '',
  message: '',
  company: '',
}

function DetailFacts() {
  const facts = [
    { icon: <Mail aria-hidden="true" className="size-4 text-blood" />, label: 'Email', value: booking.email, href: `mailto:${booking.email}` },
    {
      icon: <MapPin aria-hidden="true" className="size-4 text-blood" />,
      label: 'Based',
      value: `${booking.based}, ${booking.region}`,
    },
    {
      icon: <Ticket aria-hidden="true" className="size-4 text-blood" />,
      label: 'Rates',
      value: booking.rates,
    },
  ]

  return (
    <div className="grid gap-px border border-line bg-line sm:grid-cols-3">
      {facts.map((fact) => (
        <div key={fact.label} className="bg-surface px-5 py-5">
          {fact.icon}
          <p className="kicker mt-3 text-[0.5625rem]">{fact.label}</p>
          {fact.href ? (
            <a href={fact.href} className="link-underline mt-1 block break-all text-[0.9375rem] text-bone">
              {fact.value}
            </a>
          ) : (
            <p className="mt-1 text-[0.9375rem] leading-relaxed text-bone">{fact.value}</p>
          )}
        </div>
      ))}
    </div>
  )
}

export default function Book() {
  const [values, setValues] = useState<Values>(EMPTY)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [status, setStatus] = useState<FormStatus>('idle')
  const [message, setMessage] = useState('')

  const update =
    (key: keyof Values) =>
    (value: string): void => {
      setValues((current) => ({ ...current, [key]: value }))
      if (status !== 'idle') setStatus('idle')
    }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const payload = {
      name: values.name,
      email: values.email,
      eventType: values.eventType,
      date: values.date,
      budget: values.budget,
      message: values.message,
      company: values.company,
    }

    const nextErrors = validateBooking(payload)
    setErrors(nextErrors)
    if (hasErrors(nextErrors)) {
      setStatus('error')
      setMessage('Please fix the highlighted fields.')
      return
    }

    setStatus('submitting')
    setMessage('')

    const result = await submitBooking(payload, {
      success: `Enquiry sent. Expect a reply from ${booking.email}.`,
      error: newsletter.errorMessage,
    })

    setStatus(result.ok ? 'success' : 'error')
    setMessage(result.message)
    if (result.ok) setValues(EMPTY)
  }

  const hasPlaceholders = [booking.name, booking.based, booking.availability ?? ''].some((value) =>
    value.includes(PLACEHOLDER),
  )

  const instagram = socials.find((link) => link.platform === 'Instagram')

  return (
    <>
      <Seo
        title="Book"
        description={`Book ${ARTIST_NAME} for shows, features, studio sessions, DJ sets and collaborations.`}
        path="/book"
      />

      <PageHeader
        index="06"
        eyebrow="Booking"
        title={
          <>
            Put {ARTIST_NAME} on the bill<span className="text-blood">.</span>
          </>
        }
        lede="Shows, features, studio sessions, DJ sets and collabs. The more detail you send, the faster a real answer comes back."
      >
        <MicrophoneArt className="h-16 w-28 text-blood/40" />
      </PageHeader>

      <Section index="01" eyebrow="Enquiries" spacing="md">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
          {/* Left — context */}
          <Reveal>
            <DetailFacts />

            <div className="mt-8">
              <p className="kicker">Available for</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {booking.eventTypes.map((type) => (
                  <li
                    key={type}
                    className="rounded-[2px] border border-line px-3 py-1.5 text-[0.625rem] font-semibold uppercase tracking-[0.12em] text-muted"
                  >
                    {type}
                  </li>
                ))}
              </ul>
            </div>

            <dl className="mt-8 space-y-4 border-t border-line pt-6">
              {[
                { label: 'Contact', value: booking.name },
                { label: 'Availability', value: booking.availability },
                { label: 'Response time', value: booking.responseTime },
                { label: 'Travel', value: booking.travel },
              ].map((row) => (
                <div key={row.label}>
                  <dt className="kicker text-[0.5625rem]">{row.label}</dt>
                  <dd className="mt-1 text-[0.875rem] leading-relaxed text-bone-dim">{row.value}</dd>
                </div>
              ))}
            </dl>

            {hasPlaceholders && (
              <p className="mt-8 border border-gold/30 bg-gold/[0.05] px-4 py-3 text-[0.8125rem] leading-relaxed text-bone-dim">
                <span className="font-semibold uppercase tracking-[0.14em] text-gold">
                  Placeholder details.
                </span>{' '}
                Some booking copy is still standing in. Edit the{' '}
                <code className="type-accent text-bone">booking</code> object in{' '}
                <code className="type-accent text-bone">src/content.ts</code> — no details are
                invented here.
              </p>
            )}

            {instagram && (
              <div className="mt-8 border-t border-line pt-6">
                <p className="kicker mb-3">Also reachable on</p>
                <SocialLinks links={[instagram]} />
              </div>
            )}
          </Reveal>

          {/* Right — form */}
          <Reveal delay={0.05}>
            <div className="border border-line bg-surface p-5 sm:p-7">
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div>
                  <h2 className="text-xl text-bone">Booking enquiry</h2>
                  <p className="mt-1.5 text-[0.8125rem] text-muted">
                    Fields marked with an asterisk are required.
                  </p>
                </div>

                <Honeypot value={values.company} onChange={update('company')} />

                <TextField
                  name="name"
                  label="Name *"
                  value={values.name}
                  onChange={(event) => update('name')(event.target.value)}
                  error={errors.name}
                  autoComplete="name"
                  required
                />

                <TextField
                  name="email"
                  label="Email *"
                  type="email"
                  inputMode="email"
                  value={values.email}
                  onChange={(event) => update('email')(event.target.value)}
                  error={errors.email}
                  autoComplete="email"
                  required
                />

                <SelectField
                  name="eventType"
                  label="Type of event *"
                  value={values.eventType}
                  onChange={(event) =>
                    update('eventType')(event.target.value as BookingEventType | '')
                  }
                  error={errors.eventType}
                  options={booking.eventTypes.map((type) => ({ value: type, label: type }))}
                  placeholder="Choose one"
                  required
                />

                <TextField
                  name="date"
                  label="Date"
                  type="date"
                  value={values.date}
                  onChange={(event) => update('date')(event.target.value)}
                  error={errors.date}
                  hint="Optional — leave blank if it is still open."
                />

                <div className="grid gap-5 sm:grid-cols-2">
                  <TextField
                    name="city"
                    label="City"
                    value={values.city}
                    onChange={(event) => update('city')(event.target.value)}
                    autoComplete="address-level2"
                  />

                  <SelectField
                    name="budget"
                    label="Budget"
                    value={values.budget}
                    onChange={(event) => update('budget')(event.target.value)}
                    options={budgetRanges.map((range) => ({ value: range, label: range }))}
                    placeholder="Select a range"
                  />
                </div>

                <TextAreaField
                  name="message"
                  label="Details *"
                  value={values.message}
                  onChange={(event) => update('message')(event.target.value)}
                  error={errors.message}
                  hint="Venue, capacity, running order, links to reference tracks."
                  rows={6}
                  required
                />

                <Button type="submit" variant="primary" disabled={status === 'submitting'}>
                  {status === 'submitting' ? 'Sending…' : 'Send enquiry'}
                </Button>

                <FormStatusMessage
                  status={status === 'submitting' ? 'idle' : status}
                  message={message}
                />

                <p className="type-accent text-center text-[0.625rem] text-muted-dim">
                  Goes to {booking.email}. Nothing is stored on this site.
                </p>
              </form>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* FAQ */}
      {booking.faq.length > 0 && (
        <Section
          index="02"
          eyebrow="FAQ"
          title="Before you ask"
          description="These answers save a round trip. If something is still unclear, put it in the message field."
          className="border-t border-line"
        >
          <Accordion
            items={booking.faq.map((item) => ({
              question: item.question,
              answer: item.answer,
            }))}
            className="mx-auto max-w-3xl"
          />
        </Section>
      )}

      {/* Booking contact strip */}
      <Section index="—" eyebrow="Direct" spacing="md" className="border-t border-line">
        <div className="flex flex-wrap items-center justify-between gap-6 border border-line bg-surface p-6">
          <div>
            <p className="kicker">Booking contact</p>
            <p className="mt-1.5 text-lg text-bone">{booking.name}</p>
            <p className="type-accent mt-1 text-[0.6875rem] text-muted-dim">
              {booking.responseTime}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button href={`mailto:${booking.email}`} variant="primary">
              <Mail aria-hidden="true" className="size-4" />
              Email booking
            </Button>
            {instagram && (
              <Button
                href={instagram.url}
                target="_blank"
                rel="noreferrer noopener"
                variant="outline"
              >
                <BrandIcon platform="Instagram" className="size-4" />
                Instagram
              </Button>
            )}
          </div>
        </div>
      </Section>
    </>
  )
}
