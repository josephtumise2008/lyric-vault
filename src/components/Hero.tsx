import { motion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'

import { ARTIST_NAME, artist, socials } from '../content'
import { cn } from '../lib/cn'
import { EASE, useMotionPrefs } from '../lib/motion'

import { VinylArtwork } from './art/VinylArtwork'
import { Button } from './Button'
import { SocialLinks } from './SocialLinks'
import { SmartImage } from './SmartImage'

/** Splits the name so each letter can drop in on its own. */
function AnimatedName({ name }: { name: string }) {
  const { still } = useMotionPrefs()
  const letters = [...name]

  if (still) {
    return (
      <h1 className="font-display text-[clamp(3rem,15vw,9rem)] leading-[0.85] text-bone">
        {name}
      </h1>
    )
  }

  return (
    <h1 className="font-display text-[clamp(3rem,15vw,9rem)] leading-[0.85] text-bone">
      <span className="sr-only">{name}</span>
      <span aria-hidden="true" className="inline-flex flex-wrap">
        {letters.map((letter, index) => (
          <motion.span
            key={`${letter}-${index}`}
            custom={index}
            variants={{
              hidden: { opacity: 0, y: '0.4em', rotate: -6 },
              visible: {
                opacity: 1,
                y: 0,
                rotate: 0,
                transition: { duration: 0.55, delay: 0.06 * index, ease: EASE },
              },
            }}
            initial="hidden"
            animate="visible"
            className="inline-block"
          >
            {letter === ' ' ? ' ' : letter}
          </motion.span>
        ))}
      </span>
    </h1>
  )
}

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

/**
 * Homepage hero.
 *
 * The supplied photograph is a small file, so it is presented as a taped-down
 * print inside a bounded frame rather than stretched across the viewport. The
 * atmosphere comes from the record, the halftone and the type instead.
 */
export function Hero() {
  const { still } = useMotionPrefs()

  return (
    <section className="relative overflow-hidden border-b border-line pt-28 sm:pt-32">
      {/* Atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_55%_at_78%_18%,rgba(211,18,42,0.22),transparent_65%)]"
      />
      <div aria-hidden="true" className="halftone pointer-events-none absolute inset-0 opacity-[0.55]" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-line/60"
      />

      {/* Slow record, drifting in the background */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-10 hidden opacity-[0.16] lg:block"
        animate={still ? undefined : { rotate: 360 }}
        transition={still ? undefined : { duration: 60, ease: 'linear', repeat: Infinity }}
      >
        <VinylArtwork className="size-[34rem]" labelClassName="bg-blood" />
      </motion.div>

      <div className="shell relative">
        <div className="grid items-center gap-12 pb-16 lg:grid-cols-[1.35fr_1fr] lg:gap-16 lg:pb-24">
          {/* Copy */}
          <div>
            <motion.p
              className="kicker mb-6 flex items-center gap-3"
              initial={still ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.05 }}
            >
              <span aria-hidden="true" className="h-px w-8 bg-blood" />
              {artist.subTagline}
            </motion.p>

            <AnimatedName name={ARTIST_NAME} />

            <motion.p
              className="marker mt-6 text-2xl text-blood sm:text-3xl"
              initial={still ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35, ease: EASE }}
            >
              {artist.tagline}
            </motion.p>

            <motion.p
              className="type-accent mt-5 max-w-md text-[0.9375rem] leading-relaxed text-muted sm:text-base"
              initial={still ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45, ease: EASE }}
            >
              {artist.bioShort}
            </motion.p>

            <motion.div
              className="mt-9 flex flex-wrap items-center gap-3"
              initial={still ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55, ease: EASE }}
            >
              <Button to="/music" variant="primary" size="lg">
                Listen Now
              </Button>
              <Button to="/lyrics" variant="outline" size="lg">
                Read the Lyrics
              </Button>
              <Button to="/book" variant="ghost" size="lg">
                Book Me
              </Button>
            </motion.div>

            <motion.div
              className="mt-10 border-t border-line pt-6"
              initial={still ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.65 }}
            >
              <p className="kicker mb-3">Follow</p>
              <SocialLinks links={socials} />
            </motion.div>
          </div>

          {/* Photograph — bounded so a low-resolution file stays sharp */}
          <motion.div
            className="relative flex justify-center lg:justify-end"
            initial={still ? false : { opacity: 0, y: 24, rotate: -2 }}
            animate={{ opacity: 1, y: 0, rotate: -1.2 }}
            transition={{ duration: 0.8, delay: 0.25, ease: EASE }}
          >
            <div className="tape-frame w-full max-w-[17.5rem] sm:max-w-[20rem]">
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-ink-deep">
                <SmartImage
                  src={artist.heroImage}
                  alt={artist.heroAlt}
                  width={350}
                  height={438}
                  priority
                  sizes="(min-width: 1024px) 20rem, 17.5rem"
                  className="h-full w-full"
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-3 pb-2.5">
                <span className="type-accent text-[0.625rem] text-muted-dim">
                  {ARTIST_NAME}
                </span>
                <span className="type-accent text-[0.625rem] text-blood">01</span>
              </div>
              {/* Tape strips */}
              <span
                aria-hidden="true"
                className="absolute -top-3 left-8 h-6 w-20 -rotate-3 bg-blood/25 backdrop-blur-[1px]"
              />
              <span
                aria-hidden="true"
                className="absolute -top-3 right-8 h-6 w-20 rotate-2 bg-gold/20 backdrop-blur-[1px]"
              />
            </div>

            <span
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-4 -left-2 hidden font-display text-[7rem] leading-none text-bone/[0.05] lg:block"
            >
              19
            </span>
          </motion.div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="relative border-t border-line">
        <div className="shell flex items-center justify-between py-4">
          <p className="kicker">Scroll</p>
          <button
            type="button"
            onClick={() => scrollToId('latest-release')}
            aria-label="Scroll to the latest release"
            className="group flex items-center gap-2 text-muted transition-colors hover:text-bone"
          >
            <span className="kicker group-hover:text-bone">Latest release</span>
            <motion.span
              animate={still ? undefined : { y: [0, 4, 0] }}
              transition={still ? undefined : { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              className="flex size-8 items-center justify-center rounded-[2px] border border-line group-hover:border-blood"
            >
              <ArrowDown aria-hidden="true" className="size-3.5" />
            </motion.span>
          </button>
        </div>
      </div>
    </section>
  )
}

/** Small strip used between homepage sections. */
export function TapeStrip({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('hatch border-y border-line bg-ink-deep py-3', className)}>{children}</div>
  )
}
