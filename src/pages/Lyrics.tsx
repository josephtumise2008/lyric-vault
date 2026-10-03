import { Search, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { ARTIST_NAME, LYRICS_PENDING, formatDate, lyrics, lyricTags, songs } from '../content'
import { cn } from '../lib/cn'

import { CassetteArt } from '../components/art/Doodles'
import { PageHeader } from '../components/PageHeader'
import { Section } from '../components/Section'
import { Seo } from '../components/Seo'

export default function Lyrics() {
  const [query, setQuery] = useState('')
  const [activeTag, setActiveTag] = useState<string | null>(null)

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase()

    return songs.filter((song) => {
      const lyric = lyrics.find((entry) => entry.songSlug === song.slug)

      if (activeTag) {
        const tags = lyric?.tags ?? song.tags ?? []
        if (!tags.includes(activeTag)) return false
      }

      if (!needle) return true

      const haystack = [
        song.title,
        song.subtitle ?? '',
        song.description ?? '',
        ...(lyric?.tags ?? []),
      ]
        .join(' ')
        .toLowerCase()

      return haystack.includes(needle)
    })
  }, [query, activeTag])

  const hasFilters = Boolean(query.trim() || activeTag)

  return (
    <>
      <Seo
        title="Lyrics"
        description={`Read the lyrics of ${ARTIST_NAME}. Old-school rap, written by hand.`}
        path="/lyrics"
      />

      <PageHeader
        index="02"
        eyebrow="Lyrics"
        title="Every word"
        lede="One page per song. Lyrics appear here exactly as the artist writes them — nothing is filled in on their behalf."
      >
        <CassetteArt className="h-16 w-28 text-blood/40" />
      </PageHeader>

      <Section spacing="md">
        {/* Search + filters */}
        <div className="mb-10 flex flex-col gap-5">
          <div className="relative">
            <label className="sr-only" htmlFor="lyric-search">
              Search songs
            </label>
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-dim"
            />
            <input
              id="lyric-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search songs…"
              className="h-12 w-full rounded-[2px] border border-line bg-surface pl-11 pr-11 text-[0.9375rem] text-bone placeholder:text-muted-dim transition-colors duration-300 hover:border-surface-3 focus:border-blood focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-[2px] text-muted transition-colors hover:text-bone"
              >
                <X aria-hidden="true" className="size-4" />
              </button>
            )}
          </div>

          {lyricTags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="kicker mr-1">Tags</span>
              <button
                type="button"
                onClick={() => setActiveTag(null)}
                aria-pressed={activeTag === null}
                className={cn(
                  'rounded-[2px] border px-3 py-1.5 text-[0.625rem] font-semibold uppercase tracking-[0.12em] transition-colors',
                  activeTag === null
                    ? 'border-blood bg-blood/15 text-bone'
                    : 'border-line text-muted hover:border-blood hover:text-bone',
                )}
              >
                All
              </button>
              {lyricTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                  aria-pressed={activeTag === tag}
                  className={cn(
                    'rounded-[2px] border px-3 py-1.5 text-[0.625rem] font-semibold uppercase tracking-[0.12em] transition-colors',
                    activeTag === tag
                      ? 'border-blood bg-blood/15 text-bone'
                      : 'border-line text-muted hover:border-blood hover:text-bone',
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Results */}
        {results.length === 0 ? (
          <div className="border border-dashed border-line px-6 py-16 text-center">
            <p className="type-accent text-sm text-muted">
              {hasFilters
                ? 'Nothing matches that search.'
                : 'No lyrics published yet — they will appear here as soon as they are ready.'}
            </p>
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((song, index) => {
              const lyric = lyrics.find((entry) => entry.songSlug === song.slug)
              const pending = !lyric?.isComplete

              return (
                <li key={song.id}>
                  <Link
                    to={`/lyrics/${song.slug}`}
                    className="group flex h-full flex-col justify-between border border-line bg-surface p-5 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-blood hover:shadow-[0_24px_60px_-28px_rgba(211,18,42,0.85)]"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <span className="type-accent text-[0.6875rem] text-muted-dim">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        {song.releaseDate && (
                          <span className="type-accent text-[0.6875rem] text-muted-dim">
                            {formatDate(song.releaseDate)}
                          </span>
                        )}
                      </div>

                      <h2 className="mt-6 text-xl text-bone transition-colors group-hover:text-blood">
                        {song.title}
                      </h2>

                      <p className="kicker mt-2 text-[0.5625rem]">{song.releaseType}</p>
                    </div>

                    <div className="mt-8 border-t border-line pt-4">
                      <p
                        className={cn(
                          'type-accent truncate text-[0.6875rem]',
                          pending ? 'text-gold/80' : 'text-muted',
                        )}
                      >
                        {pending ? LYRICS_PENDING : `${lyric?.lines.length ?? 0} lines`}
                      </p>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </Section>
    </>
  )
}
