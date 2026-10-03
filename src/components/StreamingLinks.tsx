import { cn } from '../lib/cn'
import type { StreamingLink } from '../types'

import { BrandIcon } from './BrandIcon'

type StreamingLinksProps = {
  links: StreamingLink[]
  /** Accessible prefix, e.g. "Neon Rot on". */
  labelPrefix?: string
  size?: 'sm' | 'md'
  className?: string
}

/**
 * "Where can I listen?" row. Every entry is a real link, so middle-click,
 * copy-link and keyboard activation all work.
 */
export function StreamingLinks({
  links,
  labelPrefix,
  size = 'md',
  className,
}: StreamingLinksProps) {
  if (links.length === 0) return null

  return (
    <ul className={cn('flex flex-wrap items-center gap-2', className)}>
      {links.map((link) => (
        <li key={link.url}>
          <a
            href={link.url}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={`${labelPrefix ? `${labelPrefix} on ` : ''}${link.label ?? link.platform} (opens in a new tab)`}
            className={cn(
              'flex items-center gap-2 rounded-[2px] border border-line font-semibold uppercase tracking-[0.14em] text-muted transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-blood hover:bg-blood/10 hover:text-bone',
              size === 'sm' ? 'h-9 px-3 text-[0.625rem]' : 'h-10 px-4 text-[0.6875rem]',
            )}
          >
            <BrandIcon platform={link.platform} className="size-[0.95rem] shrink-0" />
            {link.label ?? link.platform}
          </a>
        </li>
      ))}
    </ul>
  )
}
