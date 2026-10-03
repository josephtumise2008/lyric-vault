import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import type { Variants } from 'framer-motion'

import { cn } from '../lib/cn'
import { fadeUp, useMotionPrefs } from '../lib/motion'

type SectionProps = {
  children: ReactNode
  id?: string
  className?: string
  /** Vertical rhythm. */
  spacing?: 'none' | 'sm' | 'md' | 'lg'
  /** Adds the ambient red wash behind the content. */
  ambient?: boolean
  /** Uppercase hairline label + number above the content. */
  index?: string
  eyebrow?: string
  title?: ReactNode
  description?: ReactNode
  action?: ReactNode
  align?: 'left' | 'center'
  childrenAs?: 'section' | 'div'
}

const SPACING = {
  none: '',
  sm: 'py-12 sm:py-16',
  md: 'py-16 sm:py-24',
  lg: 'py-20 sm:py-28 lg:py-32',
}

function buildHeadingVariants(delay: number): Variants {
  return fadeUp(18, 0.65, delay)
}

/**
 * Page section with the shared editorial header treatment.
 *
 * Every page composes from this so spacing, numbering and type stay identical
 * across the site.
 */
export function Section({
  children,
  id,
  className,
  spacing = 'md',
  ambient = false,
  index,
  eyebrow,
  title,
  description,
  action,
  align = 'left',
  childrenAs: Tag = 'section',
}: SectionProps) {
  const { still } = useMotionPrefs()
  const hasHeading = Boolean(title || eyebrow || index)
  const centred = align === 'center'

  return (
    <Tag
      id={id}
      className={cn('relative overflow-hidden', SPACING[spacing], className)}
      aria-labelledby={id && title ? `${id}-heading` : undefined}
    >
      {ambient && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 left-1/2 h-72 w-[min(90rem,150%)] -translate-x-1/2 bg-[radial-gradient(50%_60%_at_50%_50%,rgba(211,18,42,0.13),transparent_70%)]"
        />
      )}

      <div className="shell relative">
        {hasHeading && (
          <div
            className={cn(
              'flex flex-col gap-6',
              action ? 'md:flex-row md:items-end md:justify-between md:gap-12' : '',
              action ? 'mb-12 sm:mb-16' : 'mb-10 sm:mb-14',
            )}
          >
            <motion.div
              variants={still ? undefined : buildHeadingVariants(0)}
              initial={still ? undefined : 'hidden'}
              whileInView={still ? undefined : 'visible'}
              viewport={{ once: true, amount: 0.3 }}
              className={cn(
                'max-w-2xl',
                centred ? 'mx-auto text-center' : '',
                action ? 'md:flex-1' : '',
              )}
            >
              {(index || eyebrow) && (
                <div
                  className={cn('mb-4 flex items-center gap-3', centred ? 'justify-center' : '')}
                >
                  {index && (
                    <span className="type-accent text-xs text-blood" aria-hidden="true">
                      {index}
                    </span>
                  )}
                  {index && eyebrow && <span aria-hidden="true" className="h-px w-8 bg-line" />}
                  {eyebrow && <p className="kicker">{eyebrow}</p>}
                </div>
              )}

              {title && (
                <h2
                  id={id ? `${id}-heading` : undefined}
                  className="text-[clamp(1.875rem,5.5vw,3.5rem)] text-bone"
                >
                  {title}
                </h2>
              )}

              {description && (
                <p
                  className={cn(
                    'mt-5 text-[0.9375rem] leading-relaxed text-muted sm:text-base',
                    centred ? 'mx-auto max-w-xl' : 'max-w-xl',
                  )}
                >
                  {description}
                </p>
              )}
            </motion.div>

            {action && (
              <motion.div
                variants={still ? undefined : buildHeadingVariants(0.08)}
                initial={still ? undefined : 'hidden'}
                whileInView={still ? undefined : 'visible'}
                viewport={{ once: true, amount: 0.3 }}
                className="shrink-0"
              >
                {action}
              </motion.div>
            )}
          </div>
        )}

        {children}
      </div>
    </Tag>
  )
}
