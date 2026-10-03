/**
 * Media path helpers.
 *
 * Everything visual or audible is served from `public/`, so the browser loads a
 * local file and nothing else. No third-party media URLs, no external CDNs.
 */

export const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'avif', 'gif'] as const
export const VIDEO_EXTENSIONS = ['mp4', 'webm', 'mov', 'm4v'] as const
export const AUDIO_EXTENSIONS = ['mp3', 'm4a', 'wav', 'ogg', 'aac', 'opus'] as const

export type MediaKind = 'image' | 'video' | 'audio'

/** Lowercased extension without the dot. Returns '' when there is none. */
export function getExtension(src: string): string {
  const clean = src.split(/[?#]/)[0] ?? ''
  const name = clean.slice(clean.lastIndexOf('/') + 1)
  const dot = name.lastIndexOf('.')
  return dot === -1 ? '' : name.slice(dot + 1).toLowerCase()
}

/** Basename of a media path — used for placeholder labels and downloads. */
export function getFilename(src: string): string {
  const clean = src.split(/[?#]/)[0] ?? ''
  return clean.slice(clean.lastIndexOf('/') + 1)
}

export function isVideoSrc(src: string): boolean {
  return (VIDEO_EXTENSIONS as readonly string[]).includes(getExtension(src))
}

export function isAudioSrc(src: string): boolean {
  return (AUDIO_EXTENSIONS as readonly string[]).includes(getExtension(src))
}

/**
 * Decide what a path points at. The file extension wins, which is what lets a
 * single component render a photo or a clip with no extra configuration.
 */
export function inferKind(src: string): MediaKind {
  const ext = getExtension(src)
  if ((VIDEO_EXTENSIONS as readonly string[]).includes(ext)) return 'video'
  if ((AUDIO_EXTENSIONS as readonly string[]).includes(ext)) return 'audio'
  return 'image'
}

/** Collapse `/images//x.jpg` style sloppiness into a clean absolute path. */
export function normaliseSrc(src: string): string {
  const clean = src.split(/[?#]/)[0] ?? ''
  if (!clean.startsWith('/')) return clean
  const parts = clean.split('/').filter(Boolean)
  return `/${parts.join('/')}`
}

/**
 * Sources we have already seen fail.
 *
 * Shared across the app so one missing file is requested once, not once per
 * card that references it.
 */
const failedSources = new Set<string>()

export function markSourceFailed(src: string): void {
  failedSources.add(normaliseSrc(src))
}

export function isSourceFailed(src: string): boolean {
  return failedSources.has(normaliseSrc(src))
}

/** `true` for local files, which is the only kind this site loads. */
export function isLocalSrc(src: string): boolean {
  return src.startsWith('/') && !src.startsWith('//')
}
