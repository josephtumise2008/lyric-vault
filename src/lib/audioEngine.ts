import { useCallback, useSyncExternalStore } from 'react'

/**
 * One audio element for the whole site.
 *
 * A single shared element is what guarantees "only one track may play at a
 * time" — every player on the page reads the same engine, so starting a track
 * anywhere stops it everywhere else.
 *
 * Autoplay is never attempted. The element is created lazily inside a user
 * gesture, which is what iOS Safari requires.
 */

export type TrackPayload = {
  id: string
  title: string
  artist: string
  src: string
  album?: string
  artwork?: string
}

export type PlayerSnapshot = {
  trackId: string | null
  playing: boolean
  loading: boolean
  currentTime: number
  duration: number
  volume: number
  muted: boolean
  error: boolean
}

const initialSnapshot: PlayerSnapshot = {
  trackId: null,
  playing: false,
  loading: false,
  currentTime: 0,
  duration: 0,
  volume: 0.9,
  muted: false,
  error: false,
}

let snapshot: PlayerSnapshot = initialSnapshot
const listeners = new Set<() => void>()

let audio: HTMLAudioElement | null = null
/** Web Audio graph, created only if the browser supports it. */
let analyserNode: AnalyserNode | null = null
let gainNode: GainNode | null = null
let audioContext: AudioContext | null = null
let mediaSourceConnected = false

function emit(patch: Partial<PlayerSnapshot>) {
  const next = { ...snapshot, ...patch }
  const changed = (Object.keys(patch) as Array<keyof PlayerSnapshot>).some(
    (key) => next[key] !== snapshot[key],
  )
  if (!changed) return
  snapshot = next
  for (const listener of listeners) listener()
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function getSnapshot(): PlayerSnapshot {
  return snapshot
}

/* -------------------------------------------------------------------------- */
/* Web Audio — powers the visualizer. Entirely optional.                        */
/* -------------------------------------------------------------------------- */

function ensureAudioGraph(element: HTMLAudioElement) {
  if (analyserNode) return
  const Ctor: typeof AudioContext | undefined =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctor) return

  try {
    const context = new Ctor()
    const analyser = context.createAnalyser()
    analyser.fftSize = 128
    analyser.smoothingTimeConstant = 0.78

    const gain = context.createGain()
    gain.gain.value = snapshot.volume

    // Routing through the graph means the element no longer outputs on its
    // own, so loudness is applied with the GainNode rather than element.volume.
    if (!mediaSourceConnected) {
      const source = context.createMediaElementSource(element)
      source.connect(analyser)
      analyser.connect(gain)
      gain.connect(context.destination)
      mediaSourceConnected = true
    }

    audioContext = context
    analyserNode = analyser
    gainNode = gain
    element.volume = 1
    element.muted = false
  } catch {
    // Safari in private mode, or a codec the graph cannot take. Audio still
    // plays — we simply lose the visualiser.
    analyserNode = null
    gainNode = null
  }
}

/** Live analyser for the visualiser, or null when unsupported. */
export function getAnalyser(): AnalyserNode | null {
  return analyserNode
}

function resumeContext() {
  if (audioContext?.state === 'suspended') {
    void audioContext.resume().catch(() => undefined)
  }
}

/* -------------------------------------------------------------------------- */
/* Media Session — lock screen / headphone controls where supported.            */
/* -------------------------------------------------------------------------- */

type NavigationHandler = (() => void) | null

let onPrevTrack: NavigationHandler = null
let onNextTrack: NavigationHandler = null

export function setQueueNavigation(
  handlers: { previous?: () => void; next?: () => void },
): void {
  onPrevTrack = handlers.previous ?? null
  onNextTrack = handlers.next ?? null
  syncMediaSession()
}

function syncMediaSession() {
  if (!('mediaSession' in navigator) || typeof MediaMetadata === 'undefined') return

  const { trackId, playing } = snapshot
  const track = trackId ? trackRegistry.get(trackId) : undefined

  if (track) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: track.artist,
      album: track.album ?? '',
      artwork: track.artwork
        ? [{ src: track.artwork, sizes: '512x512', type: 'image/jpeg' }]
        : [],
    })
  }

  navigator.mediaSession.playbackState = playing ? 'playing' : 'paused'

  // Only advertise previous/next when there is somewhere to go.
  try {
    navigator.mediaSession.setActionHandler('play', () => void play())
    navigator.mediaSession.setActionHandler('pause', () => pause())
    navigator.mediaSession.setActionHandler('seekto', (details) => {
      if (typeof details.seekTime === 'number') seekTo(details.seekTime)
    })
    navigator.mediaSession.setActionHandler('seekbackward', (details) =>
      seekTo(Math.max(0, snapshot.currentTime - (details.seekOffset ?? 10))),
    )
    navigator.mediaSession.setActionHandler('seekforward', (details) =>
      seekTo(snapshot.currentTime + (details.seekOffset ?? 10)),
    )
    navigator.mediaSession.setActionHandler('previoustrack', () => onPrevTrack?.())
    navigator.mediaSession.setActionHandler('nexttrack', () => onNextTrack?.())
  } catch {
    // Individual actions are unsupported on some browsers — harmless.
  }
}

