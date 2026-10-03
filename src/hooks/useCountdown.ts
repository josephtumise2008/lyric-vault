import { useEffect, useMemo, useState } from 'react'

export type CountdownParts = {
  days: number
  hours: number
  minutes: number
  seconds: number
  /** `true` once the target time has passed. */
  done: boolean
}

const EMPTY: CountdownParts = { days: 0, hours: 0, minutes: 0, seconds: 0, done: true }

function diff(target: number): CountdownParts {
  const remaining = target - Date.now()
  if (remaining <= 0) return EMPTY

  const seconds = Math.floor(remaining / 1000) % 60
  const minutes = Math.floor(remaining / 60000) % 60
  const hours = Math.floor(remaining / 3600000) % 24
  const days = Math.floor(remaining / 86400000)

  return { days, hours, minutes, seconds, done: false }
}

/**
 * Ticking countdown to an ISO timestamp.
 *
 * Returns `{ done: true }` immediately for a missing or unparseable target, so
 * callers can hide the section instead of rendering a broken timer.
 */
export function useCountdown(isoDate?: string | null): CountdownParts {
  const target = useMemo(() => {
    if (!isoDate) return null
    const value = new Date(isoDate).getTime()
    return Number.isNaN(value) ? null : value
  }, [isoDate])

  // The interval only re-renders; the value itself is derived from the target,
  // so there is no state to synchronise and nothing to cascade.
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (target === null) return
    const id = window.setInterval(() => setTick((current) => current + 1), 1000)
    return () => window.clearInterval(id)
  }, [target])

  if (target === null) return EMPTY

  // `tick` is intentionally read so the component re-renders every second.
  void tick
  return diff(target)
}
