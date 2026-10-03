import { Pause, Play, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react'
import { useCallback } from 'react'

import { ARTIST_NAME, formatTime } from '../../content'
import { cn } from '../../lib/cn'
import {
  pause as pausePlayback,
  play as resumePlayback,
  seekBy,
  seekTo,
  setVolume,
  toggleMute,
  usePlayer,
} from '../../lib/audioEngine'

import { AudioVisualizer } from './AudioVisualizer'

type AudioPlayerProps = {
  /** Track currently loaded in the shared engine. */
  trackId: string
  title: string
  /** Shown when the visitor is looking at a different track than this one. */
  active: boolean
  onPlay: () => void
  /** Optional previous / next for queue-style players. */
  onPrevious?: () => void
  onNext?: () => void
  className?: string
  /** Compact drops the volume control for tight rows. */
  compact?: boolean
}

/**
 * Custom audio player.
 *
 * The native `<audio controls>` interface is never shown — every control here is
 * a real focusable button, which is what makes the player usable on a phone, on
 * a keyboard, and with a screen reader. Playback is driven by the shared engine
 * in `lib/audioEngine.ts`, so only one track can ever play at a time.
 */
export function AudioPlayer({
  trackId,
  title,
  active,
  onPlay,
  onPrevious,
  onNext,
  className,
  compact = false,
}: AudioPlayerProps) {
  const state = usePlayer()
  const isCurrent = state.trackId === trackId
  const playing = isCurrent && state.playing
  const duration = isCurrent && state.duration > 0 ? state.duration : 0
  const currentTime = isCurrent ? state.currentTime : 0
  const progress = duration > 0 ? currentTime / duration : 0
  const failed = isCurrent && state.error

  const handlePlay = useCallback(() => {
    if (isCurrent) {
      if (state.playing) pausePlayback()
      else void resumePlayback()
      return
    }
    onPlay()
  }, [isCurrent, state.playing, onPlay])

  // Arrow keys scrub — scoped to the player so the page still scrolls
  // normally everywhere else, and never while a text field has focus.
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const target = event.target as HTMLElement
      const tag = target.tagName
      if (
        tag === 'INPUT' ||
        tag === 'TEXTAREA' ||
        tag === 'SELECT' ||
        target.isContentEditable
      ) {
        return
      }
      if (!isCurrent) return

      if (event.key === 'ArrowRight') {
        event.preventDefault()
        seekBy(5)
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault()
        seekBy(-5)
      }
    },
    [isCurrent],
  )

  return (
    <div
      className={cn(
        'border border-line bg-surface',
        className,
        active && 'border-blood/45 shadow-[0_0_40px_-24px_rgba(211,18,42,0.85)]',
      )}
      onKeyDown={handleKeyDown}
    >
      {/* Transport */}
      <div className="flex items-center gap-3 p-3 sm:gap-4 sm:p-4">
        <button
          type="button"
          onClick={handlePlay}
          aria-label={playing ? `Pause ${title}` : `Play ${title}`}
          aria-pressed={playing}
          className={cn(
            'flex size-12 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-95 sm:size-14',
            playing
              ? 'border-blood bg-blood text-bone shadow-[0_0_28px_-8px_rgba(211,18,42,0.95)]'
              : 'border-line bg-ink text-bone hover:border-blood hover:bg-blood/15',
          )}
        >
          {playing ? (
            <Pause aria-hidden="true" className="size-5 fill-current" />
          ) : (
            <Play aria-hidden="true" className="size-5 translate-x-0.5 fill-current" />
          )}
        </button>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-bone">{title}</p>
          <p className="kicker mt-0.5 text-[0.625rem]">
            {active
              ? failed
                ? 'Unavailable'
                : state.loading
                  ? 'Buffering'
                  : playing
                    ? 'Playing'
                    : 'Paused'
              : ARTIST_NAME}
          </p>
        </div>

        {!compact && (onPrevious || onNext) && (
          <div className="hidden items-center gap-1 sm:flex">
            {onPrevious && (
              <button
                type="button"
                onClick={onPrevious}
                aria-label="Previous track"
                className="flex size-9 items-center justify-center rounded-[2px] text-muted transition-colors hover:bg-surface-2 hover:text-bone"
              >
                <SkipBack aria-hidden="true" className="size-4" />
              </button>
            )}
            {onNext && (
              <button
                type="button"
                onClick={onNext}
                aria-label="Next track"
                className="flex size-9 items-center justify-center rounded-[2px] text-muted transition-colors hover:bg-surface-2 hover:text-bone"
              >
                <SkipForward aria-hidden="true" className="size-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Seek bar */}
      <div className="border-t border-line px-3 pb-1 pt-3 sm:px-4">
        <label className="sr-only" htmlFor={`seek-${trackId}`}>
          Seek through {title}
        </label>
        <input
          id={`seek-${trackId}`}
          type="range"
          className="seek-range"
          min={0}
          max={Math.max(duration, 0.1)}
          step={0.1}
          value={currentTime}
          disabled={!isCurrent}
          onChange={(event) => seekTo(Number(event.target.value))}
          aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
          style={{
            // Filled portion of the track, drawn behind the thumb.
            background: `linear-gradient(to right, #d3122a ${progress * 100}%, #2a2a2f ${
              progress * 100
            }%)`,
            backgroundSize: '100% 0.25rem',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />

        <div className="flex items-center justify-between pb-2">
          <span className="type-accent text-[0.6875rem] tabular-nums text-muted">
            {formatTime(currentTime)}
          </span>
          <span className="type-accent text-[0.6875rem] tabular-nums text-muted-dim">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Visualiser + volume */}
      <div className="flex items-center gap-4 border-t border-line px-3 py-3 sm:px-4">
        <div className="h-9 min-w-0 flex-1">
          <AudioVisualizer active={playing} bars={compact ? 18 : 32} />
        </div>

        {!compact && (
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={toggleMute}
              aria-label={state.muted ? 'Unmute' : 'Mute'}
              aria-pressed={state.muted}
              className="flex size-9 items-center justify-center rounded-[2px] text-muted transition-colors hover:bg-surface-2 hover:text-bone"
            >
              {state.muted ? (
                <VolumeX aria-hidden="true" className="size-4" />
              ) : (
                <Volume2 aria-hidden="true" className="size-4" />
              )}
            </button>
            <label className="sr-only" htmlFor={`volume-${trackId}`}>
              Volume
            </label>
            <input
              id={`volume-${trackId}`}
              type="range"
              className="seek-range w-20 sm:w-24"
              min={0}
              max={1}
              step={0.01}
              value={state.volume}
              onChange={(event) => setVolume(Number(event.target.value))}
              aria-valuetext={`${Math.round(state.volume * 100)} percent`}
              style={{
                background: `linear-gradient(to right, #8a8a94 ${state.volume * 100}%, #2a2a2f ${
                  state.volume * 100
                }%)`,
                backgroundSize: '100% 0.25rem',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            />
          </div>
        )}
      </div>

      {/* Missing file — say so rather than leaving a dead control. */}
      {failed && (
        <p className="type-accent border-t border-line px-3 py-2.5 text-[0.6875rem] text-gold sm:px-4">
          This audio file has not been uploaded yet. Add it to{' '}
          <span className="text-bone">public/audio/</span> and it will play here.
        </p>
      )}
    </div>
  )
}
