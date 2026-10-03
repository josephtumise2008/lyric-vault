import { motion } from 'framer-motion'

import { useCountdown } from '../hooks/useCountdown'
import { cn } from '../lib/cn'
import { EASE, useMotionPrefs } from '../lib/motion'
import type { NextDrop } from '../types'

import { Button } from './Button'

type CountdownProps = {
  /** `null` or missing hides the whole section. */
  drop: NextDrop | null | undefined
  className?: string
}

const UNITS = [
  { key: 'days', label: 'Days' },
  { key: 'hours', label: 'Hours' },
  { key: 'minutes', label: 'Minutes' },
  { key: 'seconds', label: 'Seconds' },
] as const

function FlipDigit({ value, label }: { value: string; label: string }) {
  const { still } = useMotionPrefs()

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative flex h-16 w-14 items-center justify-center overflow-hidden border border-line bg-surface sm:h-20 sm:w-16">
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-1/2 h-px bg-line"
        />
        <motion.span
          key={value}
          aria-hidden="true"
          className="relative font-display text-3xl leading-none tabular-nums text-bone sm:text-4xl"
          initial={still ? false : { y: '-100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: still ? 0 : 0.4, ease: EASE }}
        >
          {value}
        </motion.span>
      </div>
      <span className="kicker text-[0.5625rem]">{label}</span>
    </div>
  )
}

/**
 * Countdown to the next drop.
 *
 * Returns nothing at all when no date has been announced — the section is
 * removed from the page rather than showing a placeholder timer.
 */
export function Countdown({ drop, className }: CountdownProps) {
  const parts = useCountdown(drop?.date)

  if (!drop || !drop.date || parts.done) return null

  const values = {
    days: String(parts.days),
    hours: String(parts.hours).padStart(2, '0'),
    minutes: String(parts.minutes).padStart(2, '0'),
    seconds: String(parts.seconds).padStart(2, '0'),
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden border border-line bg-surface px-5 py-8 sm:px-10 sm:py-12',
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="halftone pointer-events-none absolute inset-0 opacity-40"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-[radial-gradient(60%_100%_at_50%_0%,rgba(211,18,42,0.18),transparent_70%)]"
      />

      <div className="relative flex flex-col items-center gap-7 text-center">
        <div>
          <p className="kicker">{drop.label}</p>
          {drop.title && (
            <h3 className="mt-2 text-[clamp(1.5rem,4vw,2.25rem)] text-bone">{drop.title}</h3>
          )}
        </div>

        <div
          className="flex items-start gap-2 sm:gap-4"
          role="timer"
          aria-live="off"
          aria-label={`Countdown to ${drop.title ?? drop.label}`}
        >
          {UNITS.map((unit) => (
            <FlipDigit key={unit.key} value={values[unit.key]} label={unit.label} />
          ))}
        </div>

        {drop.url && (
          <Button href={drop.url} variant="outline" size="md">
            Follow for updates
          </Button>
        )}
      </div>
    </div>
  )
}
