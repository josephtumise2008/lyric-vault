import { ArrowUpRight } from 'lucide-react'

import { cn } from '../lib/cn'
import type { SocialLink } from '../types'

import { BrandIcon } from './BrandIcon'

type SocialLinksProps = {
  links: SocialLink[]
  /** `icons` for a tight row of glyphs, `labels` for the full treatment. */
  layout?: 'icons' | 'labels'
  /** Shows the handle under the platform name — implied by `labels`. */
  showHandle?: boolean
  className?: string
}

/**
 * Social links rendered straight from `content.ts` — adding a platform there is
 * the only change needed.
 */
export function SocialLinks({
  links,
  layout = 'icons',
  showHandle = true,
  className,
}: SocialLinksProps) {
  if (links.length === 0) return null

  return (
    <ul className={cn('flex flex-wrap items-center gap-2', className)}>
      {links.map((link) => (
        <li key={link.id}>
          <a
            href={link.url}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={`${link.platform} — ${link.handle} (opens in a new tab)`}
            className={cn(
              'group/social flex items-center gap-2.5 rounded-[2px] border border-line text-muted transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-blood hover:text-bone hover:shadow-[0_0_28px_-10px_rgba(211,18,42,0.9)]',
              layout === 'icons' ? 'size-10 justify-center' : 'px-3.5 py-2.5',
            )}
          >
            <BrandIcon platform={link.platform} className="size-[1.05rem] shrink-0" />
            {layout === 'labels' && (
              <span className="flex flex-col leading-tight">
                <span className="text-[0.75rem] font-semibold uppercase tracking-[0.12em]">
                  {link.platform}
                </span>
                {showHandle && (
                  <span className="type-accent text-[0.6875rem] text-muted-dim">
                    {link.handle}
                  </span>
                )}
              </span>
            )}
            {layout === 'labels' && (
              <ArrowUpRight
                aria-hidden="true"
                className="size-3.5 shrink-0 text-muted-dim transition-transform duration-300 group-hover/social:-translate-y-0.5 group-hover/social:translate-x-0.5"
              />
            )}
          </a>
        </li>
      ))}
    </ul>
  )
}
