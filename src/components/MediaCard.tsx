import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

import { cn } from '../lib/cn'
import { inferKind, isSourceFailed } from '../lib/media'
import { cardIn, useMotionPrefs } from '../lib/motion'
import type { ImageItem, VideoItem } from '../types'

import { SmartImage } from './SmartImage'
import { SmartVideo } from './SmartVideo'

export type MediaCardVariant =
  | 'polaroid'
  | 'frame'
  | 'square'
  | 'landscape'
  | 'portrait'

type AnyMedia = ImageItem | VideoItem

function isVideo(item: AnyMedia): item is VideoItem {
  return inferKind(item.src) === 'video'
}

/**
 * Caps on rendered width.
 *
 * The supplied photographs are small, so they are presented inside frames at
 * their natural size or close to it. Nothing here can stretch them across a
 * whole viewport and turn them blurry.
 */
const MAX_WIDTH: Record<MediaCardVariant, string> = {
  polaroid: 'max-w-[16rem] sm:max-w-[17.5rem]',
  frame: 'max-w-[20rem]',
  square: 'max-w-[18rem]',
  landscape: 'max-w-[24rem]',
  portrait: 'max-w-[15rem]',
}

const ASPECT: Record<MediaCardVariant, string> = {
  polaroid: 'aspect-[4/5]',
  frame: 'aspect-[4/5]',
  square: 'aspect-square',
  landscape: 'aspect-[4/3]',
  portrait: 'aspect-[3/4]',
}

export type MediaCardProps = {
  item: AnyMedia
  index?: number
  variant?: MediaCardVariant
  className?: string
  showMeta?: boolean
  priority?: boolean
  sizes?: string
  /** Internal route or external URL the card links to. */
  to?: string
  /** Hides the corner index — used in tight grids. */
  showIndex?: boolean
  children?: ReactNode
}

/**
 * The single media card used across the site.
 *
 * It detects images and video from the file extension, so adding a `.mp4` or a
 * `.jpg` to `src/content.ts` needs no component changes.
 */
export function MediaCard({
  item,
  index,
  variant = 'frame',
  className,
  showMeta = true,
  priority = false,
  sizes,
  to,
  showIndex = true,
  children,
}: MediaCardProps) {
  const { still } = useMotionPrefs()
  const kind = inferKind(item.src)
  const missing = isSourceFailed(item.src)
  const indexLabel = typeof index === 'number' ? String(index + 1).padStart(2, '0') : null
  const alt = 'alt' in item ? item.alt ?? item.title ?? '' : ''
  const title = item.title ?? item.caption ?? alt

  const media = isVideo(item) ? (
    <SmartVideo src={item.src} poster={item.poster} title={title} className="h-full w-full" />
  ) : (
    <SmartImage
      src={item.src}
      alt={alt}
      priority={priority}
      sizes={sizes}
      width={'width' in item ? item.width : undefined}
      height={'height' in item ? item.height : undefined}
      className="h-full w-full"
    />
  )

  const flags = (
    <div className="pointer-events-none absolute right-3 top-3 flex flex-col items-end gap-1">
      {kind === 'video' && !missing && (
        <span className="bg-ink/75 px-1.5 py-0.5 text-[0.5625rem] font-semibold uppercase tracking-[0.18em] text-bone-dim backdrop-blur-sm">
          Video
        </span>
      )}
      {missing && (
        <span className="bg-ink/80 px-1.5 py-0.5 text-[0.5625rem] font-semibold uppercase tracking-[0.18em] text-gold">
          Pending
        </span>
      )}
    </div>
  )

  const inner = (
    <figure className={cn('w-full', MAX_WIDTH[variant])}>
      {variant === 'polaroid' ? (
        <div className="tape-frame">
          <div className={cn('relative w-full overflow-hidden bg-ink-deep', ASPECT[variant])}>
            {media}
          </div>
          {showMeta && (item.caption || item.credit) && (
            <figcaption className="absolute inset-x-0 bottom-0 flex items-baseline justify-between gap-2 px-2.5 pb-2.5">
              <span className="type-accent truncate text-[0.6875rem] text-bone-dim">
                {item.caption ?? title}
              </span>
              {item.credit && (
                <span className="type-accent shrink-0 text-[0.625rem] text-muted-dim">
                  {item.credit}
                </span>
              )}
            </figcaption>
          )}
          {indexLabel && showIndex && (
            <span className="type-accent absolute right-3 top-2 text-[0.625rem] text-muted-dim">
              {indexLabel}
            </span>
          )}
          {flags}
        </div>
      ) : (
        <>
          <div className={cn('media-frame w-full', ASPECT[variant])}>
            <div className="absolute inset-0">{media}</div>

            {showMeta && (
              <>
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-3">
                  <p className="kicker line-clamp-1 text-[0.625rem] text-bone/90">{title}</p>
                  {indexLabel && showIndex && (
                    <span className="type-accent shrink-0 text-[0.6875rem] text-bone/55">
                      {indexLabel}
                    </span>
                  )}
                </div>
              </>
            )}

            {indexLabel && showIndex && !showMeta && (
              <span className="type-accent pointer-events-none absolute left-3 top-3 text-[0.6875rem] text-bone/40">
                {indexLabel}
              </span>
            )}

            {flags}
          </div>

          {showMeta && (item.caption || item.credit) && (
            <figcaption className="mt-2.5 flex items-baseline justify-between gap-3">
              <span className="text-[0.8125rem] leading-snug text-muted">
                {item.caption ?? title}
              </span>
              {item.credit && (
                <span className="type-accent shrink-0 text-[0.6875rem] text-muted-dim">
                  {item.credit}
                </span>
              )}
            </figcaption>
          )}
        </>
      )}
    </figure>
  )

  const content = to ? (
    to.startsWith('/') ? (
      <Link to={to} aria-label={title} className="block w-fit">
        {inner}
      </Link>
    ) : (
      <a href={to} target="_blank" rel="noreferrer noopener" aria-label={`${title} (opens in a new tab)`} className="block w-fit">
        {inner}
      </a>
    )
  ) : (
    inner
  )

  return (
    <motion.div
      variants={still ? undefined : cardIn}
      className={cn('w-fit', className)}
      whileHover={still ? undefined : { y: -5 }}
      transition={{ type: 'spring', stiffness: 260, damping: 26 }}
    >
      {content}
      {children}
    </motion.div>
  )
}
