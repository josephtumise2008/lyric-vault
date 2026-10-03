import { motion } from 'framer-motion'

import { cn } from '../../lib/cn'
import { useMotionPrefs } from '../../lib/motion'

type LyricsViewProps = {
  lines: string[]
  /** False while the artist has not supplied the real words yet. */
  isComplete?: boolean
  className?: string
}

const SECTION_PATTERN = /^\[.+\]$/

function isSectionLabel(line: string): boolean {
  return SECTION_PATTERN.test(line.trim())
}

/**
 * Lyric body with a typewriter-inspired reveal.
 *
 * Lines rise into place one after another as the block scrolls in, capped so a
 * long lyric never becomes a slow crawl. Section headers written as
 * `[Brackets]` are detected and styled as headings.
 *
 * With reduced motion every line renders immediately.
 */
export function LyricsView({ lines, isComplete = true, className }: LyricsViewProps) {
  const { still } = useMotionPrefs()

  // A single pending token is not a lyric — it is a status message.
  const pending = !isComplete || (lines.length === 1 && isSectionLabel(lines[0] ?? ''))

  if (pending) {
    return (
      <div className={cn('border border-dashed border-gold/35 bg-gold/[0.04] p-6 sm:p-8', className)}>
        <p className="kicker text-gold">Lyrics pending</p>
        <p className="type-accent mt-3 text-lg text-bone-dim">
          {lines[0] ?? '[ARTIST TO PROVIDE LYRICS]'}
        </p>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
          These words belong to the artist and have not been supplied yet. They will appear here
          as soon as they are — nothing on this page is written on their behalf.
        </p>
      </div>
    )
  }

  const visible = lines.filter((line) => line.trim().length > 0)

  return (
    <div className={cn('max-w-2xl', className)}>
      {visible.map((line, index) => {
        const section = isSectionLabel(line)
        return (
          <motion.p
            key={`${index}-${line}`}
            initial={still ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{
              duration: still ? 0 : 0.45,
              // Cap the stagger so long lyrics stay snappy.
              delay: still ? 0 : Math.min(index * 0.045, 1.1),
              ease: [0.16, 1, 0.3, 1],
            }}
            className={cn(
              section
                ? 'marker mt-8 text-lg text-gold first:mt-0'
                : 'type-accent text-[1.0625rem] leading-[1.9] text-bone-dim sm:text-[1.125rem]',
            )}
          >
            {section ? line.replace(/[[\]]/g, '') : line}
          </motion.p>
        )
      })}
    </div>
  )
}
