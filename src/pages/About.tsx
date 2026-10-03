import { ArrowLeft, ArrowRight, Maximize2 } from 'lucide-react'
import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'

import {
  ARTIST_NAME,
  PLACEHOLDER,
  artist,
  collection,
  collectionHeading,
  gallery,
} from '../content'
import { cn } from '../lib/cn'

import { SpeechBubbleArt } from '../components/art/Doodles'
import { Button } from '../components/Button'
import { Lightbox } from '../components/Lightbox'
import { MediaGrid } from '../components/MediaGrid'
import { PageHeader } from '../components/PageHeader'
import { Reveal } from '../components/Reveal'
import { Section } from '../components/Section'
import { Seo } from '../components/Seo'
import { SmartImage } from '../components/SmartImage'

/**
 * Gallery thumbnail that opens the lightbox.
 *
 * Photographs are around 350px wide, so they are shown at close to their own
 * size and framed — never scaled up to fill a screen or stretched to a ratio
 * the file does not have.
 */
function GalleryTrigger({
  item,
  index,
  onOpen,
}: {
  item: (typeof gallery)[number]
  index: number
  onOpen: (index: number) => void
}) {
  return (
    <figure className="group relative">
      <button
        type="button"
        onClick={() => onOpen(index)}
        aria-label={`View larger: ${item.caption ?? item.alt}`}
        className="block w-full cursor-zoom-in overflow-hidden"
      >
        <SmartImage
          src={item.src}
          alt={item.alt}
          width={item.width}
          height={item.height}
          className={cn(
            'w-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]',
            item.aspect === '4/3' ? 'aspect-[4/3]' : 'aspect-[4/5]',
          )}
          sizes="(min-width: 1024px) 20rem, (min-width: 640px) 33vw, 50vw"
        />
      </button>

      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-2 top-2 flex size-8 items-center justify-center rounded-[2px] bg-ink/75 text-bone opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100"
      >
        <Maximize2 className="size-3.5" />
      </span>

      {item.caption && (
        <figcaption className="type-accent mt-2 truncate text-[0.625rem] text-muted-dim">
          {item.caption}
        </figcaption>
      )}
    </figure>
  )
}