/** Every track the site knows about, so the OS panel can name the current one. */
const trackRegistry = new Map<string, TrackPayload>()

export function registerTrack(track: TrackPayload): void {
  trackRegistry.set(track.id, track)
}

/* -------------------------------------------------------------------------- */
/* Element lifecycle                                                           */
/* -------------------------------------------------------------------------- */

function getAudio(): HTMLAudioElement {
  if (audio) return audio

  const element = new Audio()
  element.preload = 'metadata'
  element.setAttribute('playsinline', 'true')
  // Local media is served from the same origin, so this never blocks playback —
  // it is only here so a CDN-hosted file can still feed the analyser.
  element.crossOrigin = 'anonymous'

  element.addEventListener('timeupdate', () => {
    emit({ currentTime: element.currentTime })
  })
  element.addEventListener('durationchange', () => {
    emit({ duration: Number.isFinite(element.duration) ? element.duration : 0 })
  })
  element.addEventListener('play', () => emit({ playing: true, loading: false }))
  element.addEventListener('pause', () => emit({ playing: false }))
  element.addEventListener('waiting', () => emit({ loading: true }))
  element.addEventListener('canplay', () => emit({ loading: false }))
  element.addEventListener('volumechange', () => {
    emit({ volume: element.volume, muted: element.muted })
  })
  element.addEventListener('ended', () => {
    emit({ playing: false, currentTime: 0 })
    onNextTrack?.()
  })
  element.addEventListener('error', () => {
    emit({ error: true, playing: false, loading: false })
  })

  audio = element
  document.body.appendChild(element)
  return element
}

/* -------------------------------------------------------------------------- */
/* Public controls                                                             */
/* -------------------------------------------------------------------------- */

export async function play(): Promise<void> {
  const element = audio
  if (!element) return
  resumeContext()
  try {
    await element.play()
  } catch {
    emit({ playing: false })
  }
}

export function pause(): void {
  audio?.pause()
}

/** Load a track and start it. Must be called from a user gesture. */
export async function playTrack(track: TrackPayload): Promise<void> {
  const element = getAudio()
  registerTrack(track)
  ensureAudioGraph(element)
  resumeContext()

  if (snapshot.trackId !== track.id) {
    emit({
      trackId: track.id,
      currentTime: 0,
      duration: 0,
      error: false,
      loading: true,
    })
    element.src = track.src
    element.load()
    syncMediaSession()
  }

  await play()
}

/** Toggle: starts the track if it is not the active one, otherwise play/pause. */
export async function toggleTrack(track: TrackPayload): Promise<void> {
  if (snapshot.trackId === track.id) {
    if (snapshot.playing) pause()
    else await play()
    return
  }
  await playTrack(track)
}

export function seekTo(seconds: number): void {
  const element = audio
  if (!element) return
  const max = Number.isFinite(element.duration) ? element.duration : 0
  const target = Math.min(Math.max(0, seconds), max || seconds)
  element.currentTime = target
  emit({ currentTime: target })
}

export function seekBy(delta: number): void {
  seekTo(snapshot.currentTime + delta)
}

export function setVolume(value: number): void {
  const clamped = Math.min(1, Math.max(0, value))
  const element = audio

  if (gainNode) {
    // The Web Audio graph owns loudness — the element stays at full volume so
    // the analyser keeps receiving signal.
    gainNode.gain.value = clamped
    if (element) {
      element.volume = 1
      element.muted = false
    }
  } else if (element) {
    element.volume = clamped
    element.muted = clamped === 0
  }

  emit({ volume: clamped, muted: clamped === 0 })
}

export function toggleMute(): void {
  const element = audio
  if (!element) {
    emit({ muted: !snapshot.muted })
    return
  }
  element.muted = !element.muted
  emit({ muted: element.muted })
}

export function stop(): void {
  const element = audio
  if (!element) return
  element.pause()
  element.currentTime = 0
  emit({ playing: false, currentTime: 0 })
}

/** Test/dev helper. */
export function resetPlayer(): void {
  const element = audio
  if (!element) return
  element.pause()
  element.removeAttribute('src')
  element.load()
  trackRegistry.clear()
  snapshot = initialSnapshot
  for (const listener of listeners) listener()
}

/* -------------------------------------------------------------------------- */
/* React bindings                                                              */
/* -------------------------------------------------------------------------- */

/** Full state — subscribe only from a mounted player, not from every row. */
export function usePlayer(): PlayerSnapshot {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}

/**
 * Derived state for lightweight consumers such as track rows.
 * The selector must return a primitive so React can bail out of re-renders.
 */
export function usePlayerSelector<T>(selector: (state: PlayerSnapshot) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => selector(getSnapshot()),
    () => selector(initialSnapshot),
  )
}

/** `true` only while this specific track is the one playing. */
export function useIsTrackPlaying(trackId: string): boolean {
  return usePlayerSelector((state) => state.playing && state.trackId === trackId)
}

/** Stable callback factory for track rows. */
export function useToggleTrack(): (track: TrackPayload) => void {
  return useCallback((track: TrackPayload) => {
    void toggleTrack(track)
  }, [])
}
