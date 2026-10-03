import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

import { cn } from '../lib/cn'
import { fadeUp, useMotionPrefs } from '../lib/motion'

type PageHeaderProps = {
  index: string
  eyebrow: string
  title: ReactNode
  lede?: ReactNode
  children?: ReactNode
  className?: string
}

/**
 * Shared masthead for every inner page, keeping the editorial numbering and big
 * display type consistent from page to page.
 */
export function PageHeader({ index, eyebrow, title, lede, children, className }: PageHeaderProps) {
  const { still } = useMotionPrefs()

  return (
    <header
      className={cn(
        'relative overflow-hidden border-b border-line pb-12 pt-28 sm:pb-16 sm:pt-36',
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[min(90rem,150%)] -translate-x-1/2 bg-[radial-gradient(50%_60%_at_50%_50%,rgba(211,18,42,0.16),transparent_70%)]"
      />

      <div className="shell relative">
        <motion.div
          variants={still ? undefined : fadeUp(18, 0.6)}
          initial={still ? undefined : 'hidden'}
          animate="visible"
        >
          <div className="mb-5 flex items-center gap-3">
            <span className="type-accent text-xs text-blood">{index}</span>
            <span aria-hidden="true" className="h-px w-8 bg-line" />
            <p className="kicker">{eyebrow}</p>
          </div>

          <h1 className="max-w-4xl text-[clamp(2.5rem,9vw,5.25rem)] text-bone">{title}</h1>

          {lede && (
            <p className="mt-6 max-w-2xl text-[0.9375rem] leading-relaxed text-muted sm:text-base">
              {lede}
            </p>
          )}

          {children && <div className="mt-8">{children}</div>}
        </motion.div>
      </div>
    </header>
  )
}