function Collection() {
  if (collection.length === 0) {
    return (
      <div className="relative overflow-hidden border border-dashed border-line px-6 py-14">
        <div aria-hidden="true" className="halftone absolute inset-0 opacity-25" />
        <div className="relative flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
          <SpeechBubbleArt className="h-14 w-20 shrink-0 text-gold/50" />
          <div>
            <p className="marker text-2xl text-gold">{collectionHeading.title}</p>
            <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">
              {collectionHeading.emptyLabel} — photographs of the collection will be added here
              as they are taken.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <p className="mb-6 max-w-2xl text-[0.9375rem] leading-relaxed text-muted">
        {collectionHeading.intro}
      </p>

      <MediaGrid
        items={collection}
        columns={4}
        variant="frame"
        emptyMessage={collectionHeading.emptyLabel}
      />
    </div>
  )
}

export default function About() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const openLightbox = useCallback((index: number) => setLightboxIndex(index), [])
  const closeLightbox = useCallback(() => setLightboxIndex(null), [])

  const hasPlaceholderBio = artist.bioLong.some((paragraph) => paragraph.includes(PLACEHOLDER))

  return (
    <>
      <Seo
        title="About"
        description={`The story behind ${ARTIST_NAME} — ${artist.tagline} ${artist.subTagline}`}
        path="/about"
      />

      <PageHeader
        index="05"
        eyebrow="About"
        title={
          <>
            The story<span className="text-blood">.</span>
          </>
        }
        lede={artist.tagline}
      />

      {/* Bio + portrait */}
      <Section index="01" eyebrow="Who" spacing="md">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
          <Reveal>
            <div className="space-y-5">
              <p className="type-accent text-lg leading-relaxed text-bone">{artist.bioShort}</p>
              {artist.bioLong.map((paragraph) => (
                <p key={paragraph} className="text-[0.9375rem] leading-relaxed text-muted">
                  {paragraph}
                </p>
              ))}
            </div>

            {hasPlaceholderBio && (
              <p className="mt-8 border border-gold/30 bg-gold/[0.05] px-4 py-3 text-[0.8125rem] leading-relaxed text-bone-dim">
                <span className="font-semibold uppercase tracking-[0.14em] text-gold">
                  Placeholder copy.
                </span>{' '}
                The biography above is standing in. Replace{' '}
                <code className="type-accent text-bone">artist.bioShort</code> and{' '}
                <code className="type-accent text-bone">artist.bioLong</code> in{' '}
                <code className="type-accent text-bone">src/content.ts</code>.
              </p>
            )}

            <dl className="mt-10 grid gap-px border border-line bg-line sm:grid-cols-3">
              {[
                { label: 'From', value: artist.origin },
                { label: 'Genre', value: artist.genre },
                { label: 'Label', value: artist.label },
              ].map((fact) => (
                <div key={fact.label} className="bg-surface px-4 py-4">
                  <dt className="kicker text-[0.5625rem]">{fact.label}</dt>
                  <dd className="mt-1 text-sm text-bone">{fact.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button to="/music" variant="primary">
                Listen
              </Button>
              <Button to="/book" variant="outline">
                Book {ARTIST_NAME}
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <div className="relative mx-auto w-full max-w-sm">
              <div
                aria-hidden="true"
                className="absolute -inset-3 -rotate-2 bg-gold/[0.06]"
              />
              <div className="relative border border-line bg-surface p-3">
                <SmartImage
                  src={artist.aboutImage}
                  alt={artist.aboutAlt}
                  width={700}
                  height={875}
                  className="aspect-[4/5] w-full"
                  sizes="(min-width: 1024px) 24rem, 90vw"
                />
                <p className="type-accent mt-3 px-1 text-[0.625rem] text-muted-dim">
                  {artist.name} — {artist.genre}, {artist.origin}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Gallery */}
      <Section
        index="02"
        eyebrow="Gallery"
        title="In the frame"
        description="Photographs from the archive. Tap any one to open it larger."
        className="border-t border-line"
      >
        <MediaGrid
          items={gallery}
          columns={3}
          variant="frame"
          animate={false}
          showMeta={false}
          renderItem={(item, index) => (
            <GalleryTrigger
              item={item as (typeof gallery)[number]}
              index={index}
              onOpen={openLightbox}
            />
          )}
        />
      </Section>

      {/* The collection */}
      <Section index="03" eyebrow="Off the clock" className="border-t border-line">
        <Collection />
      </Section>
      {/* Close */}
      <Section index="—" eyebrow="Next" spacing="md" className="border-t border-line">
        <div className="grid gap-px border border-line bg-line sm:grid-cols-2">
          <Link
            to="/music"
            className="group flex items-center gap-4 bg-surface px-6 py-7 transition-colors hover:bg-surface-2"
          >
            <ArrowLeft
              aria-hidden="true"
              className="size-4 shrink-0 text-muted-dim transition-transform duration-300 group-hover:-translate-x-1 group-hover:text-blood"
            />
            <span>
              <span className="kicker block text-[0.5625rem]">Back to</span>
              <span className="mt-1 block text-lg text-bone">Music</span>
            </span>
          </Link>

          <Link
            to="/book"
            className="group flex items-center justify-end gap-4 bg-surface px-6 py-7 text-right transition-colors hover:bg-surface-2"
          >
            <span>
              <span className="kicker block text-[0.5625rem]">Forward to</span>
              <span className="mt-1 block text-lg text-bone">Book {ARTIST_NAME}</span>
            </span>
            <ArrowRight
              aria-hidden="true"
              className="size-4 shrink-0 text-muted-dim transition-transform duration-300 group-hover:translate-x-1 group-hover:text-blood"
            />
          </Link>
        </div>
      </Section>

      <Lightbox
        items={gallery}
        activeIndex={lightboxIndex}
        onClose={closeLightbox}
        onNavigate={setLightboxIndex}
      />
    </>
  )
}
