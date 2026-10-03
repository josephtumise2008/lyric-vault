import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

import { cn } from '../lib/cn'
import { useMotionPrefs } from '../lib/motion'

type MarqueeProps = {
  children: ReactNode
  /** Seconds for one full pass. */
  duration?: number
  className?: string
  reverse?: boolean
}

/**
 * Infinite ticker used as a section divider — the closest thing to a mixtape
 * tape-loop. With reduced motion it degrades to one static, centred strip.
 */
export function Marquee({ children, duration = 38, className, reverse = false }: MarqueeProps) {
  const { still } = useMotionPrefs()

  if (still) {
    return (
      <div
        className={cn(
          'flex items-center justify-center overflow-hidden border-y border-line bg-ink-deep py-3',
          className,
        )}
      >
        <div className="kicker whitespace-nowrap px-6 text-bone/70">{children}</div>
      </div>
    )
  }

  return (
    <div
      aria-hidden="true"
      className={cn(
        'relative flex overflow-hidden border-y border-line bg-ink-deep py-3 select-none',
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-ink-deep to-transparent sm:w-32" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-ink-deep to-transparent sm:w-32" />

      <motion.div
        className="flex shrink-0 items-center"
        animate={{ x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }}
        transition={{ duration, ease: 'linear', repeat: Infinity }}
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center">
            {children}
          </div>
        ))}
      </motion.div>
    </div>
  )
}
