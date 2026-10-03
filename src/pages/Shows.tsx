import { ArrowUpRight, CalendarDays, MapPin, Ticket } from 'lucide-react'
import { Link } from 'react-router-dom'

import { ARTIST_NAME, artist, formatShortDate, shows, showsEmptyMessage, socials } from '../content'
import { cn } from '../lib/cn'

import { CassetteArt } from '../components/art/Doodles'
import { Button } from '../components/Button'
import { NewsletterForm } from '../components/form/NewsletterForm'
import { PageHeader } from '../components/PageHeader'
import { Reveal, Stagger } from '../components/Reveal'
import { Section } from '../components/Section'
import { Seo } from '../components/Seo'
import { SocialLinks } from '../components/SocialLinks'

/**
 * Captured once when the module loads.
 *
 * Show dates change at midnight, not every render — reading the clock during
 * render would make the list unstable and break purity.
 */
const LOAD_TIME = Date.now()

function ShowRow({ show }: { show: (typeof shows)[number] }) {
  const isPast =
    show.status === 'Past' ||
    (show.date !== undefined && new Date(show.date).getTime() < LOAD_TIME)
  const soldOut = show.status === 'Sold Out'

  return (
    <li
      className={cn(
        'group grid gap-4 border-b border-line py-6 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:gap-8',
        isPast && 'opacity-50',
      )}
    >
      {/* Date block */}
      <div className="flex items-center gap-4 sm:w-28">
        {show.date ? (
          <div className="border border-line bg-surface px-3 py-2 text-center">
            <div className="type-accent text-[0.5625rem] text-blood">
              {new Date(show.date)
                .toLocaleDateString('en-US', { month: 'short' })
                .toUpperCase()}
            </div>
            <div className="font-display text-2xl leading-none text-bone">
              {new Date(show.date).getDate()}
            </div>
            <div className="type-accent text-[0.5625rem] text-muted-dim">
              {new Date(show.date).getFullYear()}
            </div>
          </div>
        ) : (
          <span className="kicker">TBA</span>
        )}

        <div className="sm:hidden">
          <p className="text-[0.8125rem] text-muted">
            {show.city}
            {show.region ? `, ${show.region}` : ''}
          </p>
        </div>
      </div>

      {/* Details */}
      <div className="min-w-0">
        <h3 className="text-lg text-bone transition-colors group-hover:text-blood">
          {show.title ?? show.venue ?? 'Show'}
        </h3>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.8125rem] text-muted">
          <span className="inline-flex items-center gap-1.5">
            <MapPin aria-hidden="true" className="size-3.5 shrink-0 text-muted-dim" />
            {show.city}
            {show.region ? `, ${show.region}` : ''}
            {show.venue ? ` — ${show.venue}` : ''}
          </span>
          {show.date && (
            <span className="hidden items-center gap-1.5 sm:inline-flex">
              <CalendarDays aria-hidden="true" className="size-3.5 shrink-0 text-muted-dim" />
              {formatShortDate(show.date)}
            </span>
          )}
          {show.price && <span className="type-accent text-muted-dim">{show.price}</span>}
        </div>
        {show.notes && (
          <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted-dim">{show.notes}</p>
        )}
      </div>

      {/* Action */}
      <div className="sm:text-right">
        {isPast ? (
          <span className="type-accent text-[0.625rem] uppercase tracking-[0.14em] text-muted-dim">
            Past
          </span>
        ) : show.ticketUrl ? (
          <a
            href={show.ticketUrl}
            target="_blank"
            rel="noreferrer noopener"
            className={cn(
              'inline-flex h-10 items-center gap-1.5 rounded-[2px] border px-4 text-[0.625rem] font-semibold uppercase tracking-[0.12em] transition-colors',
              soldOut
                ? 'pointer-events-none border-line text-muted-dim'
                : 'border-blood text-bone hover:bg-blood hover:text-bone',
            )}
            aria-disabled={soldOut}
            tabIndex={soldOut ? -1 : undefined}
          >
            <Ticket aria-hidden="true" className="size-3.5" />
            {soldOut ? 'Sold out' : 'Tickets'}
          </a>
        ) : (
          <span className="type-accent text-[0.625rem] uppercase tracking-[0.14em] text-muted-dim">
            {soldOut ? 'Sold out' : 'Free entry'}
          </span>
        )}
      </div>
    </li>
  )
}

export default function Shows() {
  const upcoming = shows.filter(
    (show) =>
      show.status !== 'Past' &&
      (show.date === undefined || new Date(show.date).getTime() >= LOAD_TIME),
  )
  const past = shows
    .filter((show) => show.date !== undefined && new Date(show.date).getTime() < LOAD_TIME)
    .sort(
      (a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime(),
    )

  const hasShows = shows.length > 0

  return (
    <>
      <Seo
        title="Shows"
        description={`Tour dates and live appearances for ${ARTIST_NAME}. ${artist.genre} from ${artist.origin}.`}
        path="/shows"
      />

      <PageHeader
        index="04"
        eyebrow="Shows"
        title={
          <>
            Live<span className="text-blood">.</span>
          </>
        }
        lede="Every announced date, with a link to tickets. Dates appear here the moment they are confirmed — nothing is listed speculatively."
      >
        <CassetteArt className="h-16 w-28 text-blood/40" />
      </PageHeader>

      {/* Upcoming */}
      <Section
        index="01"
        eyebrow="Upcoming"
        title={hasShows ? `${upcoming.length} upcoming` : 'Nothing on the calendar'}
        action={
          <Button to="/book" variant="outline" size="md">
            Book {ARTIST_NAME}
          </Button>
        }
      >
        {hasShows && upcoming.length > 0 ? (
          <Stagger as="ul" className="border-t border-line">
            {upcoming.map((show) => (
              <ShowRow key={show.id} show={show} />
            ))}
          </Stagger>
        ) : (
          <div className="relative overflow-hidden border border-dashed border-line px-6 py-16 text-center">
            <div aria-hidden="true" className="halftone absolute inset-0 opacity-30" />
            <div className="relative mx-auto max-w-md">
              <CalendarDays aria-hidden="true" className="mx-auto size-8 text-blood/50" />
              <p className="marker mt-5 text-2xl text-gold">{showsEmptyMessage}</p>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">
                Dates go up here as soon as they are locked in. In the meantime, the mailing list is
                the fastest way to hear about a show.
              </p>
            </div>
          </div>
        )}
      </Section>

      {/* Notify */}
      <Section index="—" eyebrow="Stay posted" spacing="md" className="border-t border-line">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <Reveal>
            <h2 className="text-2xl text-bone sm:text-3xl">Be first to know</h2>
            <p className="mt-3 max-w-md text-[0.9375rem] leading-relaxed text-muted">
              Announcements go out to the list first. One email when something is confirmed, nothing
              else.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <SocialLinks links={socials} />
              <Link
                to="/links"
                className="link-underline text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-muted hover:text-bone"
              >
                All links
                <ArrowUpRight aria-hidden="true" className="ml-1 inline size-3" />
              </Link>
            </div>
          </Reveal>

          <NewsletterForm />
        </div>
      </Section>

      {/* Past */}
      {past.length > 0 && (
        <Section index="—" eyebrow="Archive" title="Played" className="border-t border-line">
          <ul className="border-t border-line">
            {past.map((show) => (
              <ShowRow key={show.id} show={show} />
            ))}
          </ul>
        </Section>
      )}
    </>
  )
}
