import { ArrowUpRight, Download, Mail, Music } from 'lucide-react'
import { Link } from 'react-router-dom'

import {
  ARTIST_NAME,
  artist,
  latestRelease,
  navLinks,
  press,
  releases,
  socials,
  songs,
} from '../content'
import { getFilename } from '../lib/media'

import { BrandIcon } from '../components/BrandIcon'
import { CassetteArtwork } from '../components/art/CassetteArtwork'
import { DividerOrnament } from '../components/art/Doodles'
import { Button } from '../components/Button'
import { NewsletterForm } from '../components/form/NewsletterForm'
import { Reveal, Stagger } from '../components/Reveal'
import { Section } from '../components/Section'
import { Seo } from '../components/Seo'
import { SmartImage } from '../components/SmartImage'
import { motion } from 'framer-motion'
import { cardIn } from '../lib/motion'

/** One big tappable card per link, the way a link-in-bio page should work. */
type LinkCardProps = {
  id: string
  label: string
  handle?: string
  href: string
  icon?: React.ReactNode
  note?: string
  primary?: boolean
}

function LinkCard({ label, handle, href, icon, note, primary }: LinkCardProps) {
  const external = href.startsWith('http')

  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer noopener' : undefined}
      className={`group flex items-center gap-4 border px-5 py-4 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 ${
        primary
          ? 'border-blood bg-blood/[0.08] hover:shadow-[0_24px_60px_-28px_rgba(211,18,42,0.9)]'
          : 'border-line bg-surface hover:border-blood/70'
      }`}
    >
      <span
        className={`flex size-11 shrink-0 items-center justify-center rounded-[2px] border ${
          primary ? 'border-blood/50 text-blood' : 'border-line text-muted group-hover:text-blood'
        }`}
      >
        {icon ?? <ArrowUpRight aria-hidden="true" className="size-4" />}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-[0.9375rem] font-semibold text-bone">{label}</span>
        {handle && (
          <span className="type-accent block truncate text-[0.625rem] text-muted-dim">
            {handle}
          </span>
        )}
        {note && <span className="mt-0.5 block truncate text-[0.75rem] text-muted">{note}</span>}
      </span>

      <ArrowUpRight
        aria-hidden="true"
        className="size-4 shrink-0 text-muted-dim transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-blood"
      />
    </a>
  )
}

export default function Links() {
  const releaseLinks = (latestRelease?.links ?? []).concat(
    releases.flatMap((release) => release.links ?? []),
  )

  return (
    <>
      <Seo
        title="Links"
        description={`Every link for ${ARTIST_NAME} — music, socials, press and booking.`}
        path="/links"
      />

      <Section spacing="lg" className="pt-32 sm:pt-40">
        <div className="mx-auto max-w-2xl">
          {/* Header */}
          <Reveal className="text-center">
            <div className="relative mx-auto w-32">
              <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle,rgba(211,18,42,0.25),transparent_70%)]" />
              <SmartImage
                src={artist.heroImage}
                alt={artist.heroAlt}
                width={350}
                height={350}
                className="size-32 rounded-full object-cover"
                emptyLabel="No photo yet"
              />
            </div>

            <h1 className="mt-7 text-[clamp(2.5rem,10vw,4rem)] text-bone">{ARTIST_NAME}</h1>
            <p className="marker mt-2 text-lg text-blood sm:text-xl">{artist.tagline}</p>
            <p className="mt-3 text-sm text-muted">{artist.subTagline}</p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              {socials.map((social) => (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={`${ARTIST_NAME} on ${social.platform}`}
                  className="flex size-10 items-center justify-center rounded-[2px] border border-line text-muted transition-colors hover:border-blood hover:text-blood"
                >
                  <BrandIcon platform={social.platform} className="size-4" />
                </a>
              ))}
            </div>
          </Reveal>

          <DividerOrnament className="mx-auto my-9 h-3 w-40 text-line" />

          {/* Links */}
          <Stagger className="flex flex-col gap-3">
            {/* New music first */}
            {songs[0] && (
              <motion.div variants={cardIn}>
                <LinkCard
                  id="new"
                  label="Listen to the new music"
                  handle={songs[0].title}
                  href="/music"
                  icon={<Music aria-hidden="true" className="size-4" />}
                  primary
                />
              </motion.div>
            )}

            {/* Socials */}
            {socials.map((social) => (
              <motion.div key={social.id} variants={cardIn}>
                <LinkCard
                  id={social.id}
                  label={social.platform}
                  handle={social.handle}
                  href={social.url}
                  icon={<BrandIcon platform={social.platform} className="size-4" />}
                />
              </motion.div>
            ))}

            {/* Streaming, de-duplicated */}
            {releaseLinks
              .filter(
                (link, index, all) => all.findIndex((item) => item.url === link.url) === index,
              )
              .map((link) => (
                <motion.div key={link.url} variants={cardIn}>
                  <LinkCard
                    id={link.url}
                    label={`Listen on ${link.platform}`}
                    handle={link.label}
                    href={link.url}
                    icon={<BrandIcon platform={link.platform} className="size-4" />}
                  />
                </motion.div>
              ))}

            {/* Press */}
            <motion.div variants={cardIn}>
              <LinkCard
                id="press"
                label="Press kit"
                handle="Bio, facts, photos, one-sheet"
                href="/press"
                icon={<Download aria-hidden="true" className="size-4" />}
              />
            </motion.div>

            <motion.div variants={cardIn}>
              <a
                href={press.oneSheet}
                download={getFilename(press.oneSheet)}
                className="group flex items-center gap-4 border border-line bg-surface px-5 py-4 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-blood/70"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-[2px] border border-line text-muted group-hover:text-blood">
                  <Download aria-hidden="true" className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[0.9375rem] font-semibold text-bone">
                    {press.oneSheetLabel}
                  </span>
                  <span className="type-accent block truncate text-[0.625rem] text-muted-dim">
                    PDF · direct download
                  </span>
                </span>
              </a>
            </motion.div>

            {/* Booking */}
            <motion.div variants={cardIn}>
              <LinkCard
                id="book"
                label="Book"
                handle="Shows, features, collabs"
                href="/book"
                icon={<Mail aria-hidden="true" className="size-4" />}
                primary
              />
            </motion.div>
          </Stagger>

          {/* Newsletter */}
          <Reveal delay={0.1} className="mt-10 border border-line bg-surface p-6">
            <p className="kicker">Or join the crew</p>
            <p className="mt-2 text-[0.9375rem] text-bone-dim">
              One email when something new drops. No spam.
            </p>
            <NewsletterForm className="mt-4 max-w-none" />
          </Reveal>

          {/* Site map */}
          <Reveal delay={0.15} className="mt-10">
            <p className="kicker text-center">Or walk the site</p>
            <nav aria-label="Site pages" className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2">
              {navLinks
                .filter((link) => link.to !== '/')
                .map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="link-underline text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-muted hover:text-bone"
                  >
                    {link.label}
                  </Link>
                ))}
            </nav>
          </Reveal>

          <Reveal delay={0.2} className="mt-10">
            <CassetteArtwork stamp="LINK" />
          </Reveal>

          <div className="mt-10 text-center">
            <Button href={`mailto:${artist.email}`} variant="ghost" size="sm">
              {artist.email}
            </Button>
          </div>
        </div>
      </Section>
    </>
  )
}
