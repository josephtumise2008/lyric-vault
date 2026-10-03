import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

import { useFocusTrap } from '../hooks/useFocusTrap'
import { useLockBodyScroll } from '../hooks/useLockBodyScroll'
import { EASE, useMotionPrefs } from '../lib/motion'
import type { ImageItem } from '../types'

import { SmartImage } from './SmartImage'

type LightboxProps = {
  items: ImageItem[]
  /** `null` keeps the lightbox closed. */
  activeIndex: number | null
  onClose: () => void
  onNavigate: (index: number) => void
}

/**
 * Keyboard-accessible gallery lightbox.
 *
 * Escape closes, arrow keys move, focus is trapped inside the dialog and
 * returned to the thumbnail that opened it.
 */
export function Lightbox({ items, activeIndex, onClose, onNavigate }: LightboxProps) {
  const open = activeIndex !== null
  const { still } = useMotionPrefs()
  // Tracked by src so moving to the next photo clears the failure without an
  // effect that would cause a second render pass.
  const [failedSrc, setFailedSrc] = useState<string | null>(null)

  useLockBodyScroll(open)

  const handleEscape = useCallback(() => onClose(), [onClose])
  const dialogRef = useFocusTrap<HTMLDivElement>(open, handleEscape)

  const item = activeIndex === null ? undefined : items[activeIndex]
  const loadFailed = item !== undefined && failedSrc === item.src

  const go = useCallback(
    (delta: number) => {
      if (items.length === 0 || activeIndex === null) return
      const next = (activeIndex + delta + items.length) % items.length
      onNavigate(next)
    },
    [activeIndex, items.length, onNavigate],
  )

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        go(1)
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault()
        go(-1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, go])

  return (
    <AnimatePresence>
      {open && item && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/95 backdrop-blur-sm"
          initial={still ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={still ? { opacity: 0 } : { opacity: 0 }}
          transition={{ duration: still ? 0 : 0.3, ease: EASE }}
          onClick={onClose}
          role="presentation"
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={item.caption ?? item.alt}
            tabIndex={-1}
            className="relative flex max-h-[88dvh] w-full max-w-4xl flex-col items-center px-4 sm:px-8"
            initial={still ? false : { scale: 0.97, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            exit={still ? { opacity: 0 } : { scale: 0.98, y: 8, opacity: 0 }}
            transition={{ duration: still ? 0 : 0.35, ease: EASE }}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close image viewer"
              className="absolute -top-2 right-0 z-10 flex size-11 items-center justify-center rounded-[2px] border border-line bg-ink/80 text-bone transition-colors hover:border-blood hover:text-blood sm:-top-4 sm:right-0"
            >
              <X className="size-5" />
            </button>

            <div className="flex max-h-[74dvh] w-full items-center justify-center">
              {loadFailed ? (
                <div className="flex aspect-[4/5] w-full max-w-sm flex-col items-center justify-center gap-2 border border-dashed border-line text-center">
                  <p className="kicker text-[0.625rem]">Photo unavailable</p>
                  <p className="type-accent max-w-[80%] truncate text-xs text-muted-dim">
                    {item.src}
                  </p>
                </div>
              ) : (
                <SmartImage
                  src={item.src}
                  alt={item.alt}
                  width={item.width}
                  height={item.height}
                  fit="contain"
                  priority
                  onLoadError={() => setFailedSrc(item.src)}
                  className="max-h-[74dvh] w-auto border border-line"
                  imgClassName="mx-auto h-auto max-h-[74dvh] w-auto object-contain"
                />
              )}
            </div>

            <div className="mt-5 flex w-full items-center justify-between gap-4 border-t border-line pt-4">
              <div className="min-w-0">
                <p className="truncate text-sm text-bone">{item.caption ?? item.alt}</p>
                {item.credit && (
                  <p className="type-accent text-[0.6875rem] text-muted-dim">{item.credit}</p>
                )}
              </div>

              {items.length > 1 && (
                <div className="flex shrink-0 items-center gap-2">
                  <span className="type-accent text-[0.6875rem] text-muted-dim">
                    {(activeIndex ?? 0) + 1} / {items.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => go(-1)}
                    aria-label="Previous photo"
                    className="flex size-10 items-center justify-center rounded-[2px] border border-line text-bone transition-colors hover:border-blood hover:text-blood"
                  >
                    <ChevronLeft className="size-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => go(1)}
                    aria-label="Next photo"
                    className="flex size-10 items-center justify-center rounded-[2px] border border-line text-bone transition-colors hover:border-blood hover:text-blood"
                  >
                    <ChevronRight className="size-5" />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
