import { motion } from 'framer-motion'

import { formatDate } from '../content'
import { cn } from '../lib/cn'
import { cardIn, useMotionPrefs } from '../lib/motion'
import type { Release } from '../types'

import { SmartImage } from './SmartImage'
import { StreamingLinks } from './StreamingLinks'

type ReleaseCardProps = {
  release: Release
  className?: string
}

/**
 * Release card: cover artwork, title, date, description and streaming links.
 *
 * Deliberately shows no play counts, follower counts or likes — those belong on
 * the platforms, not on an artist's own site.
 */
export function ReleaseCard({ release, className }: ReleaseCardProps) {
  const { still } = useMotionPrefs()

  return (
    <motion.article
      variants={still ? undefined : cardIn}
      className={cn('flex h-full flex-col border border-line bg-surface', className)}
    >
      <div className="relative aspect-square w-full max-w-[19rem] border-b border-line">
        {release.artwork ? (
          <SmartImage
            src={release.artwork}
            alt={`Cover artwork for ${release.title}`}
            width={800}
            height={800}
            fit="cover"
            className="h-full w-full"
            emptyLabel="Artwork coming soon"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-surface-2">
            <span className="kicker text-muted-dim">Artwork coming soon</span>
          </div>
        )}
        <span className="kicker absolute left-3 top-3 bg-ink/80 px-2 py-1 text-[0.5625rem] backdrop-blur-sm">
          {release.type}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <h3 className="text-xl text-bone">{release.title}</h3>
          {release.releaseDate && (
            <p className="type-accent mt-1.5 text-[0.6875rem] text-muted-dim">
              {formatDate(release.releaseDate)}
            </p>
          )}
        </div>

        {release.description && (
          <p className="text-[0.875rem] leading-relaxed text-muted">{release.description}</p>
        )}

        {release.tracklist && release.tracklist.length > 0 && (
          <ol className="mt-1 space-y-1.5">
            {release.tracklist.map((track, index) => (
              <li
                key={track.title}
                className="flex items-baseline gap-3 border-b border-line-soft pb-1.5 text-[0.8125rem] text-muted"
              >
                <span className="type-accent shrink-0 text-[0.6875rem] text-muted-dim">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="truncate">{track.title}</span>
              </li>
            ))}
          </ol>
        )}

        {release.links && release.links.length > 0 && (
          <StreamingLinks links={release.links} labelPrefix={release.title} className="mt-auto pt-2" />
        )}
      </div>
    </motion.article>
  )
}
