import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'

import { ARTIST_NAME, formatDate, lyrics, songs } from '../content'
import { toggleTrack } from '../lib/audioEngine'
import type { TrackPayload } from '../lib/audioEngine'

import { VinylArtwork } from '../components/art/VinylArtwork'
import { Button } from '../components/Button'
import { LyricsView } from '../components/lyrics/LyricsView'
import { Seo } from '../components/Seo'
import { ShareButton } from '../components/ShareButtons'
import { CopyLinkButton } from '../components/ShareButtons'
import { StreamingLinks } from '../components/StreamingLinks'
import { AudioPlayer } from '../components/player/AudioPlayer'

export default function LyricDetail() {
  const { slug } = useParams<{ slug: string }>()

  const index = songs.findIndex((song) => song.slug === slug)
  const song = index === -1 ? undefined : songs[index]
  const lyric = lyrics.find((entry) => entry.songSlug === slug)

  if (!song) {
    // Unknown slug — send the visitor to the index rather than a dead end.
    return <Navigate to="/lyrics" replace />
  }

  const previous = index > 0 ? songs[index - 1] : undefined
  const next = index < songs.length - 1 ? songs[index + 1] : undefined

  const track: TrackPayload | null = song.audio
    ? {
        id: song.id,
        title: song.title,
        artist: ARTIST_NAME,
        src: song.audio,
        album: song.releaseType,
        artwork: song.artwork,
      }
    : null

  const lines = lyric?.lines ?? []

  return (
    <>
      <Seo
        title={song.title}
        description={`Lyrics for ${song.title} by ${ARTIST_NAME}. ${song.subtitle ?? ''}`.trim()}
        path={`/lyrics/${song.slug}`}
        type="article"
        image={song.artwork}
      />

      {/* Breadcrumb */}
      <div className="border-b border-line bg-ink-deep pt-24 sm:pt-28">
        <div className="shell py-4">
          <Link
            to="/lyrics"
            className="inline-flex items-center gap-2 text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-muted transition-colors hover:text-bone"
          >
            <ArrowLeft aria-hidden="true" className="size-3.5" />
            All lyrics
          </Link>
        </div>
      </div>

      {/* Title block */}
      <header className="relative overflow-hidden border-b border-line py-14 sm:py-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 left-1/2 h-72 w-[min(80rem,150%)] -translate-x-1/2 bg-[radial-gradient(50%_60%_at_50%_50%,rgba(211,18,42,0.16),transparent_70%)]"
        />

        <div className="shell relative">
          <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:gap-14">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <span className="type-accent text-xs text-blood">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span aria-hidden="true" className="h-px w-8 bg-line" />
                <p className="kicker">{song.releaseType}</p>
              </div>

              <h1 className="text-[clamp(2.25rem,8vw,4.75rem)] text-bone">{song.title}</h1>

              <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
                <span className="type-accent text-[0.6875rem] text-muted-dim">
                  {lyric?.release ?? song.releaseType}
                </span>
                {song.releaseDate && (
                  <>
                    <span aria-hidden="true" className="text-line">
                      ·
                    </span>
                    <span className="type-accent text-[0.6875rem] text-muted-dim">
                      {formatDate(song.releaseDate)}
                    </span>
                  </>
                )}
                {lyric?.year && (
                  <>
                    <span aria-hidden="true" className="text-line">
                      ·
                    </span>
                    <span className="type-accent text-[0.6875rem] text-muted-dim">
                      {lyric.year}
                    </span>
                  </>
                )}
              </div>

              {song.subtitle && (
                <p className="marker mt-5 text-xl text-blood sm:text-2xl">{song.subtitle}</p>
              )}

              {song.description && (
                <p className="mt-6 max-w-xl text-[0.9375rem] leading-relaxed text-muted">
                  {song.description}
                </p>
              )}

              <div className="mt-8 flex flex-wrap items-center gap-2">
                <CopyLinkButton label="Copy link" />
                <ShareButton title={`${song.title} — ${ARTIST_NAME}`} />
                {song.links && song.links.length > 0 && (
                  <StreamingLinks links={song.links} size="sm" labelPrefix={`${song.title} on`} />
                )}
              </div>
            </div>

            <div className="flex flex-col gap-6 lg:items-end">
              <div className="flex items-center gap-6">
                <VinylArtwork className="w-28 sm:w-36" spinning labelClassName="bg-blood" />
                {track && (
                  <div className="hidden flex-1 sm:block">
                    <AudioPlayer
                      trackId={track.id}
                      title={track.title}
                      active
                      compact
                      onPlay={() => void toggleTrack(track)}
                      className="max-w-xs"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Lyrics */}
      <div className="shell py-16 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr] lg:gap-16">
          <section aria-labelledby="lyrics-heading">
            <h2 id="lyrics-heading" className="sr-only">
              Lyrics for {song.title}
            </h2>
            <LyricsView lines={lines} isComplete={lyric?.isComplete} />
          </section>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            {/* Song story */}
            {(lyric?.story ?? song.story) && (
              <div className="border border-line bg-surface p-5">
                <h2 className="kicker mb-3">Song story</h2>
                <p className="type-accent text-[0.9375rem] leading-relaxed text-bone-dim">
                  {lyric?.story ?? song.story}
                </p>
              </div>
            )}

            {/* Credits */}
            {song.credits && song.credits.length > 0 && (
              <div className="mt-6 border border-line bg-surface p-5">
                <h2 className="kicker mb-3">Credits</h2>
                <ul className="space-y-1.5">
                  {song.credits.map((credit) => (
                    <li key={credit} className="text-[0.8125rem] leading-relaxed text-muted">
                      {credit}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tags */}
            {(lyric?.tags ?? song.tags) && (lyric?.tags ?? song.tags)!.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {(lyric?.tags ?? song.tags)!.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-[2px] border border-line px-2.5 py-1 text-[0.625rem] font-semibold uppercase tracking-[0.12em] text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-6">
              <Button to="/book" variant="primary" className="w-full">
                Book {ARTIST_NAME}
              </Button>
            </div>
          </aside>
        </div>

        {/* Previous / next */}
        <nav
          aria-label="Song navigation"
          className="mt-16 grid gap-px border border-line bg-line sm:grid-cols-2"
        >
          {previous ? (
            <Link
              to={`/lyrics/${previous.slug}`}
              className="group flex items-center gap-4 bg-surface px-5 py-5 transition-colors hover:bg-surface-2"
            >
              <ArrowLeft
                aria-hidden="true"
                className="size-4 shrink-0 text-muted-dim transition-transform duration-300 group-hover:-translate-x-1 group-hover:text-blood"
              />
              <span className="min-w-0">
                <span className="kicker block text-[0.5625rem]">Previous</span>
                <span className="mt-1 block truncate text-sm text-bone">{previous.title}</span>
              </span>
            </Link>
          ) : (
            <span aria-hidden="true" className="hidden bg-surface-2/40 sm:block" />
          )}

          {next ? (
            <Link
              to={`/lyrics/${next.slug}`}
              className="group flex items-center justify-end gap-4 bg-surface px-5 py-5 text-right transition-colors hover:bg-surface-2"
            >
              <span className="min-w-0">
                <span className="kicker block text-[0.5625rem]">Next</span>
                <span className="mt-1 block truncate text-sm text-bone">{next.title}</span>
              </span>
              <ArrowRight
                aria-hidden="true"
                className="size-4 shrink-0 text-muted-dim transition-transform duration-300 group-hover:translate-x-1 group-hover:text-blood"
              />
            </Link>
          ) : (
            <span aria-hidden="true" className="hidden bg-surface-2/40 sm:block" />
          )}
        </nav>
      </div>
    </>
  )
}
