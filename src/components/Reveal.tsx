import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

import { cn } from '../lib/cn'
import { fadeUp, stagger, useMotionPrefs } from '../lib/motion'

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  /** How far the element travels, in pixels. */
  distance?: number
  duration?: number
  /** Fraction of the element that must be visible before revealing. */
  amount?: number
  as?: 'div' | 'section' | 'li' | 'article' | 'header' | 'footer' | 'figure'
}

/**
 * Scroll reveal. Renders its final state immediately when the visitor has asked
 * for reduced motion.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  distance = 20,
  duration = 0.7,
  amount = 0.2,
  as = 'div',
}: RevealProps) {
  const { still } = useMotionPrefs()
  const MotionTag = motion[as]

  if (still) {
    const Tag = as
    return <Tag className={className}>{children}</Tag>
  }

  return (
    <MotionTag
      className={cn(className)}
      variants={fadeUp(distance, duration, delay)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
    >
      {children}
    </MotionTag>
  )
}

type StaggerProps = {
  children: ReactNode
  className?: string
  step?: number
  amount?: number
  as?: 'div' | 'ul' | 'ol'
}

/** Parent that hands `cardIn` to each child, one after another. */
export function Stagger({ children, className, step = 0.07, amount = 0.05, as = 'div' }: StaggerProps) {
  const { still } = useMotionPrefs()
  const MotionTag = motion[as]

  if (still) {
    const Tag = as
    return <Tag className={className}>{children}</Tag>
  }

  return (
    <MotionTag
      className={cn(className)}
      variants={stagger(step)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
    >
      {children}
    </MotionTag>
  )
}
