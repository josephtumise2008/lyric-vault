import { Pause, Play } from 'lucide-react'
import { useCallback } from 'react'

import { ARTIST_NAME } from '../../content'
import { pause, play, useIsTrackPlaying, usePlayerSelector } from '../../lib/audioEngine'
import type { TrackPayload } from '../../lib/audioEngine'
import { cn } from '../../lib/cn'

type TrackRowProps = {
  track: TrackPayload
  /** Start this track. Called only on a real user gesture. */
  onPlay: (track: TrackPayload) => void
  index?: number
  className?: string
  /** Right-hand metadata, e.g. a duration or a tag. */
  meta?: string
}

/**
 * One row in a track list.
 *
 * Rows only subscribe to the two facts they need — "am I the active track?" and
 * "am I playing?" — so a list of twenty tracks does not re-render four times a
 * second.
 */
export function TrackRow({ track, onPlay, index, className, meta }: TrackRowProps) {
  const isPlaying = useIsTrackPlaying(track.id)
  const isActive = usePlayerSelector((state) => state.trackId === track.id)

  const handleClick = useCallback(() => {
    if (isActive) {
      if (isPlaying) pause()
      else void play()
      return
    }
    onPlay(track)
  }, [isActive, isPlaying, onPlay, track])

  return (
    <div
      className={cn(
        'group flex items-center gap-3 border-b border-line py-3 transition-colors duration-300 sm:gap-4',
        isActive ? 'bg-blood/[0.06]' : 'hover:bg-surface-2/60',
        className,
      )}
    >
      {typeof index === 'number' && (
        <span className="type-accent w-6 shrink-0 text-center text-[0.6875rem] text-muted-dim">
          {String(index + 1).padStart(2, '0')}
        </span>
      )}

      <button
        type="button"
        onClick={handleClick}
        aria-label={isPlaying ? `Pause ${track.title}` : `Play ${track.title}`}
        aria-pressed={isPlaying}
        className={cn(
          'flex size-10 shrink-0 items-center justify-center rounded-full border transition-all duration-300 active:scale-95',
          isPlaying
            ? 'border-acid bg-acid/15 text-acid'
            : 'border-line bg-ink text-bone group-hover:border-blood group-hover:bg-blood/15',
        )}
      >
        {isPlaying ? (
          <Pause aria-hidden="true" className="size-4 fill-current" />
        ) : (
          <Play aria-hidden="true" className="size-4 translate-x-px fill-current" />
        )}
      </button>

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            'truncate text-sm font-medium transition-colors',
            isActive ? 'text-bone' : 'text-bone-dim group-hover:text-bone',
          )}
        >
          {track.title}
        </p>
        <p className="kicker mt-0.5 text-[0.625rem]">{track.album ?? ARTIST_NAME}</p>
      </div>

      {meta && (
        <span className="type-accent shrink-0 text-[0.6875rem] text-muted-dim">{meta}</span>
      )}
    </div>
  )
}
