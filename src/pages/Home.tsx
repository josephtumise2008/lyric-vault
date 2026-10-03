import { ArrowUpRight, Mic } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

import {
  ARTIST_NAME,
  LYRICS_PENDING,
  artist,
  latestRelease,
  newsletter,
  nextDrop,
  songs,
} from '../content'
import { toggleTrack } from '../lib/audioEngine'
import type { TrackPayload } from '../lib/audioEngine'
import { cardIn } from '../lib/motion'

import { Button } from '../components/Button'
import { CassetteArtwork } from '../components/art/CassetteArtwork'
import { MicrophoneArt } from '../components/art/Doodles'
import { Countdown } from '../components/Countdown'
import { Hero } from '../components/Hero'
import { Marquee } from '../components/Marquee'
import { Reveal, Stagger } from '../components/Reveal'
import { Section } from '../components/Section'
import { Seo } from '../components/Seo'
import { StreamingLinks } from '../components/StreamingLinks'
import { SmartImage } from '../components/SmartImage'
import { AudioPlayer } from '../components/player/AudioPlayer'
import { TrackRow } from '../components/player/TrackRow'
import { NewsletterForm } from '../components/form/NewsletterForm'

function toTrack(song: (typeof songs)[number]): TrackPayload | null {
  if (!song.audio) return null
  return {
    id: song.id,
    title: song.title,
    artist: ARTIST_NAME,
    src: song.audio,
    album: song.releaseType,
    artwork: song.artwork,
  }
}

/* -------------------------------------------------------------------------- */
/* Latest release                                                              */
/* -------------------------------------------------------------------------- */

