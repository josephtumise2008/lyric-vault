import { useEffect, useRef } from 'react'

import { cn } from '../../lib/cn'
import { getAnalyser } from '../../lib/audioEngine'
import { useMotionPrefs } from '../../lib/motion'

type VisualizerProps = {
  /** Draws the live spectrum when true, a static waveform when false. */
  active: boolean
  className?: string
  /** Number of bars. Fewer bars read better on small screens. */
  bars?: number
}

/** Deterministic bar heights for the idle state — no randomness per frame. */
const IDLE_PATTERN = [0.18, 0.32, 0.5, 0.28, 0.62, 0.4, 0.22, 0.46, 0.3, 0.54, 0.24, 0.38]

/**
 * Acid-green spectrum analyser.
 *
 * This is the one place the accent green is used, because it is the only thing
 * on the page that genuinely represents audio. With reduced motion it renders a
 * static bar chart instead of animating.
 */
export function AudioVisualizer({ active, className, bars = 28 }: VisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { reduce } = useMotionPrefs()
  const frameRef = useRef<number | null>(null)

  const shouldAnimate = active && !reduce

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d')
    if (!context) return

    const ratio = window.devicePixelRatio || 1
    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = Math.max(1, Math.floor(rect.width * ratio))
      canvas.height = Math.max(1, Math.floor(rect.height * ratio))
    }
    resize()

    const observer = new ResizeObserver(resize)
    observer.observe(canvas)

    const drawIdle = () => {
      const { width, height } = canvas
      context.clearRect(0, 0, width, height)
      const count = Math.min(bars, IDLE_PATTERN.length * 2)
      const gap = width / count
      const barWidth = Math.max(2, gap * 0.42)
      context.fillStyle = 'rgba(57,255,20,0.22)'
      for (let index = 0; index < count; index += 1) {
        const level = IDLE_PATTERN[index % IDLE_PATTERN.length]!
        const barHeight = Math.max(2, level * height)
        const x = index * gap + (gap - barWidth) / 2
        context.fillRect(x, height - barHeight, barWidth, barHeight)
      }
    }

    const drawLive = () => {
      const analyser = getAnalyser()
      const { width, height } = canvas

      if (!analyser) {
        drawIdle()
        return
      }

      const data = new Uint8Array(analyser.frequencyBinCount)
      analyser.getByteFrequencyData(data)

      context.clearRect(0, 0, width, height)

      // Use the lower two thirds of the spectrum — the top end is mostly
      // silence at these bitrates and looks like noise.
      const usable = Math.floor(data.length * 0.66)
      const count = Math.min(bars, usable)
      const gap = width / count
      const barWidth = Math.max(2, gap * 0.42)

      for (let index = 0; index < count; index += 1) {
        const value = data[index] ?? 0
        const level = (value / 255) * height
        const x = index * gap + (gap - barWidth) / 2
        const gradient = context.createLinearGradient(0, height, 0, height - level)
        gradient.addColorStop(0, 'rgba(57,255,20,0.35)')
        gradient.addColorStop(1, 'rgba(57,255,20,0.95)')
        context.fillStyle = gradient
        context.fillRect(x, height - Math.max(2, level), barWidth, Math.max(2, level))
      }

      frameRef.current = window.requestAnimationFrame(drawLive)
    }

    if (shouldAnimate) {
      frameRef.current = window.requestAnimationFrame(drawLive)
    } else {
      drawIdle()
    }

    return () => {
      observer.disconnect()
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current)
    }
  }, [shouldAnimate, bars])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn(
        'h-full w-full',
        active && 'drop-shadow-[0_0_8px_rgba(57,255,20,0.35)]',
        className,
      )}
    />
  )
}
