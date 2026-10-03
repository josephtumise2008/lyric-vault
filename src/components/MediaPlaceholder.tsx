import { Film, ImageOff } from 'lucide-react'

import { cn } from '../lib/cn'
import { getFilename } from '../lib/media'
import type { MediaKind } from '../lib/media'

type MediaPlaceholderProps = {
  /** Original media path — shown so it is obvious which file is missing. */
  src?: string
  kind?: MediaKind
  label?: string
  className?: string
  /** Compact drops the corner marks and the long hint, for dense grids. */
  compact?: boolean
  /** Overrides the default "Media slot" copy. */
  emptyLabel?: string
}

/**
 * Shown whenever a file in `public/` has not been added yet.
 *
 * Styled as an editorial photo slot rather than a broken-image box, so a
 * half-finished media library still reads as a designed page.
 */
export function MediaPlaceholder({
  src,
  kind = 'image',
  label,
  className,
  compact = false,
  emptyLabel,
}: MediaPlaceholderProps) {
  const filename = src ? getFilename(src) : undefined
  const Icon = kind === 'video' ? Film : ImageOff
  const headline = emptyLabel ?? 'Media slot'

  return (
    <div
      className={cn(
        'relative isolate flex h-full w-full flex-col items-center justify-center overflow-hidden bg-surface text-center hatch',
        className,
      )}
      role="img"
      aria-label={label ?? `Placeholder for ${filename ?? 'missing media'}`}
    >
      {!compact && (
        <>
          <span aria-hidden="true" className="absolute left-3 top-3 h-3 w-3 border-l border-t border-line" />
          <span aria-hidden="true" className="absolute right-3 top-3 h-3 w-3 border-r border-t border-line" />
          <span aria-hidden="true" className="absolute bottom-3 left-3 h-3 w-3 border-b border-l border-line" />
          <span aria-hidden="true" className="absolute bottom-3 right-3 h-3 w-3 border-b border-r border-line" />
        </>
      )}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(60%_100%_at_50%_100%,rgba(211,18,42,0.18),transparent_70%)]"
      />

      <div className="relative flex max-w-[82%] flex-col items-center gap-2">
        <Icon aria-hidden="true" className="size-4 text-muted-dim" strokeWidth={1.5} />
        <p className="kicker text-[0.625rem] leading-tight">{headline}</p>
        {filename && !compact && (
          <p className="type-accent max-w-full truncate text-[0.6875rem] text-muted-dim">
            {filename}
          </p>
        )}
      </div>

      {!compact && !emptyLabel && (
        <p className="relative mt-4 px-6 text-center text-[0.625rem] leading-relaxed text-muted-dim/80">
          Add this file to <span className="type-accent text-muted">public/</span> — temporary
          until then.
        </p>
      )}
    </div>
  )
}
