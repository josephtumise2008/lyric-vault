import { useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'

import { cn } from '../lib/cn'
import { isSourceFailed, markSourceFailed } from '../lib/media'

import { MediaPlaceholder } from './MediaPlaceholder'

type SmartImageProps = {
  src: string
  /** Required. Describe the photograph, not the filename. */
  alt: string
  className?: string
  /** Applied to the `<img>` itself — e.g. `object-cover`. */
  imgClassName?: string
  /** Above-the-fold images skip lazy loading. */
  priority?: boolean
  sizes?: string
  /** Intrinsic size, used to reserve space and stop the page jumping. */
  width?: number
  height?: number
  fit?: 'cover' | 'contain'
  /** Rendered above the image inside the same box. */
  overlay?: ReactNode
  /** Drops the placeholder's long hint in dense grids. */
  compactPlaceholder?: boolean
  /** Custom placeholder copy, e.g. "Photo coming soon". */
  emptyLabel?: string
  /** Called when the file fails to load, in addition to showing the placeholder. */
  onLoadError?: () => void
}

/**
 * Image with lazy loading, a soft blur-in and a graceful fallback.
 *
 * A missing file never throws: the `error` event swaps in `MediaPlaceholder`,
 * and the source is remembered so sibling cards do not request it again.
 *
 * Load state is tracked *by src* rather than in a plain boolean, so changing
 * `src` re-derives the correct state during render instead of needing an effect
 * to reset it.
 */
export function SmartImage({
  src,
  alt,
  className,
  imgClassName,
  priority = false,
  sizes,
  width,
  height,
  fit = 'cover',
  overlay,
  compactPlaceholder = false,
  emptyLabel,
  onLoadError,
}: SmartImageProps) {
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null)
  const [failedSrc, setFailedSrc] = useState<string | null>(null)

  const status =
    failedSrc === src || isSourceFailed(src) ? 'error' : loadedSrc === src ? 'ready' : 'loading'

  // Reserve the intrinsic ratio so nothing reflows once the file arrives.
  const ratioStyle: CSSProperties | undefined =
    width && height ? { aspectRatio: `${width} / ${height}` } : undefined

  if (status === 'error') {
    return (
      <div className={cn('relative h-full w-full', className)}>
        <MediaPlaceholder
          src={src}
          kind="image"
          label={alt}
          compact={compactPlaceholder}
          emptyLabel={emptyLabel}
        />
        {overlay}
      </div>
    )
  }

  return (
    <div className={cn('relative h-full w-full overflow-hidden', className)} style={ratioStyle}>
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
        draggable={false}
        onLoad={() => setLoadedSrc(src)}
        onError={() => {
          markSourceFailed(src)
          setFailedSrc(src)
          onLoadError?.()
        }}
        className={cn(
          'h-full w-full transition-[opacity,filter,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]',
          fit === 'cover' ? 'object-cover' : 'object-contain',
          status === 'ready' ? 'scale-100 opacity-100 blur-0' : 'scale-[1.03] opacity-0 blur-md',
          imgClassName,
        )}
      />
      {overlay}
    </div>
  )
}
