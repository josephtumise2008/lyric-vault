import { Play, VolumeX } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

import { cn } from '../lib/cn'
import { isSourceFailed, markSourceFailed } from '../lib/media'
import { useMotionPrefs } from '../lib/motion'

import { MediaPlaceholder } from './MediaPlaceholder'

type SmartVideoProps = {
  src: string
  /** Accessible name for the player. */
  title: string
  poster?: string
  className?: string
  videoClassName?: string
  /** Only honoured muted — autoplay with sound is blocked by every browser. */
  autoPlay?: boolean
  loop?: boolean
  /** Force native controls on. */
  controls?: boolean
  fit?: 'cover' | 'contain'
  compactPlaceholder?: boolean
  children?: ReactNode
}

/**
 * Video that behaves like an editorial player, not a browser default.
 *
 * - inline and muted by default, never autoplays with sound
 * - poster (or a painted first frame) behind a play control
 * - native controls appear once the visitor asks for playback
 * - a missing file degrades to the same placeholder the images use
 */
export function SmartVideo({
  src,
  title,
  poster,
  className,
  videoClassName,
  autoPlay = false,
  loop = false,
  controls = false,
  fit = 'cover',
  compactPlaceholder = false,
  children,
}: SmartVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [failed, setFailed] = useState(() => isSourceFailed(src))
  const [started, setStarted] = useState(false)
  const { reduce } = useMotionPrefs()

  const autoplayAllowed = autoPlay && !reduce

  useEffect(() => {
    const video = videoRef.current
    if (!video || !autoplayAllowed) return
    const attempt = video.play()
    if (attempt) {
      void attempt.then(() => setStarted(true)).catch(() => undefined)
    }
  }, [autoplayAllowed, src])

  // Paint a representative frame when there is no poster, so the card never
  // shows an empty black rectangle.
  const handleLoadedMetadata = useCallback(() => {
    const video = videoRef.current
    if (!video || poster) return
    try {
      if (Number.isFinite(video.duration) && video.duration > 0.2) {
        video.currentTime = Math.min(0.1, video.duration / 2)
      }
    } catch {
      /* seeking is best-effort — some browsers refuse before enough is buffered */
    }
  }, [poster])

  const handlePlay = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    setStarted(true)
    const attempt = video.play()
    if (attempt) void attempt.catch(() => undefined)
  }, [])

  if (failed) {
    return (
      <div className={cn('relative h-full w-full', className)}>
        <MediaPlaceholder
          src={src}
          kind="video"
          label={`Video placeholder for ${title}`}
          compact={compactPlaceholder}
        />
        {children}
      </div>
    )
  }

  return (
    <div className={cn('group/video relative h-full w-full overflow-hidden', className)}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        playsInline
        muted
        loop={loop}
        controls={controls || started}
        preload="metadata"
        aria-label={title}
        onLoadedMetadata={handleLoadedMetadata}
        onError={() => {
          markSourceFailed(src)
          setFailed(true)
        }}
        className={cn(
          'h-full w-full bg-ink-deep',
          fit === 'cover' ? 'object-cover' : 'object-contain',
          videoClassName,
        )}
      />

      {!started && !autoplayAllowed && (
        <button
          type="button"
          onClick={handlePlay}
          aria-label={`Play video: ${title}`}
          className="absolute inset-0 flex items-center justify-center bg-ink/25 transition-colors duration-500 hover:bg-ink/10"
        >
          <span className="relative flex size-14 items-center justify-center rounded-full border border-bone/25 bg-ink/55 backdrop-blur-sm transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/video:scale-110 group-hover/video:border-blood group-hover/video:bg-blood/90 sm:size-16">
            <span
              aria-hidden="true"
              className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 group-hover/video:opacity-100"
              style={{ boxShadow: '0 0 44px -6px rgba(211,18,42,0.85)' }}
            />
            <Play aria-hidden="true" className="relative size-5 translate-x-0.5 fill-current" />
          </span>
        </button>
      )}

      {!started && (
        <span className="pointer-events-none absolute bottom-3 left-3 inline-flex items-center gap-1.5 border border-bone/15 bg-ink/70 px-2 py-1 text-[0.625rem] font-medium uppercase tracking-[0.18em] text-bone-dim backdrop-blur-sm">
          <VolumeX aria-hidden="true" className="size-3" />
          Muted
        </span>
      )}

      {children}
    </div>
  )
}
