import { useReducedMotion } from 'framer-motion'
import type { Transition, Variants } from 'framer-motion'

/** Matches `--ease-out-expo` in index.css. */
export const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]
export const EASE_IO: [number, number, number, number] = [0.65, 0, 0.35, 1]

export const springSoft: Transition = {
  type: 'spring',
  stiffness: 220,
  damping: 28,
  mass: 0.9,
}

/** Scroll reveal — rises a short distance and fades in. */
export function fadeUp(distance = 20, duration = 0.7, delay = 0): Variants {
  return {
    hidden: { opacity: 0, y: distance },
    visible: { opacity: 1, y: 0, transition: { duration, delay, ease: EASE } },
  }
}

/** Parent that hands the reveal to each child, one after another. */
export function stagger(step = 0.08, delayChildren = 0): Variants {
  return {
    hidden: {},
    visible: { transition: { staggerChildren: step, delayChildren } },
  }
}

/** Cards scale in very slightly as they enter — keeps grids calm. */
export const cardIn: Variants = {
  hidden: { opacity: 0, y: 26, scale: 0.985 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.75, ease: EASE } },
}

/** Page cross-fade used by the router transition. */
export const pageVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.25, ease: EASE_IO } },
}

/** Per-character reveal for the hero wordmark. */
export const letterIn: Variants = {
  hidden: { opacity: 0, y: '0.35em', rotate: -4 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: { duration: 0.5, delay: index * 0.035, ease: EASE },
  }),
}

export type MotionPrefs = {
  reduce: boolean
  ease: [number, number, number, number]
  /** `true` when components should render their final state with no movement. */
  still: boolean
}

/**
 * Single place to ask "is this browser asking for less motion?".
 *
 * Framer Motion animates in JS, so the `prefers-reduced-motion` block in
 * index.css is not enough on its own — components read this instead.
 */
export function useMotionPrefs(): MotionPrefs {
  const reduce = useReducedMotion() ?? false
  return { reduce, ease: EASE, still: reduce }
}
