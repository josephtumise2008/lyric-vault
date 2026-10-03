import { motion } from 'framer-motion'

import { useMotionPrefs } from '../../lib/motion'

type SpinningArtProps = {
  className?: string
  /** Seconds per revolution. */
  duration?: number
  /** Pause the rotation — used when nothing is playing. */
  spinning?: boolean
  /** Vinyl label colour. */
  labelClassName?: string
}

/**
 * Record that turns while audio plays and stops when it does not.
 * With reduced motion it renders as a static disc.
 */
export function VinylArtwork({
  className,
  duration = 3.6,
  spinning = false,
  labelClassName = 'bg-blood',
}: SpinningArtProps) {
  const { still } = useMotionPrefs()
  const turning = spinning && !still

  return (
    <div
      aria-hidden="true"
      className={`relative aspect-square rounded-full border border-line bg-[radial-gradient(circle,#1b1b1e_0%,#0a0a0b_70%)] ${className ?? ''}`}
    >
      {/* Grooves */}
      {[0.82, 0.68, 0.54, 0.4].map((scale) => (
        <span
          key={scale}
          className="absolute inset-0 rounded-full border border-line"
          style={{ transform: `scale(${scale})` }}
        />
      ))}

      <motion.div
        className="absolute inset-0 rounded-full"
        animate={turning ? { rotate: 360 } : { rotate: 0 }}
        transition={turning ? { duration, ease: 'linear', repeat: Infinity } : { duration: 0 }}
      >
        <span className="absolute left-1/2 top-1/2 h-[3%] w-[42%] -translate-y-1/2 bg-bone/10" />
        <span className="absolute left-1/2 top-1/2 h-[3%] w-[42%] -translate-y-1/2 rotate-90 bg-bone/10" />
        <span className="absolute left-1/2 top-1/2 h-[3%] w-[42%] -translate-y-1/2 -rotate-[45deg] bg-bone/10" />
      </motion.div>

      {/* Label */}
      <span className={`absolute left-1/2 top-1/2 size-[34%] -translate-x-1/2 -translate-y-1/2 rounded-full ${labelClassName}`} />
      <span className="absolute left-1/2 top-1/2 size-[6%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink" />
    </div>
  )
}