function LatestRelease() {
  const playable = songs.find((song) => song.id === latestRelease?.id) ?? songs[0]
  const track = playable ? toTrack(playable) : null

  if (!latestRelease) return null

  const trackNumber = playable ? String(songs.indexOf(playable) + 1).padStart(2, '0') : '01'

  return (
    <Section
      id="latest-release"
      index="01"
      eyebrow="Latest release"
      title={latestRelease.title}
      description={latestRelease.description}
      action={
        <Button to="/music" variant="outline" size="md">
          All music
        </Button>
      }
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-12">
        {/* Artwork — kept at a size the file can actually fill */}
        <Reveal className="flex justify-center lg:justify-start">
          <div className="w-full max-w-[19rem]">
            <div className="media-frame relative aspect-square">
              <SmartImage
                src={latestRelease.artwork ?? ''}
                alt={`Cover artwork for ${latestRelease.title}`}
                width={800}
                height={800}
                sizes="(min-width: 1024px) 19rem, 80vw"
                className="h-full w-full"
                emptyLabel="Artwork coming soon"
              />
              <span className="kicker absolute left-3 top-3 bg-ink/80 px-2 py-1 text-[0.5625rem] backdrop-blur-sm">
                {latestRelease.type}
              </span>
            </div>

            <div className="mt-4 hidden lg:block">
              <CassetteArtwork stamp={trackNumber} />
            </div>
          </div>
        </Reveal>

        {/* Player + metadata */}
        <div className="flex flex-col gap-7">
          <Reveal delay={0.05}>
            <dl className="grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-3">
              {[
                { label: 'Type', value: latestRelease.type },
                {
                  label: 'Released',
                  value:
                    latestRelease.releaseDate
                      ? new Date(latestRelease.releaseDate).getFullYear().toString()
                      : 'Unannounced',
                },
                { label: 'Artist', value: ARTIST_NAME },
              ].map((item) => (
                <div key={item.label} className="bg-surface px-4 py-3.5">
                  <dt className="kicker text-[0.5625rem]">{item.label}</dt>
                  <dd className="mt-1 text-sm text-bone">{item.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          {track && playable && (
            <Reveal delay={0.1}>
              <AudioPlayer
                trackId={track.id}
                title={track.title}
                active
                onPlay={() => void toggleTrack(track)}
              />
            </Reveal>
          )}

          {latestRelease.tracklist && latestRelease.tracklist.length > 0 && (
            <Reveal delay={0.15}>
              <div>
                <h3 className="kicker mb-3">Tracklist</h3>
                <ul className="border-t border-line">
                  {latestRelease.tracklist.map((item, index) => (
                    <li
                      key={item.title}
                      className="flex items-baseline gap-4 border-b border-line py-2.5 text-[0.875rem] text-muted"
                    >
                      <span className="type-accent shrink-0 text-[0.6875rem] text-muted-dim">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="truncate text-bone-dim">{item.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          )}

          {latestRelease.links && latestRelease.links.length > 0 && (
            <Reveal delay={0.2}>
              <div>
                <h3 className="kicker mb-3">Listen everywhere</h3>
                <StreamingLinks links={latestRelease.links} labelPrefix={latestRelease.title} />
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </Section>
  )
}

/* -------------------------------------------------------------------------- */
/* Fresh lyrics                                                                */
/* -------------------------------------------------------------------------- */

function FreshLyrics() {
  if (songs.length === 0) return null

  return (
    <Section
      index="03"
      eyebrow="Fresh lyrics"
      title="Words first"
      description="Every song gets its own page. Nothing is written on the artist's behalf — where lyrics have not been supplied, that page says so plainly."
      action={
        <Button to="/lyrics" variant="outline" size="md">
          All lyrics
        </Button>
      }
    >
      <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {songs.slice(0, 3).map((song, index) => (
          <motion.article key={song.id} variants={cardIn}>
            <Link
              to={`/lyrics/${song.slug}`}
              className="group flex h-full flex-col justify-between border border-line bg-surface p-5 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-blood hover:shadow-[0_24px_60px_-28px_rgba(211,18,42,0.85)]"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <span className="type-accent text-[0.6875rem] text-muted-dim">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-4 shrink-0 text-muted-dim transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-blood"
                  />
                </div>

                <h3 className="mt-6 text-xl text-bone transition-colors group-hover:text-blood">
                  {song.title}
                </h3>

                {song.subtitle && (
                  <p className="type-accent mt-1.5 text-[0.6875rem] text-muted-dim">
                    {song.subtitle}
                  </p>
                )}
              </div>

              <div className="mt-8 flex items-center gap-2 border-t border-line pt-4">
                <Mic aria-hidden="true" className="size-3.5 shrink-0 text-muted-dim" />
                <span className="type-accent truncate text-[0.6875rem] text-muted-dim">
                  {LYRICS_PENDING}
                </span>
              </div>
            </Link>
          </motion.article>
        ))}
      </Stagger>
    </Section>
  )
}

/* -------------------------------------------------------------------------- */
/* Track strip                                                                 */
/* -------------------------------------------------------------------------- */

function TrackStrip() {
  const tracks = songs
    .map(toTrack)
    .filter((track): track is TrackPayload => track !== null)

  if (tracks.length === 0) return null

  return (
    <section aria-labelledby="track-strip-heading" className="border-y border-line bg-ink-deep py-14">
      <div className="shell">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="kicker">02 — On the tape</p>
            <h2 id="track-strip-heading" className="mt-2 text-3xl text-bone sm:text-4xl">
              Tracks
            </h2>
          </div>
          <MicrophoneArt className="hidden h-14 w-24 text-blood/40 sm:block" />
        </div>

        <div className="border-t border-line">
          {tracks.map((track, index) => (
            <TrackRow
              key={track.id}
              track={track}
              index={index}
              onPlay={(payload) => void toggleTrack(payload)}
            />
          ))}
        </div>

        <p className="mt-5 text-xs text-muted-dim">
          One track at a time — starting another stops this one. Every control is a real button, so
          <kbd className="type-accent"> Tab </kbd>
          reaches them and
          <kbd className="type-accent"> Enter </kbd>
          or
          <kbd className="type-accent"> Space </kbd>
          plays.
        </p>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* Newsletter                                                                  */
/* -------------------------------------------------------------------------- */

function JoinTheCrew() {
  return (
    <Section id="join" index="04" eyebrow="Mailing list" title={newsletter.heading}>
      <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
        <Reveal>
          <div className="relative">
            <div
              aria-hidden="true"
              className="halftone absolute -inset-4 opacity-40"
            />
            <div className="relative border border-line bg-surface p-6 sm:p-8">
              <p className="marker text-2xl text-gold sm:text-3xl">{newsletter.copy}</p>
              <p className="type-accent mt-4 text-sm leading-relaxed text-muted">
                New music goes out here before anywhere else. That is the whole deal.
              </p>
              <CassetteArtwork className="mt-6" stamp="JOIN" />
            </div>
          </div>
        </Reveal>

        <NewsletterForm className="lg:pt-4" />
      </div>
    </Section>
  )
}

/* -------------------------------------------------------------------------- */
/* Page                                                                        */
/* -------------------------------------------------------------------------- */

export default function Home() {
  return (
    <>
      <Seo
        description={`${artist.tagline} ${artist.subTagline} Listen to the music, read the lyrics, and book ${ARTIST_NAME}.`}
        path="/"
      />

      <Hero />

      <Marquee duration={44}>
        <span className="marker px-6 text-lg text-blood">{ARTIST_NAME}</span>
        <span aria-hidden="true" className="px-5 font-display text-lg text-bone/30">
          ✦
        </span>
        <span className="kicker px-6 text-bone/60">{artist.subTagline}</span>
        <span aria-hidden="true" className="px-5 font-display text-lg text-bone/30">
          ✦
        </span>
        <span className="kicker px-6 text-bone/60">{artist.genre}</span>
        <span aria-hidden="true" className="px-5 font-display text-lg text-bone/30">
          ✦
        </span>
      </Marquee>

      <LatestRelease />

      <TrackStrip />

      {nextDrop && (
        <Section index="—">
          <Reveal>
            <p className="kicker mb-6 text-center">Next drop</p>
            <Countdown drop={nextDrop} className="mx-auto max-w-2xl" />
          </Reveal>
        </Section>
      )}

      <FreshLyrics />

      <JoinTheCrew />
    </>
  )
}
