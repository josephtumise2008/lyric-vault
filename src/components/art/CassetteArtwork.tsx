import { motion } from 'framer-motion'

import { useMotionPrefs } from '../../lib/motion'

type CassetteProps = {
  className?: string
  /** Turn the reels while audio plays. */
  playing?: boolean
  /** Two-letter label stamped on the shell, e.g. "01". */
  stamp?: string
}

/**
 * Cassette with counter-rotating reels. Purely decorative — it sits next to the
 * player as artwork, and the reels only move while something is playing.
 */
export function CassetteArtwork({ className, playing = false, stamp }: CassetteProps) {
  const { still } = useMotionPrefs()
  const turning = playing && !still

  return (
    <div
      aria-hidden="true"
      className={`relative aspect-[3/2] w-full rounded-[4px] border border-line bg-surface-2 ${className ?? ''}`}
    >
      {/* Tape window */}
      <div className="absolute inset-x-[12%] top-[26%] h-[42%] overflow-hidden rounded-[3px] border border-line bg-ink">
        <div className="absolute inset-x-[14%] top-1/2 h-[62%] -translate-y-1/2 bg-[repeating-linear-gradient(90deg,#241014_0_3px,#3a1a20_3px_5px)] opacity-70" />

        <motion.span
          className="absolute left-1/2 top-1/2 size-[62%] -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-bone/25 bg-surface-3"
          animate={turning ? { rotate: 360 } : { rotate: 0 }}
          transition={turning ? { duration: 1.8, ease: 'linear', repeat: Infinity } : { duration: 0 }}
        >
          <span className="absolute left-1/2 top-1/2 size-[34%] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-bone/20" />
        </motion.span>

        <motion.span
          className="absolute left-1/2 top-1/2 size-[62%] -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-bone/25 bg-surface-3"
          animate={turning ? { rotate: -360 } : { rotate: 0 }}
          transition={turning ? { duration: 1.8, ease: 'linear', repeat: Infinity } : { duration: 0 }}
        >
          <span className="absolute left-1/2 top-1/2 size-[34%] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-bone/20" />
        </motion.span>
      </div>

      {/* Label strip */}
      <div className="absolute inset-x-[12%] top-[12%] flex h-[10%] items-center justify-between px-[3%]">
        <span className="h-px flex-1 bg-line" />
        {stamp && (
          <span className="type-accent ml-2 text-[0.5rem] tracking-widest text-muted">
            {stamp}
          </span>
        )}
        <span className="h-px flex-1 bg-line" />
      </div>

      {/* Screws */}
      <span className="absolute bottom-[8%] left-[6%] size-1.5 rounded-full border border-line" />
      <span className="absolute bottom-[8%] right-[6%] size-1.5 rounded-full border border-line" />
    </div>
  )
}
