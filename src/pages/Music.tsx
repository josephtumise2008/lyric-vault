import { useState } from 'react'
import { Link } from 'react-router-dom'

import {
  ARTIST_NAME,
  artist,
  releases,
  songs,
  soundcloudTrackUrl,
  studioClips,
} from '../content'
import { toggleTrack } from '../lib/audioEngine'
import type { TrackPayload } from '../lib/audioEngine'

import { BoomboxArt, DividerOrnament } from '../components/art/Doodles'
import { VinylArtwork } from '../components/art/VinylArtwork'
import { Button } from '../components/Button'
import { PageHeader } from '../components/PageHeader'
import { ReleaseCard } from '../components/ReleaseCard'
import { Section } from '../components/Section'
import { Seo } from '../components/Seo'
import { StreamingLinks } from '../components/StreamingLinks'
import { AudioPlayer } from '../components/player/AudioPlayer'
import { TrackRow } from '../components/player/TrackRow'

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

const clipTracks: TrackPayload[] = studioClips.map((clip) => ({
  id: clip.id,
  title: clip.label,
  artist: ARTIST_NAME,
  src: clip.audio,
  album: 'Excerpt',
}))

/** Featured player for whichever song is selected at the top of the page. */
function NowPlaying({ track }: { track: TrackPayload }) {
  return (
    <div className="grid gap-8 lg:grid-cols-[auto_1fr] lg:items-center lg:gap-12">
      <div className="flex justify-center lg:justify-start">
        <VinylArtwork
          className="w-40 shadow-[0_20px_50px_-28px_rgba(0,0,0,0.9)] sm:w-52"
          spinning
        />
      </div>
      <AudioPlayer trackId={track.id} title={track.title} active onPlay={() => void toggleTrack(track)} />
    </div>
  )
}

export default function Music() {
  const tracks = songs.map(toTrack).filter((track): track is TrackPayload => track !== null)
  const [selectedId, setSelectedId] = useState(tracks[0]?.id ?? '')
  const selected = tracks.find((track) => track.id === selectedId) ?? tracks[0]

  return (
    <>
      <Seo
        title="Music"
        description={`Listen to ${ARTIST_NAME} — old-school rap. Full tracks, releases and studio clips.`}
        path="/music"
      />

      <PageHeader
        index="01"
        eyebrow="Music"
        title={
          <>
            Press play<span className="text-blood">.</span>
          </>
        }
        lede="Every track has its own player. Only one thing plays at a time, and nothing starts until you tap it."
      >
        <BoomboxArt className="h-16 w-28 text-blood/40" />
      </PageHeader>

      {/* Player */}
      <Section index="—" eyebrow="Now playing" spacing="md">
        {selected && <NowPlaying track={selected} />}
      </Section>

      {/* Releases */}
      {releases.length > 0 && (
        <Section
          index="01"
          eyebrow="Releases"
          title="Discography"
          description="Artwork, dates and a link to each platform. No play counts, no follower counts — those belong on the platforms."
        >
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {releases.map((release) => (
              <ReleaseCard key={release.id} release={release} />
            ))}
          </div>
        </Section>
      )}

      {/* Songs */}
      {tracks.length > 0 && (
        <Section index="02" eyebrow="Tracks" title="The songs" className="border-t border-line">
          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
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

            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="border border-line bg-surface p-5">
                <p className="kicker">Selected</p>
                <p className="mt-2 text-lg text-bone">{selected?.title ?? '—'}</p>
                {selected?.album && (
                  <p className="type-accent mt-1 text-[0.6875rem] text-muted-dim">
                    {selected.album}
                  </p>
                )}

                <div className="mt-5 flex flex-wrap gap-2">
                  {tracks.map((track) => (
                    <button
                      key={track.id}
                      type="button"
                      onClick={() => setSelectedId(track.id)}
                      aria-pressed={selectedId === track.id}
                      className={`rounded-[2px] border px-3 py-1.5 text-[0.625rem] font-semibold uppercase tracking-[0.12em] transition-colors ${
                        selectedId === track.id
                          ? 'border-blood bg-blood/15 text-bone'
                          : 'border-line text-muted hover:border-blood hover:text-bone'
                      }`}
                    >
                      {track.title}
                    </button>
                  ))}
                </div>

                <DividerOrnament className="my-5 h-3 w-full text-line" />

                <Link
                  to="/lyrics"
                  className="link-underline text-xs font-semibold uppercase tracking-[0.14em] text-muted hover:text-bone"
                >
                  Read the lyrics
                </Link>
              </div>
            </aside>
          </div>
        </Section>
      )}

      {/* Studio clips */}
      {clipTracks.length > 0 && (
        <Section
          index="03"
          eyebrow="Studio clips"
          title="Outtakes"
          description="Short excerpts straight from the room. Nothing polished, nothing finished."
          className="border-t border-line"
        >
          <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:gap-14">
            <div className="border-t border-line">
              {clipTracks.map((track, index) => (
                <TrackRow
                  key={track.id}
                  track={track}
                  index={index}
                  onPlay={(payload) => void toggleTrack(payload)}
                />
              ))}
            </div>

            <div className="flex flex-col gap-5">
              <div className="border border-line bg-surface p-5">
                <p className="kicker">Listening tip</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  Starting a clip stops whatever is playing. The player follows whichever track you
                  last pressed, whether that is a song or a clip.
                </p>
              </div>

              {soundcloudTrackUrl && (
                <div className="border border-line bg-surface p-2">
                  <iframe
                    title="SoundCloud player"
                    src={soundcloudTrackUrl}
                    width="100%"
                    height="166"
                    loading="lazy"
                    allow="autoplay"
                    className="block border-0"
                  />
                </div>
              )}

              {releases.some((release) => release.links?.length) && (
                <div>
                  <p className="kicker mb-3">Everywhere else</p>
                  <StreamingLinks
                    links={releases.flatMap((release) => release.links ?? [])}
                    size="sm"
                    labelPrefix={`${ARTIST_NAME} on`}
                  />
                </div>
              )}

              <Button to="/book" variant="outline">
                Book {artist.name}
              </Button>
            </div>
          </div>
        </Section>
      )}
    </>
  )
}
