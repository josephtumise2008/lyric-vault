import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

import { cn } from '../lib/cn'
import { stagger, useMotionPrefs } from '../lib/motion'
import type { ImageItem, VideoItem } from '../types'

import { MediaCard } from './MediaCard'
import type { MediaCardVariant } from './MediaCard'

type GridColumns = 2 | 3 | 4

const COLUMNS: Record<GridColumns, string> = {
  2: 'grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-6 sm:gap-y-11',
  3: 'grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-12',
  4: 'grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 sm:gap-x-6',
}

export type MediaGridProps = {
  items: Array<ImageItem | VideoItem>
  columns?: GridColumns
  variant?: MediaCardVariant
  /** Hides captions and credit lines — used when a custom trigger is rendered. */
  showMeta?: boolean
  /** Staggered entrance. Turn off when the items live inside another stagger. */
  animate?: boolean
  priorityCount?: number
  className?: string
  emptyMessage?: ReactNode
  /** Rendered instead of a plain card, e.g. a lightbox trigger. */
  renderItem?: (item: ImageItem | VideoItem, index: number) => ReactNode
}

/**
 * Responsive grid of media with a staggered entrance.
 *
 * Mobile-first: two columns on phones, opening up at `sm` and `lg`. The grid
 * never stretches an item past its natural size — the low-resolution photographs
 * stay crisp.
 */
export function MediaGrid({
  items,
  columns = 3,
  variant = 'frame',
  showMeta = true,
  animate = true,
  priorityCount = 0,
  className,
  emptyMessage,
  renderItem,
}: MediaGridProps) {
  const { still } = useMotionPrefs()

  if (items.length === 0) {
    return (
      <div className="border border-dashed border-line px-6 py-14 text-center">
        <p className="type-accent text-sm text-muted">{emptyMessage ?? 'Nothing here yet.'}</p>
      </div>
    )
  }

  return (
    <motion.div
      className={cn('grid items-start', COLUMNS[columns], className)}
      variants={animate && !still ? stagger(0.07) : undefined}
      initial={animate && !still ? 'hidden' : undefined}
      whileInView={animate && !still ? 'visible' : undefined}
      viewport={animate && !still ? { once: true, amount: 0.05 } : undefined}
    >
      {items.map((item, index) =>
        renderItem ? (
          <div key={item.id}>{renderItem(item, index)}</div>
        ) : (
          <MediaCard
            key={item.id}
            item={item}
            index={index}
            variant={variant}
            showMeta={showMeta}
            priority={index < priorityCount}
          />
        ),
      )}
    </motion.div>
  )
}
