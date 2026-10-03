import { Link } from 'react-router-dom'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'

import { cn } from '../lib/cn'

type Variant = 'primary' | 'accent' | 'outline' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

const BASE =
  'group/btn relative inline-flex select-none items-center justify-center gap-2 rounded-[2px] font-semibold uppercase tracking-[0.14em] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] active:translate-y-px disabled:pointer-events-none disabled:opacity-50'

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-blood text-bone hover:bg-blood-soft shadow-[0_10px_30px_-16px_rgba(211,18,42,0.95)] hover:shadow-[0_16px_42px_-14px_rgba(211,18,42,1)]',
  accent: 'bg-gold text-ink hover:bg-[#ffc21f] shadow-[0_10px_30px_-16px_rgba(245,179,1,0.9)]',
  outline: 'border border-line bg-transparent text-bone hover:border-blood hover:bg-blood/10',
  ghost: 'border border-transparent text-muted hover:text-bone',
}

const SIZES: Record<Size, string> = {
  sm: 'h-9 px-4 text-[0.6875rem]',
  md: 'h-11 px-6 text-xs sm:h-12 sm:px-7',
  lg: 'h-12 px-7 text-xs sm:h-14 sm:px-9 sm:text-sm',
}

type StyleProps = {
  variant?: Variant
  size?: Size
  className?: string
}

type SharedProps = StyleProps & {
  children: ReactNode
  /** Internal route. */
  to?: string
  /** Any URL, internal or external. */
  href?: string
  /**
   * Open in a new tab. Defaults to true for `http(s)` hrefs so external links
   * are handled safely without repeating the props at every call site.
   */
  external?: boolean
}

type ButtonProps = SharedProps &
  (
    | Omit<ComponentPropsWithoutRef<'button'>, 'className' | 'children'>
    | Omit<ComponentPropsWithoutRef<'a'>, 'className' | 'children' | 'href'>
  )

function classesFor({ variant = 'primary', size = 'md', className }: StyleProps) {
  return cn(BASE, VARIANTS[variant], SIZES[size], className)
}

/**
 * One button shape for every call to action.
 *
 * Renders a router `<Link>`, an `<a>` or a `<button>` depending on the props it
 * is given, so the element always carries the correct semantics and keyboard
 * behaviour.
 */
export function Button(props: ButtonProps) {
  const { children, variant, size, className, to, href, external, ...rest } = props as SharedProps &
    Record<string, unknown>

  const classes = classesFor({ variant, size, className })

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    )
  }

  if (href) {
    const opensInNewTab = external ?? /^https?:\/\//i.test(href)
    const linkProps = opensInNewTab ? { target: '_blank', rel: 'noreferrer noopener' } : {}

    return (
      <a href={href} className={classes} {...linkProps} {...rest}>
        {children}
      </a>
    )
  }

  return (
    <button
      type={(rest.type as 'button' | 'submit') ?? 'button'}
      className={classes}
      {...rest}
    >
      {children}
    </button>
  )
}
